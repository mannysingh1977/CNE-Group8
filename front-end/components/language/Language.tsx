import React from 'react';
import { useRouter } from 'next/router';
import useLanguage from './useLanguage';

const Language: React.FC = () => {
  const { changeLanguage } = useLanguage();
  const router = useRouter();
  const { locale } = router;

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = event.target.value;
    changeLanguage(newLocale);
  };

  return (
    <div>
      <select
        id="language"
        className="ml-2 p-1 rounded-lg bg-transparent text-black border-black border-2"
        value={locale}
        onChange={handleChange}
      >
        <option value="en">English</option>
        <option value="nl">Nederlands</option>
        <option value="fr">Français</option>
      </select>
    </div>
  );
};

export default Language;

