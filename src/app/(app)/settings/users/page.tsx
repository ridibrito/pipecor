// src/app/(app)/settings/users/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, UserCog, Search, ChevronDown, ChevronUp } from 'lucide-react';
import UserForm, { UserFormData } from '@/components/ui/settings/UserForm'; // Certifique-se que este caminho está correto
import Drawer from '@/components/ui/Drawer'; // Importando o novo componente Drawer

// Interface para exibição na tabela (pode ser diferente de UserFormData)
interface DisplayUser {
  id: string;
  name: string | null;
  email: string | null;
  role: string; 
  status: 'Ativo' | 'Inativo' | 'Pendente'; // Ajuste os status conforme seu sistema
  lastLogin?: string | null;
}

// Dados placeholder - substitua pela busca real ao Supabase
const placeholderUsers: DisplayUser[] = [
  { id: '1', name: 'Mariana Silva', email: 'mariana.silva@pipecor.com.br', role: 'Corretor', status: 'Ativo', lastLogin: '15/05/2025 10:30' },
  { id: '2', name: 'Carlos Alberto', email: 'carlos.alberto@pipecor.com.br', role: 'Gestor Comercial', status: 'Ativo', lastLogin: '16/05/2025 09:15' },
  { id: '3', name: 'Juliana Paes', email: 'juliana.paes@pipecor.com.br', role: 'Administrativo', status: 'Inativo', lastLogin: '10/04/2025 17:00' },
  { id: '4', name: 'Roberto Lima', email: 'roberto.lima@pipecor.com.br', role: 'Corretor', status: 'Pendente', lastLogin: null },
];

