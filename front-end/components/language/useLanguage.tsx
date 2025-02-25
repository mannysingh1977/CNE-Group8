import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const useLanguage = () => {
  const { i18n } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && savedLanguage !== i18n.language) {
      changeLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (language: string) => {
    if (language !== i18n.language) {
      i18n.changeLanguage(language);
      localStorage.setItem('language', language);
      router.push(router.asPath, router.asPath, { locale: language });
    }
  };

  return { changeLanguage };
};

export default useLanguage;

