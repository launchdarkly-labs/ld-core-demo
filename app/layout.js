import "./globals.css";
import { Outfit } from "next/font/google";
import { SessionProvider, LDClientWrapper } from "./SessionContext";

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
        <SessionProvider>
          <LDClientWrapper
            observabilityServiceName={process.env.LD_OBSERVABILITY_SERVICE_NAME}
            sessionReplayPrivacy={process.env.LD_SESSION_REPLAY_PRIVACY}
          >
            {children}
          </LDClientWrapper>
        </SessionProvider>
      </body>
    </html>
  );
}
