import type { Metadata } from "next";
import "./globals.css";
import { DadosProvider } from "@/hooks/useDados";

export const metadata: Metadata = {
  title: "Moncash",
  description: "Seu controle financeiro inteligente",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        {/* Aqui nós "abraçamos" o app inteiro com o nosso Cérebro de Dados! */}
        <DadosProvider>
          {children}
        </DadosProvider>
      </body>
    </html>
  );
}