export default function ManageUsersPage() {
  // const supabase = createSupabaseBrowserClient(); // Descomente quando for usar Supabase
  const [users, setUsers] = useState<DisplayUser[]>(placeholderUsers);
  const [isLoading, setIsLoading] = useState(false); // Para feedback de carregamento da lista
  const [isSaving, setIsSaving] = useState(false); // Para feedback de salvamento do formulário no Drawer
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof DisplayUser | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const [isUserDrawerOpen, setIsUserDrawerOpen] = useState(false); // Estado para controlar o Drawer
  const [editingUser, setEditingUser] = useState<Partial<UserFormData> | null>(null); // Dados para o formulário no Drawer

  // TODO: useEffect para buscar os usuários da corretora logada do banco de dados Supabase
  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     setIsLoading(true);
  //     // Lógica para buscar usuários...
  //     // Ex: const { data, error } = await supabase.from('users_view').select('*').eq('corretora_id', adminUser.corretoraId);
  //     // if (data) setUsers(formatUsersForDisplay(data));
  //     setIsLoading(false);
  //   };
  //   fetchUsers();
  // }, [supabase]);

  const handleSort = (column: keyof DisplayUser) => {
    if (sortColumn === column) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (!sortColumn) return 0;
    const valA = a[sortColumn];
    const valB = b[sortColumn];
    if (valA === null || valA === undefined) return 1;
    if (valB === null || valB === undefined) return -1;
    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    // Adicionar lógica para outros tipos se necessário (datas, números)
    return 0;
  });
  
  const filteredUsers = sortedUsers.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openNewUserDrawer = () => {
    setEditingUser(null); // Garante que o formulário esteja limpo para um novo usuário
    setIsUserDrawerOpen(true);
  };

  const openEditUserDrawer = (user: DisplayUser) => {
    // Mapeia DisplayUser para UserFormData. Ajuste conforme necessário.
    // Se UserFormData tiver mais campos, você pode precisar buscá-los aqui
    // ou passar o objeto DisplayUser e o UserForm lida com a busca de detalhes se for o caso.
    setEditingUser({
      id: user.id,
      name: user.name || '',
      email: user.email || '',
      // phoneNumber: user.phoneNumber || '', // Se DisplayUser tiver phoneNumber
      role: user.role, // Certifique-se que o valor corresponde a uma opção no select do UserForm
      status: user.status as UserFormData['status'], // Cast se os enums/tipos forem diferentes
    });
    setIsUserDrawerOpen(true);
  };

  const handleUserFormSubmit = async (data: UserFormData) => {
    setIsSaving(true);
    console.log("Dados do usuário para salvar/criar via Drawer:", data);
    
    // TODO: Lógica para criar ou atualizar usuário no Supabase
    // Se data.id existir, é uma atualização.
    //   await supabase.from('users').update({ name: data.name, ... }).eq('id', data.id);
    // Senão, é uma criação (convite).
    //   await supabase.auth.admin.inviteUserByEmail(data.email, { data: { full_name: data.name, initial_role: data.role, ... }});
    //   Lembre-se do trigger para popular sua tabela public.users após o convite/signup.

    await new Promise(resolve => setTimeout(resolve, 1500)); // Simula chamada de API

    if (data.id) { // Edição
      setUsers(prevUsers => prevUsers.map(u => 
        u.id === data.id ? { ...u, name: data.name, email: data.email, role: data.role, status: data.status as DisplayUser['status'] } : u
      ));
      // Adicionar feedback de sucesso: alert('Usuário atualizado com sucesso!');
    } else { // Criação (simulada)
      const newUser: DisplayUser = {
        id: `new_${(Math.random() * 10000).toFixed(0)}`, // ID placeholder
        name: data.name,
        email: data.email,
        role: data.role,
        status: data.status as DisplayUser['status'],
        lastLogin: null,
      };
      setUsers(prevUsers => [newUser, ...prevUsers]);
      // Adicionar feedback de sucesso: alert('Convite enviado para o novo usuário!');
    }
    
    setIsSaving(false);
    setIsUserDrawerOpen(false); // Fecha o Drawer após submissão
  };
  
  const handleDeleteUser = async (userId: string) => {
    // Adicionar uma confirmação mais robusta, talvez usando um modal/dialog do Headless UI
    if (window.confirm("Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.")) {
      console.log("Excluindo usuário (simulação):", userId);
      // TODO: Lógica para deletar usuário no Supabase Auth e na tabela public.users
      // await supabase.auth.admin.deleteUser(userId); // Requer privilégios de admin
      // await supabase.from('users').delete().eq('id', userId);
      setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
      // Adicionar feedback de sucesso/erro
    }
  };

  return (
    <> {/* Necessário React.Fragment ou div pai se houver múltiplos elementos de topo */}
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl space-y-6">
        {/* Cabeçalho da Página e Botão de Adicionar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 flex items-center">
              <UserCog size={28} className="mr-3 text-emerald-600" />
              Gerenciar Usuários
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Adicione, edite e gerencie os acessos dos usuários da sua corretora.
            </p>
          </div>
          <button
            onClick={openNewUserDrawer} // Abre o Drawer para novo usuário
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out flex items-center text-sm shrink-0"
          >
            <PlusCircle size={18} className="mr-2" />
            Adicionar Novo Usuário
          </button>
        </div>

        {/* Barra de Pesquisa */}
        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="search_users"
              id="search_users"
              className="block w-full md:w-1/2 lg:w-1/3 pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              placeholder="Buscar por nome, email, papel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tabela de Usuários */}
        {isLoading ? (
          <div className="text-center py-10"><p className="text-gray-500 animate-pulse">Carregando usuários...</p></div>
        ) : (
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>
                    <div className="flex items-center">Nome{sortColumn === 'name' && (sortDirection === 'asc' ? <ChevronUp size={14} className="ml-1"/> : <ChevronDown size={14} className="ml-1"/>)}</div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('email')}>
                    <div className="flex items-center">Email{sortColumn === 'email' && (sortDirection === 'asc' ? <ChevronUp size={14} className="ml-1"/> : <ChevronDown size={14} className="ml-1"/>)}</div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('role')}>
                    <div className="flex items-center">Papel{sortColumn === 'role' && (sortDirection === 'asc' ? <ChevronUp size={14} className="ml-1"/> : <ChevronDown size={14} className="ml-1"/>)}</div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('status')}>
                    <div className="flex items-center">Status{sortColumn === 'status' && (sortDirection === 'asc' ? <ChevronUp size={14} className="ml-1"/> : <ChevronDown size={14} className="ml-1"/>)}</div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Último Login</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{user.name || '-'}</div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-700">{user.email || '-'}</div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'Gestor Comercial' ? 'bg-blue-100 text-blue-800' : user.role === 'Corretor' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{user.role}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'Ativo' ? 'bg-green-100 text-green-800' : user.status === 'Inativo' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{user.status}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastLogin || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <button onClick={() => openEditUserDrawer(user)} className="text-emerald-600 hover:text-emerald-800 transition-colors" title="Editar Usuário"><Edit size={18} /></button>
                      <button onClick={() => handleDeleteUser(user.id)} className="text-red-500 hover:text-red-700 transition-colors" title="Excluir Usuário"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">Nenhum usuário encontrado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {/* TODO: Adicionar paginação se a lista de usuários for grande */}
      </div>

      {/* Usando o componente Drawer para o formulário de usuário */}
      <Drawer
        isOpen={isUserDrawerOpen}
        onClose={() => setIsUserDrawerOpen(false)}
        title={editingUser?.id ? 'Editar Usuário' : 'Adicionar Novo Usuário'}
        position="right" // Posição do drawer (pode ser 'left')
        size="md"        // Tamanho do drawer ('sm', 'md', 'lg', 'xl', 'full')
      >
        <UserForm
          initialData={editingUser}
          onSubmit={handleUserFormSubmit}
          onCancel={() => setIsUserDrawerOpen(false)}
          isSaving={isSaving}
        />
      </Drawer>
    </>
  );
}
