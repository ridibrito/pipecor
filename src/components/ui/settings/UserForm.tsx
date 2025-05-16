// src/components/settings/UserForm.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { User, Mail, Phone, Briefcase, ShieldCheck, Save, XCircle } from 'lucide-react';

export interface UserFormData {
  id?: string;
  name: string;
  email: string;
  phoneNumber?: string | null;
  role: string;
  status: string;
}

interface UserFormProps {
  initialData?: Partial<UserFormData> | null;
  onSubmit: (data: UserFormData) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

const userRoles = ['BROKER', 'SALES_MANAGER', 'ADMIN_MANAGER', 'ADMIN_ASSISTANT', 'OWNER_CORRETORA'];
const userStatuses = ['ACTIVE', 'INACTIVE', 'PENDING_CONFIRMATION'];

export default function UserForm({ initialData, onSubmit, onCancel, isSaving }: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    phoneNumber: '',
    role: userRoles[0],
    status: userStatuses[0],
    ...initialData,
  });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    setFormData({
      name: '',
      email: '',
      phoneNumber: '',
      role: initialData?.role || userRoles[0], // Garante que o valor inicial seja usado se presente
      status: initialData?.status || userStatuses[0], // Garante que o valor inicial seja usado se presente
      ...initialData,
    });
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!formData.name || !formData.email || !formData.role || !formData.status) {
      setFormError("Nome, email, papel e status são obrigatórios.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        setFormError("Por favor, insira um email válido.");
        return;
    }
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formError && (
        <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm">
          {formError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
          <div className="mt-1 relative rounded-lg shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-2.5 px-3 placeholder-gray-500 text-gray-900" // Adicionado text-gray-900 para o texto digitado
              placeholder="Nome do usuário"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <div className="mt-1 relative rounded-lg shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={!!initialData?.id}
              className={`focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-2.5 px-3 placeholder-gray-500 text-gray-900 ${initialData?.id ? 'bg-gray-100 cursor-not-allowed' : ''}`} // Adicionado text-gray-900
              placeholder="usuario@exemplo.com"
            />
            {initialData?.id && <p className="mt-1 text-xs text-gray-500">O email não pode ser alterado.</p>}
            {!initialData?.id && <p className="mt-1 text-xs text-gray-500">Um convite será enviado para este email.</p>}
          </div>
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Telefone (Opcional)</label>
          <div className="mt-1 relative rounded-lg shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              name="phoneNumber"
              id="phoneNumber"
              value={formData.phoneNumber || ''}
              onChange={handleChange}
              className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-2.5 px-3 placeholder-gray-500 text-gray-900" // Adicionado text-gray-900
              placeholder="(XX) XXXXX-XXXX"
            />
          </div>
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Papel no Sistema</label>
          <div className="mt-1 relative rounded-lg shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Briefcase className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-2.5 px-3 appearance-none text-gray-600" // COR DO TEXTO DO SELECT ALTERADA AQUI
            >
              {userRoles.map(role => (
                <option key={role} value={role} className="text-gray-900">{role.replace('_', ' ').toUpperCase()}</option> // Opções podem ter cor mais escura se o navegador permitir
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
           <div className="mt-1 relative rounded-lg shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ShieldCheck className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-2.5 px-3 appearance-none text-gray-600" // COR DO TEXTO DO SELECT ALTERADA AQUI
            >
              {userStatuses.map(status => (
                <option key={status} value={status} className="text-gray-900">{status.replace('_', ' ').toUpperCase()}</option> // Opções podem ter cor mais escura se o navegador permitir
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="pt-5 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="bg-white py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
        >
          <XCircle size={18} className="inline mr-2" />
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out flex items-center disabled:opacity-70"
        >
          {isSaving ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <Save size={18} className="mr-2" />
          )}
          {isSaving ? 'Salvando...' : (initialData?.id ? 'Salvar Alterações' : 'Convidar Usuário')}
        </button>
      </div>
    </form>
  );
}
