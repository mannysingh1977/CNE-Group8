import { useTranslation } from "next-i18next";
import Language from "../../language/Language";
import UserService from "@/services/UserService";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Address, Role } from "@/types/types";
import AnimatedCheckbox from "../../register/AnimatedCheckbox";

interface ProfileProps {
    userId?: string;
    name: string;
    phoneNumber: string;
    emailAddress: string;
    password: string;
    address: Address;
    seller: boolean;
    newsLetter: boolean;
    role: Role;
}


const Settings: React.FC = () => {
    const { t } = useTranslation();
    const [userId, setUserId] = useState<string>()
    const [user, setUser] = useState<any>(null);
    const [seller, setSeller] = useState<boolean>(false);

    const fetchUser = async (userId: string) => {
        try {
            const user = await UserService.getUser(userId);
            setUser(user);
        } catch (error) {
            console.error('Failed to fetch user data:', error);
        }
    };

    useEffect(() => {
        const fetchToken = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                const decoded = jwtDecode<ProfileProps>(token);
                if (decoded && decoded.userId) {
                    setUserId(decoded.userId);
                    fetchUser(decoded.userId);
                }
            }
        }
        fetchToken()
    }, [])

    useEffect(() => {
        if (user !== null) {
            setSeller(user.seller);
        }
    }, [user]);

    const updateSeller = () => { } // here to satisfy the requirment to have an onchange function in the animatedCheckbox, does nothing

    return (
        <>
            <div className="flex flex-col min-h-full">
                <div className="flex flex-row items-center">{t('language')}: <Language /></div>
                <div className="flex flex-row items-center gap-2 pt-2 pointer-events-none">
                    {t("register.seller")} <span className="bg-transparent">*</span>
                    <AnimatedCheckbox
                        label={""}
                        name="seller"
                        onchange={() => updateSeller()}
                        checked={seller}
                    />
                </div>
                <div className="flex-grow"></div>
                <footer className="text-gray-600">
                    <p className="text-sm">* It is not possible to either attain or relinquish seller status. Please contact customer support to change your status.</p>
                </footer>
            </div>
        </>
    );



};

export default Settings;