// Exemplo de caminho: src/app/(app)/crm/layout.tsx
export default function CrmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* Elementos de layout comuns para Crm podem vir aqui */}
      {children}
    </div>
  );
}
