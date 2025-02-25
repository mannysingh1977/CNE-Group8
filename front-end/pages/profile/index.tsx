import Navbar from "@/components/header/navbar";
import ProfileOverview from "@/components/profile/profileOverview";
import { jwtDecode } from "jwt-decode";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getUser } from "@/services/UserService";
import { User } from "@/types/types";

const Profile: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User>();

  interface DecodedToken {
    userId: string;
  }
  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      return;
    }
    const decodedToken = jwtDecode<DecodedToken>(token);
    const fetchUser = async () => {
      const user = await getUser(Number(decodedToken.userId));
      setUser(user);
    };
    fetchUser();
  }, []);
  return (
    <>
      <main className="overscroll-y-contain">
        <Navbar type="profile" user={user}/>
        <ProfileOverview />
      </main>
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
export default Profile;
