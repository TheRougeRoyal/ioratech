import "./globals.css";
import { Providers } from "@/lib/providers";
import { AuthProvider } from "@/lib/auth-context";

export const metadata = {
  title: "Iora - Climate Intelligence",
  description: "Enterprise-grade carbon analytics and climate risk forecasting",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          <AuthProvider>
            {children}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}