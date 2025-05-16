// src/app/(app)/settings/account/page.tsx
'use client'; // Para formulários e interações de estado

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { Building, Mail, Phone, Globe, Palette, Save, Image as ImageIcon, UploadCloud } from 'lucide-react';
import NextImage from 'next/image'; // Renomeado para evitar conflito com o ícone Image
// import { createSupabaseBrowserClient } from '@/lib/supabase/client'; // Descomente quando for buscar/salvar dados
// import type { User as SupabaseAuthUser } from '@supabase/supabase-js'; // Para pegar o ID da corretora associada ao usuário

// Interface para os dados da Corretora (baseado no seu schema/modelo Corretora)
interface CorretoraSettings {
  id?: string; // ID da corretora, virá do banco
  name: string;
  tradingName: string | null;
  cnpj: string | null;
  email: string | null; // Email principal da corretora
  phoneNumber: string | null;
  websiteUrl: string | null;
  addressStreet: string | null;
  addressNumber: string | null;
  addressComplement: string | null;
  addressDistrict: string | null;
  addressCity: string | null;
  addressState: string | null;
  addressPostalCode: string | null;
  logoUrl: string | null; // URL do logo atual
  primaryColor: string | null;
  secondaryColor: string | null;
  // Adicione outros campos do seu modelo Corretora aqui
}

