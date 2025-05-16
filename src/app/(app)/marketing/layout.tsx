// Exemplo de caminho: src/app/(app)/marketing/layout.tsx
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* Elementos de layout comuns para Marketing podem vir aqui */}
      {children}
    </div>
  );
}
