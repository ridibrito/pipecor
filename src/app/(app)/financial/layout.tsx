// Exemplo de caminho: src/app/(app)/financial/layout.tsx
export default function FinancialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* Elementos de layout comuns para Financial podem vir aqui */}
      {children}
    </div>
  );
}
