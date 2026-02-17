import "./globals.css";
import { Outfit } from "next/font/google";
import { LDClientProvider } from "./LDClientProvider";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-hero",
});

export const metadata = {
  title: "ToggleHealth – Coverage Concierge",
  description: "Powered by Amazon Bedrock · Triage only",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body>
        <LDClientProvider
          clientSideID={process.env.LD_CLIENT_ID}
          observabilityServiceName={process.env.LD_OBSERVABILITY_SERVICE_NAME}
        >
          {children}
        </LDClientProvider>
      </body>
    </html>
  );
}
