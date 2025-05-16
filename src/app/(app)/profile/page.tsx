// src/app/(app)/profile/page.tsx
'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { User as SupabaseAuthUser } from '@supabase/supabase-js';
import { 
  UserCircle, 
  Mail, 
  Phone, 
  Save, 
  ShieldAlert, 
  UploadCloud, 
  Image as ImageIcon, 
  Edit3 // <--- IMPORTAÇÃO ADICIONADA
} from 'lucide-react';
import Link from 'next/link';
import NextImage from 'next/image';

interface PipecorUserProfile {
  id: string;
  name: string | null;
  phone_number: string | null;
  role: string | null;
  status: string | null;
  avatar_url?: string | null;
}

export default function ProfilePage() {
  const supabase = createSupabaseBrowserClient();
  const [authUser, setAuthUser] = useState<SupabaseAuthUser | null>(null);
  const [pipecorProfile, setPipecorProfile] = useState<PipecorUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('Erro ao buscar sessão:', sessionError.message);
        setError('Não foi possível carregar os dados da sessão.');
        setIsLoading(false);
        return;
      }

      if (session?.user) {
        setAuthUser(session.user);
        setCurrentAvatarUrl(session.user.user_metadata?.avatar_url || null);

        // IMPORTANTE: Certifique-se de que Row Level Security (RLS) está habilitada
        // para a tabela 'users' (ou sua tabela de perfis) no Supabase,
        // e que existem POLÍTICAS que permitem usuários autenticados
        // lerem (SELECT) e atualizarem (UPDATE) seus próprios dados.
        // Exemplo de política de leitura:
        // CREATE POLICY "Users can read their own profile"
        // ON public.users FOR SELECT
        // TO authenticated
        // USING (auth.uid() = id);
        const { data: profileData, error: profileError } = await supabase
          .from('users') // Certifique-se que 'users' é o nome correto da sua tabela de perfis no schema public
          .select('*')
          .eq('id', session.user.id) // Assumindo que 'id' na sua tabela 'users' corresponde a auth.uid()
          .single();

        if (profileError && profileError.code !== 'PGRST116') { // PGRST116 = 0 rows, o que é ok se o perfil ainda não existe
          console.error('Erro ao buscar perfil Pipecor:', profileError.message);
          setError(`Não foi possível carregar os dados do perfil: ${profileError.message}`);
        } else if (profileData) {
          setPipecorProfile(profileData as PipecorUserProfile);
          setName(profileData.name || session.user.user_metadata?.full_name || '');
          setPhoneNumber(profileData.phone_number || '');
        } else {
          // Perfil não encontrado na tabela public.users, pode ser um novo usuário
          setName(session.user.user_metadata?.full_name || '');
          console.warn("Perfil Pipecor não encontrado na tabela 'users' para o usuário:", session.user.id);
        }
      } else {
        setError('Nenhum usuário autenticado encontrado.');
      }
      setIsLoading(false);
    };

    fetchData();
  }, [supabase]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // Limite de 2MB para o avatar
        setError("O arquivo de imagem é muito grande. Máximo de 2MB.");
        setAvatarFile(null);
        setAvatarPreview(null);
        event.target.value = ''; // Limpa o input
        return;
      }
      setError(null); // Limpa erro anterior de tamanho
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarFile(null);
      setAvatarPreview(null);
    }
  };

  const handleProfileUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!authUser) {
      setError('Usuário não autenticado.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    let newAvatarUrl = currentAvatarUrl;

    if (avatarFile) {
      setIsUploading(true);
      const fileExt = avatarFile.name.split('.').pop();
      const randomSuffix = Math.random().toString(36).substring(2, 8); // Para evitar cache
      const fileName = `${authUser.id}/avatar-${randomSuffix}.${fileExt}`; 
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatarFile, {
          cacheControl: '3600',
          upsert: false, // Use false para evitar sobrescrever acidentalmente se a lógica de deleção falhar
                           // Considere deletar o avatar antigo antes de subir um novo
        });
      setIsUploading(false);

      if (uploadError) {
        console.error('Erro ao fazer upload do avatar:', uploadError);
        setError('Falha ao fazer upload da nova foto de perfil: ' + uploadError.message);
        setIsLoading(false);
        return;
      }
      
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      
      newAvatarUrl = publicUrlData?.publicUrl || null;
    }

    const { data: updatedUser, error: userMetaError } = await supabase.auth.updateUser({
      data: { 
        full_name: name,
        avatar_url: newAvatarUrl 
      } 
    });

    if (userMetaError) {
      console.warn("Erro ao atualizar user_metadata no Supabase Auth:", userMetaError.message);
    } else if (updatedUser?.user) {
        setAuthUser(updatedUser.user);
        setCurrentAvatarUrl(updatedUser.user.user_metadata?.avatar_url || null);
    }

    const { data: profileUpdateData, error: updateError } = await supabase
      .from('users')
      .update({
        name: name,
        phone_number: phoneNumber,
        avatar_url: newAvatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', authUser.id)
      .select()
      .single();

    setIsLoading(false);

    if (updateError) {
      console.error('Erro ao atualizar perfil Pipecor:', updateError.message);
      setError('Falha ao atualizar o perfil: ' + updateError.message);
    } else if (profileUpdateData) {
      setPipecorProfile(profileUpdateData as PipecorUserProfile);
      setAvatarFile(null);
      setAvatarPreview(null);
      setSuccessMessage('Perfil atualizado com sucesso!');
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  // ... (resto do JSX do componente como estava, incluindo os estados de loading e error)
  if (isLoading && !authUser) { 
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 animate-pulse">Carregando perfil...</p>
      </div>
    );
  }

  if (error && !authUser && !pipecorProfile) { // Mostrar erro principal apenas se não houver dados de perfil
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <ShieldAlert size={48} className="text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-red-700">Erro ao Carregar Perfil</h2>
        <p className="text-gray-600 mt-2">{error}</p>
      </div>
    );
  }
  
  if (!authUser) {
     return (
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <p className="text-gray-700">Usuário não autenticado. Por favor, faça login novamente.</p>
        <Link href="/login" className="mt-4 inline-block text-emerald-600 hover:text-emerald-700">
          Ir para Login
        </Link>
      </div>
    );
  }

  const displayAvatar = avatarPreview || currentAvatarUrl;

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl">
        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div className="flex flex-col items-center space-y-4 mb-8 pb-6 border-b border-gray-200">
            <div className="relative w-32 h-32">
              {displayAvatar ? (
                <NextImage
                  src={displayAvatar}
                  alt="Avatar do Usuário"
                  fill
                  sizes="128px" // Boa prática para NextImage com fill
                  className="rounded-full object-cover border-2 border-emerald-500"
                  onError={() => { // Fallback se a URL do avatar quebrar
                    console.warn("Erro ao carregar avatar:", displayAvatar);
                    setCurrentAvatarUrl(null); // Tenta limpar para mostrar o placeholder
                  }}
                />
              ) : (
                <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                  <UserCircle size={64} />
                </div>
              )}
              <label 
                htmlFor="avatar-upload"
                className="absolute -bottom-2 -right-2 bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-full cursor-pointer shadow-md transition-colors"
                title="Alterar foto de perfil"
              >
                <Edit3 size={16} />
                <input 
                  id="avatar-upload" 
                  type="file" 
                  accept="image/png, image/jpeg, image/webp" 
                  className="sr-only"
                  onChange={handleFileChange} 
                />
              </label>
            </div>
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                {name || authUser.user_metadata?.full_name || 'Meu Perfil'}
              </h1>
              <p className="text-gray-600">{authUser.email}</p>
              {pipecorProfile?.role && (
                <span className="mt-1 inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {pipecorProfile.role.replace('_', ' ').toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* Mensagens de erro e sucesso do formulário */}
          {error && !successMessage && ( // Mostra erro do formulário apenas se não houver msg de sucesso
            <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="p-3 bg-green-100 text-green-700 border border-green-300 rounded-md text-sm">
              {successMessage}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="profile-name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserCircle size={18} className="text-gray-400" />
                </div>
                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="Seu nome completo"
                />
              </div>
            </div>

            <div>
              <label htmlFor="profile-email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  id="profile-email"
                  type="email"
                  value={authUser.email || ''}
                  readOnly
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="profile-phone" className="block text-sm font-medium text-gray-700 mb-1">
              Telefone
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone size={18} className="text-gray-400" />
              </div>
              <input
                id="profile-phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="(XX) XXXXX-XXXX"
              />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isLoading || isUploading}
              className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
            >
              {isUploading ? (
                <UploadCloud size={18} className="mr-2 animate-pulse" />
              ) : isLoading && !isUploading ? ( // Mostra spinner de salvar apenas se não estiver uploadando
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <Save size={18} className="mr-2" />
              )}
              {isUploading ? 'Enviando foto...' : isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Segurança da Conta</h2>
        <p className="text-sm text-gray-600 mb-4">
          Para alterar sua senha, enviaremos um link de redefinição para o seu email.
        </p>
        <button
          onClick={async () => {
            if (authUser?.email) {
              // Usar um estado de loading específico para este botão seria melhor
              // para não afetar o botão principal de "Salvar Alterações"
              const originalIsLoading = isLoading; 
              setIsLoading(true); 
              setError(null);
              setSuccessMessage(null);
              const { error: resetError } = await supabase.auth.resetPasswordForEmail(authUser.email, {
                redirectTo: `${window.location.origin}/auth/update-password`,
              });
              if (resetError) {
                setError("Erro ao solicitar redefinição de senha: " + resetError.message);
              } else {
                setSuccessMessage("Link para redefinição de senha enviado para seu email.");
              }
              setIsLoading(originalIsLoading); // Restaura o estado de loading original
            }
          }}
          disabled={isLoading}
          className="border border-emerald-600 text-emerald-600 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-emerald-50 transition-colors disabled:opacity-70"
        >
          Alterar Senha
        </button>
      </div>
    </div>
  );
}
