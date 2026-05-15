import "@/styles/globals.css";

import Footer from "@/components/Footer/Footer";
import Providers from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body>
        <div className="flex min-h-screen flex-col">
          <Providers>
            {children}
          </Providers>
          <div id="cart-notification" />
          <Footer />
        </div>
      </body>
    </html>
  );
}
