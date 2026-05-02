import "@/styles/body.scss";
import "@/styles/components.scss";

import { AppProvider } from "../context/AppContext";
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
        <div className="app-layout">
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
