// src/app/(app)/user/[[...user-profile]]/page.tsx
import { UserProfile } from "@clerk/nextjs";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Meu Perfil - Pipecor",
};

const UserProfilePage = () => (
  <div className="flex justify-center py-8 px-4"> {/* Adicionado padding e centralização */}
    <UserProfile 
      path="/user" // O caminho base para esta página de perfil
      routing="path" // Usa o roteamento do Next.js
      appearance={{ // Opcional: para customizar a aparência
        elements: {
          card: "shadow-xl",
          navbar: "hidden", // Exemplo: esconder a navbar interna do UserProfile se não quiser
          headerTitle: "text-2xl font-semibold text-gray-800",
          // Você pode customizar muitos outros elementos aqui
        }
      }}
    />
  </div>
);

export default UserProfilePage;