import "./fonts.css";
import "./globals.css";
import LaunchDarklyProvider from "./providers/LaunchDarklyProvider";

export const metadata = {
  title: "Packages, Plans & Price | SiriusXM",
  description:
    "Music, Sports, News, Talk. Choose the variety you're looking for—and where you want to listen.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LaunchDarklyProvider>{children}</LaunchDarklyProvider>
      </body>
    </html>
  );
}
