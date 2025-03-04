import Navbar from "@/components/header/navbar";
import LoginTable from "@/components/loginTable/loginTable";
import Main from "@/components/main/main";
import { User } from "@/types/types";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useEffect, useState } from "react";
import { getUser } from "@/services/UserService";

interface DecodedToken {
  userId: string;
  exp: number;
}

const Home: React.FC = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState<User>();
  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      return;
    }
    const decodedToken = jwtDecode<DecodedToken>(token);
    console.log(decodedToken)
    if (decodedToken.exp * 1000 < Date.now()) {
      localStorage.removeItem('token')
      return;
    }
    const fetchUser = async () => {
      const user = await getUser(String(decodedToken.userId));
      setUser(user);
    };
    fetchUser();
  }, []);


  return (
    <>
      <Head>
        <title>{t("index.title")}</title>
        <meta
          name="description"
          content="User Bazaar - Your one-stop shop for amazing products"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo-512-white.svg" />
      </Head>
      <div className="min-h-screen flex flex-col overscroll-y-contain">
        <header className="sticky top-0 z-10 bg-white shadow-sm">
          <Navbar user={user} />
        </header>
        <main className="flex-grow ">
          <Main />
        </main>
      </div>
    </>
  );
};
export const getServerSideProps = async (context: { locale: any }) => {
  const { locale } = context;
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [`common`])),
    },
  };
};
export default Home;
