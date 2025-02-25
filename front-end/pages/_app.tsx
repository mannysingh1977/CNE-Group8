import { appWithTranslation } from "next-i18next";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { useRouter } from "next/router";
import "@/styles/globals.css";

const App = ({ Component, pageProps }: AppProps) => {
    const router = useRouter();

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage && savedLanguage !== router.locale) {
            router.push(router.pathname, router.asPath, { locale: savedLanguage });
        }
    }, []);

    return <Component {...pageProps} />;
}

export default appWithTranslation(App);

