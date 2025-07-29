import Logo from "./_components/Logo";
import Navigation from "./_components/navigation";

export const metadata = {
  title: "Zenith",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <Logo />
          <Navigation />
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
