import React, { useEffect, useState } from 'react';
import { User, AtSign, Phone, House, CircleDollarSign } from 'lucide-react';
import UserService from '@/services/UserService';
import { jwtDecode } from 'jwt-decode';
import { Address, Role } from '@/types/types';
import { useTranslation } from 'next-i18next';

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

const Overview: React.FC = () => {
    const [userId, setUserId] = useState<number>()
    const [user, setUser] = useState<any>(null);
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [country, setCountry] = useState<string>('');
    const [houseNumber, setHouseNumber] = useState<string>('');
    const [postalCode, setPostalCode] = useState<string>('');
    const [street, setStreet] = useState<string>('');
    const [state, setState] = useState<string>('');
    const [counter, setCounter] = useState<number>(0);
    const [isSeller, setIsSeller] = useState<string>("");
    const {t} = useTranslation();

    const fetchUser = async (userId: number) => {
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
        if (user) {
            setName(user.name || '');
            setEmail(user.emailAddress || '');
            setPhoneNumber(user.phoneNumber || '');
            if (user.seller) {
                setIsSeller(`${t('isseller')}`)
            } else {
                setIsSeller(`${t('noseller')}`)
            }

            if (user.address) {
                setCity(user.address.city || '');
                setCountry(user.address.country || '');
                setHouseNumber(user.address.houseNumber || '');
                setPostalCode(user.address.postalCode || '');
                setStreet(user.address.street || '');
                setState(user.address.state || '');
            }
        }
    }, [user]);


    const handleFailedFetch = () => {
        if (counter < 5) {
            setCounter(counter + 1);
            if (userId) {
                fetchUser(userId);
            }
        }
    };

    if (!user) {
        if (counter >= 5) {
            return <div>We are working hard to fix the issue. Please come back later.</div>;
        }
        return <div onClick={handleFailedFetch} className='hover:cursor-pointer hover:underline inline-block'>Failed to fetch data... Click to try again</div>;
    }

    return (
        <>
            <div className="border-2 border-black rounded-lg min-h-min flex flex-col gap-4">
                <div className="flex items-center">
                    <User className="mr-2" />
                    {name}
                </div>
                <div className='flex items-center'>
                    <AtSign className='mr-2' />
                    {email}
                </div>
                <div className='flex items-center'>
                    <Phone className='mr-2' />
                    {phoneNumber}
                </div>
                <div className='flex items-center'>
                    <CircleDollarSign className='mr-2'/>
                    {isSeller}
                </div>
                <div className='flex items-center'>
                    <House className='mr-2'/>
                    {street} {houseNumber}, {postalCode} {city} {country}
                </div>
            </div>
        </>
    );
};

export default Overview;


