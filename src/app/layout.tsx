import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "../components/Providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ChatPDF AI",
  description: "Chat With Your PDF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <Providers>
        <html lang="en">
     
          <body className={inter.className}>
          <Toaster />
            {children}
            </body>
       
        </html>
      </Providers>
    </ClerkProvider>
  );
}
