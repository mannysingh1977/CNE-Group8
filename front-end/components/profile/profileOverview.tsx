import { User, Settings, FileText, ShoppingBag, Shield } from 'lucide-react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Overview from './options/overview';
import Setting from './options/settings';
import Bills from './options/bills';
import Orders from './options/orders';
import { i18n, useTranslation } from 'next-i18next';
import UserService from '@/services/UserService';
import { jwtDecode } from 'jwt-decode';
import { Address, Role } from '@/types/types';
import Admin from './options/admin';
import Owner from './options/owner';
import useLanguage from '../language/useLanguage';
import ProductCatalog from './options/productcatalog';

interface ProfileProps {
  userId?: number;
  name: string;
  phoneNumber: string;
  emailAddress: string;
  password: string;
  address: Address;
  seller: boolean;
  newsLetter: boolean;
  role: Role;
}

const Selector: React.FC = () => {
    const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
    const [selectedOption, setSelectedOptions] = useState<string>('overview');
    const { t } = useTranslation();
    const [userId, setUserId] = useState<number>();
    const [user, setUser] = useState<any>();
    const [admin, setAdmin] = useState<boolean>(false);
    const [owner, setOwner] = useState<boolean>(false);
    const { changeLanguage } = useLanguage();
    const [currentLanguage, setCurrentLanguage] = useState(i18n?.language || 'en');

  const router = useRouter();

  const navItems = [
    {
      name: `${t("overview")}`,
      icon: User,
      id: "overview",
      component: <Overview />,
    },
    {
      name: `${t("settings")}`,
      icon: Settings,
      id: "settings",
      component: <Setting />,
    },
    {
      name: `${t("orders")}`,
      icon: ShoppingBag,
      id: "orders",
      component: <Orders />,
    },
  ];

  const adminItem = {
    name: `${t("adminoptions")}`,
    icon: Shield,
    id: "admin",
    component: <Admin />,
  };
  const ownerItem = {
    name: `${t("owneroptions")}`,
    icon: Shield,
    id: "owner",
    component: <Owner />,
  };
  const productCatalogItem = {
    name: `${t("productcatalog")}`,
    icon: FileText,
    id: "catalog",
    component: <ProductCatalog />,
  };

  const fetchUser = async (userId: number) => {
    try {
      const user = await UserService.getUser(userId);
      setUser(user);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  useEffect(() => {
    const fetchToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode<ProfileProps>(token);
        if (decoded && decoded.userId) {
          setUserId(decoded.userId);
          fetchUser(decoded.userId);
        }
      }
    };
    fetchToken();
  }, []);
  const [allNavItems, setAllNavItems] = useState([...navItems]);

  useEffect(() => {
    if (user) {
      let allNavItems = [...navItems];
      if (user.role === "Admin") {
        allNavItems = [...allNavItems, adminItem];
      }
      if (user.role === "Owner") {
        allNavItems = [...allNavItems, ownerItem];
      }
      if (user.seller) {
        allNavItems = [...allNavItems, productCatalogItem];
      }

      setAllNavItems(allNavItems);
    }
  }, [user]);
    useEffect(() => {
      const handleLanguageChange = () => {
        if (i18n) {
            setCurrentLanguage(i18n.language);
        }
      };

      if (i18n) {
        i18n.on('languageChanged', handleLanguageChange);
      }

      return () => {
        i18n?.off('languageChanged', handleLanguageChange);
      };
    }, [i18n]);

    useEffect(() => {
        if (user) {
            let updatedNavItems = [...navItems];
            if (user.role === "Admin") {
                updatedNavItems = [...updatedNavItems, adminItem];
            }
            if (user.role === "Owner") {
                updatedNavItems = [...updatedNavItems, ownerItem];
            }
            setAllNavItems(updatedNavItems);
        }
    }, [user, currentLanguage]);

  const renderAllOptions = () => {
    const selectedItem = allNavItems.find((item) => item.id === selectedOption);
    return selectedItem ? (
      selectedItem.component
    ) : (
      <div>{t("invalid_option")}</div>
    );
  };

  return (
    <>
      <div className="w-full bg-card text-card-foreground p-4 space-y-2 border-r relative">
        <div className="space-y-2">
          {allNavItems.map((item) => (
            <button
              key={item.id}
              className="w-full flex items-center justify-start hover:bg-blue-300 pt-2 pb-2 pl-2 rounded-md"
              onClick={() => setSelectedOptions(item.id)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.name}</span>
            </button>
          ))}
        </div>
        <div className="pt-4 border-t"></div>
        <div>{renderAllOptions()}</div>
      </div>
    </>
  );
};

export default Selector;