export default function AccountSettingsPage() {
  // const supabase = createSupabaseBrowserClient(); // Descomente para usar Supabase
  // const [currentUser, setCurrentUser] = useState<SupabaseAuthUser | null>(null);
  // const [corretoraId, setCorretoraId] = useState<string | null>(null); // Para saber qual corretora editar

  // Estado inicial com placeholders ou vazio
  const [settings, setSettings] = useState<Partial<CorretoraSettings>>({
    name: '',
    tradingName: '',
    cnpj: '',
    email: '',
    phoneNumber: '',
    websiteUrl: '',
    addressStreet: '',
    addressNumber: '',
    addressComplement: '',
    addressDistrict: '',
    addressCity: '',
    addressState: '',
    addressPostalCode: '',
    logoUrl: null, // Começa sem logo
    primaryColor: '#10B981', // Verde Esmeralda padrão
    secondaryColor: '#0EA5E9', // Azul Céu padrão
  });
  const [isLoading, setIsLoading] = useState(false); // Para feedback de carregamento de dados
  const [isSaving, setIsSaving] = useState(false); // Para feedback de salvamento
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // TODO: useEffect para buscar as configurações da corretora do banco de dados
  // Este useEffect buscaria os dados da corretora associada ao usuário logado.
  // Você precisará de uma forma de obter o 'corretoraId' do usuário logado.
  // Isso pode vir dos metadados do usuário no Supabase Auth ou de uma consulta à sua tabela 'public.users'.
  useEffect(() => {
    const fetchCorretoraData = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      // const { data: { user } } = await supabase.auth.getUser();
      // if (user) {
      //   setCurrentUser(user);
      //   // Assumindo que você tem uma forma de obter o corretora_id associado ao usuário
      //   // Exemplo: buscando na sua tabela 'users' (perfis Pipecor)
      //   const { data: userProfile, error: profileError } = await supabase
      //     .from('users') // Sua tabela de perfis Pipecor
      //     .select('corretora_id') // Assumindo que há uma coluna 'corretora_id'
      //     .eq('id', user.id)
      //     .single();

      //   if (profileError || !userProfile || !userProfile.corretora_id) {
      //     console.error('Erro ao buscar perfil do usuário ou corretora_id não encontrado:', profileError);
      //     setErrorMessage('Não foi possível carregar os dados da corretora. Verifique se você está associado a uma.');
      //     setIsLoading(false);
      //     return;
      //   }
        
      //   const currentCorretoraId = userProfile.corretora_id;
      //   setCorretoraId(currentCorretoraId);

      //   const { data: corretoraData, error: corretoraError } = await supabase
      //     .from('corretoras') // Sua tabela de corretoras
      //     .select('*')
      //     .eq('id', currentCorretoraId)
      //     .single();

      //   if (corretoraError) {
      //     console.error('Erro ao buscar dados da corretora:', corretoraError);
      //     setErrorMessage('Falha ao carregar os dados da corretora.');
      //   } else if (corretoraData) {
      //     setSettings(corretoraData);
      //     if (corretoraData.logoUrl) {
      //       setLogoPreview(corretoraData.logoUrl);
      //     }
      //   }
      // } else {
      //   setErrorMessage('Usuário não autenticado.');
      // }
      
      // Simulação de carregamento de dados:
      console.log("Simulando busca de dados da corretora...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockSettings: Partial<CorretoraSettings> = {
        name: 'Pipecor Corretora Exemplo LTDA',
        tradingName: 'Pipecor Seguros Exemplo',
        cnpj: '11.222.333/0001-44',
        email: 'contato@pipecorexemplo.com',
        phoneNumber: '(21) 98877-6655',
        websiteUrl: 'https://pipecorexemplo.com',
        addressStreet: 'Avenida Principal',
        addressNumber: '456',
        addressComplement: 'Andar 3',
        addressDistrict: 'Business Park',
        addressCity: 'Rio de Janeiro',
        addressState: 'RJ',
        addressPostalCode: '20000-000',
        logoUrl: '/logo_full.png', // Usando o logo da pasta public como placeholder
        primaryColor: '#059669', // emerald-600
        secondaryColor: '#3B82F6', // blue-500
      };
      setSettings(mockSettings);
      if (mockSettings.logoUrl) setLogoPreview(mockSettings.logoUrl);

      setIsLoading(false);
    };

    fetchCorretoraData();
  // }, [supabase]); // Adicione supabase às dependências
}, []); // Rodar apenas uma vez no mount

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // Limite de 2MB
        setErrorMessage("O arquivo de logo é muito grande. Máximo de 2MB.");
        return;
      }
      setErrorMessage(null);
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    // if (!corretoraId) {
    //   setErrorMessage("ID da corretora não encontrado. Não é possível salvar.");
    //   setIsSaving(false);
    //   return;
    // }

    let updatedSettings = { ...settings };

    // TODO: Lógica para fazer upload do logoFile para o Supabase Storage se ele existir
    // if (logoFile) {
    //   const fileExt = logoFile.name.split('.').pop();
    //   const fileName = `corretora-logos/${corretoraId}/logo.${fileExt}`;
    //   const { data: uploadData, error: uploadError } = await supabase.storage
    //     .from('assets') // Ou o nome do seu bucket para logos de corretora
    //     .upload(fileName, logoFile, { upsert: true });

    //   if (uploadError) {
    //     setErrorMessage('Falha ao fazer upload do novo logo: ' + uploadError.message);
    //     setIsSaving(false);
    //     return;
    //   }
    //   const { data: publicUrlData } = supabase.storage.from('assets').getPublicUrl(fileName);
    //   updatedSettings.logoUrl = publicUrlData?.publicUrl || null;
    // }

    // TODO: Salvar `updatedSettings` na tabela 'corretoras' no Supabase
    // const { error: updateError } = await supabase
    //   .from('corretoras')
    //   .update(updatedSettings)
    //   .eq('id', corretoraId);

    // if (updateError) {
    //   setErrorMessage('Falha ao salvar configurações: ' + updateError.message);
    // } else {
    //   setSuccessMessage('Configurações salvas com sucesso!');
    //   if (updatedSettings.logoUrl) setLogoPreview(updatedSettings.logoUrl); // Atualiza preview com URL do storage
    //   setLogoFile(null); // Limpa o arquivo após o upload
    // }

    // Simulação
    console.log("Salvando configurações (simulação):", updatedSettings);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSuccessMessage('Configurações salvas com sucesso! (Simulação)');
    if (updatedSettings.logoUrl) setLogoPreview(updatedSettings.logoUrl);
    setLogoFile(null);

    setIsSaving(false);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  if (isLoading) {
      return (
        <div className="bg-white p-8 rounded-xl shadow-xl text-center flex justify-center items-center h-64">
            <p className="text-gray-500 animate-pulse">Carregando configurações da corretora...</p>
        </div>
      );
  }
  if (errorMessage && !settings.name) { // Mostra erro apenas se não conseguiu carregar nada
     return (
        <div className="bg-white p-8 rounded-xl shadow-xl text-center">
            <p className="text-red-600">{errorMessage}</p>
        </div>
     );
  }


  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center">
            <Building size={28} className="mr-3 text-emerald-600" />
            Dados da Corretora
        </h1>
        <p className="text-sm text-gray-600 mt-1">Gerencie as informações e a identidade visual da sua empresa.</p>
      </div>

      {successMessage && (
        <div className="p-3 bg-green-100 text-green-700 border border-green-300 rounded-md text-sm">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 divide-y divide-gray-200">
        {/* Seção de Identidade Visual */}
        <section className="pt-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-1">Identidade Visual</h2>
          <p className="text-sm text-gray-500 mb-4">Personalize a aparência da plataforma para sua corretora.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div>
              <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Logo da Corretora
              </label>
              <div className="mt-1 flex flex-col items-start space-y-2">
                <div className="w-40 h-16 bg-gray-100 rounded-md flex items-center justify-center border">
                    {logoPreview ? (
                    <NextImage src={logoPreview} alt="Preview do Logo" width={150} height={50} className="max-h-14 object-contain" />
                    ) : (
                    <ImageIcon size={32} className="text-gray-400" />
                    )}
                </div>
                <input 
                    type="file" 
                    id="logoUrl" 
                    name="logoUrl" 
                    onChange={handleLogoChange} 
                    accept="image/png, image/jpeg, image/webp" 
                    className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700 mb-1">
                  Cor Primária
                </label>
                <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Palette size={16} className="text-gray-400" />
                    </div>
                    <input type="color" id="primaryColor" name="primaryColor" value={settings.primaryColor || '#10B981'} onChange={handleChange} className="w-full h-10 pl-10 pr-1 py-1 border border-gray-300 rounded-lg appearance-none cursor-pointer"/>
                </div>
              </div>
              <div>
                <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700 mb-1">
                  Cor Secundária
                </label>
                 <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Palette size={16} className="text-gray-400" />
                    </div>
                    <input type="color" id="secondaryColor" name="secondaryColor" value={settings.secondaryColor || '#0EA5E9'} onChange={handleChange} className="w-full h-10 pl-10 pr-1 py-1 border border-gray-300 rounded-lg appearance-none cursor-pointer"/>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Seção de Informações da Empresa */}
        <section className="pt-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-1">Informações da Empresa</h2>
          <p className="text-sm text-gray-500 mb-4">Dados cadastrais da sua corretora.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Razão Social</label>
              <input type="text" name="name" id="name" value={settings.name || ''} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm py-2.5 px-3"/>
            </div>
            <div>
              <label htmlFor="tradingName" className="block text-sm font-medium text-gray-700">Nome Fantasia</label>
              <input type="text" name="tradingName" id="tradingName" value={settings.tradingName || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm py-2.5 px-3"/>
            </div>
            <div>
              <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">CNPJ</label>
              <input type="text" name="cnpj" id="cnpj" value={settings.cnpj || ''} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm py-2.5 px-3" placeholder="00.000.000/0000-00"/>
            </div>
          </div>
        </section>

        {/* Seção de Contato */}
        <section className="pt-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-1">Contato Principal</h2>
          <p className="text-sm text-gray-500 mb-4">Como podemos entrar em contato com sua corretora.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Principal</label>
              <div className="mt-1 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input type="email" name="email" id="email" value={settings.email || ''} onChange={handleChange} required className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-2.5 px-3" placeholder="contato@suaempresa.com"/>
              </div>
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Telefone Principal</label>
              <div className="mt-1 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input type="tel" name="phoneNumber" id="phoneNumber" value={settings.phoneNumber || ''} onChange={handleChange} className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-2.5 px-3" placeholder="(XX) XXXXX-XXXX"/>
              </div>
            </div>
            <div>
              <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700">Website</label>
               <div className="mt-1 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input type="url" name="websiteUrl" id="websiteUrl" value={settings.websiteUrl || ''} onChange={handleChange} className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-2.5 px-3" placeholder="https://www.suaempresa.com.br"/>
              </div>
            </div>
          </div>
        </section>
        
        {/* Seção de Endereço */}
        <section className="pt-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-1">Endereço da Sede</h2>
          <p className="text-sm text-gray-500 mb-4">Endereço fiscal da sua corretora.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            <div className="md:col-span-2 lg:col-span-3"> {/* Logradouro ocupando mais espaço */}
              <label htmlFor="addressStreet" className="block text-sm font-medium text-gray-700">Logradouro</label>
              <input type="text" name="addressStreet" id="addressStreet" value={settings.addressStreet || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm py-2.5 px-3"/>
            </div>
            <div>
              <label htmlFor="addressNumber" className="block text-sm font-medium text-gray-700">Número</label>
              <input type="text" name="addressNumber" id="addressNumber" value={settings.addressNumber || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm py-2.5 px-3"/>
            </div>
            <div>
              <label htmlFor="addressComplement" className="block text-sm font-medium text-gray-700">Complemento</label>
              <input type="text" name="addressComplement" id="addressComplement" value={settings.addressComplement || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm py-2.5 px-3"/>
            </div>
            <div>
              <label htmlFor="addressDistrict" className="block text-sm font-medium text-gray-700">Bairro</label>
              <input type="text" name="addressDistrict" id="addressDistrict" value={settings.addressDistrict || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm py-2.5 px-3"/>
            </div>
            <div>
              <label htmlFor="addressCity" className="block text-sm font-medium text-gray-700">Cidade</label>
              <input type="text" name="addressCity" id="addressCity" value={settings.addressCity || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm py-2.5 px-3"/>
            </div>
             <div>
              <label htmlFor="addressState" className="block text-sm font-medium text-gray-700">Estado (UF)</label>
              <input type="text" name="addressState" id="addressState" value={settings.addressState || ''} onChange={handleChange} maxLength={2} className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm py-2.5 px-3" placeholder="SP"/>
            </div>
             <div>
              <label htmlFor="addressPostalCode" className="block text-sm font-medium text-gray-700">CEP</label>
              <input type="text" name="addressPostalCode" id="addressPostalCode" value={settings.addressPostalCode || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm py-2.5 px-3" placeholder="00000-000"/>
            </div>
          </div>
        </section>

        <div className="pt-5 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out flex items-center disabled:opacity-70"
          >
            {isSaving ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <Save size={18} className="mr-2" />
            )}
            {isSaving ? 'Salvando...' : 'Salvar Configurações'}
          </button>
        </div>
      </form>
    </div>
  );
}
