import { Barlow } from "next/font/google";
import "./globals.css";

const barlow = Barlow({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-barlow",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
   title : "Admin Dashboard",
   description : "Admin Dashboard"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${barlow.variable} ${barlow.className} antialiased`}>
      
        {children}
      </body>
    </html>
  );
}
