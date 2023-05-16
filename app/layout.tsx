import Link from "next/link"
import { ReactNode } from "react";
import Provider from "./Provider";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";


export const metadata = {
  title: "Create Next App",
  description: "Generateod by create next app",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode,
}) {
  return (
    <html lang="ja">
      <head />
      <body>
        <Provider>
          <Header />
          <Main>{children}</Main>
          <Footer />
        </Provider>
      </body>
    </html>
  )
}