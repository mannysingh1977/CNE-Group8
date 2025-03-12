import React from "react";
import { useState } from "react";
import { useTranslation } from "next-i18next";
import CountryOptions from "./CountryOptions";
import Link from "next/link";
import AnimatedCheckbox from "./AnimatedCheckbox";
import Language from "../language/Language";

interface FormData {
  name: string;
  phoneNumber: string;
  emailAddress: string;
  password: string;
  confirmPassword: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  state: string;
  country: string;
  seller: boolean;
  newsLetter: boolean;
  role: string;
}

interface loginUserInput {
  email: string;
  password: string;
}

const RegisterForm: React.FC = () => {
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const { t } = useTranslation();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    phoneNumber: "",
    emailAddress: "",
    password: "",
    confirmPassword: "",
    street: "",
    houseNumber: "",
    postalCode: "",
    city: "",
    state: "",
    country: "",
    seller: false,
    newsLetter: false,
    role: "User",
  });

  const setError = async (message: string) => {
    setErrorMessage(message);

    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    let valueBool: boolean = value === "true";

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const loginAfterRegister = async (email: string, password: string) => {
    const userInput = {
      emailAddress: email,
      password: password,
    };
    console.log(userInput);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userInput),
        }
      );
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        console.log(data);
        if (data.message === "Authentication Successful") {
          setTimeout(() => {
            window.location.href = "../";
          }, 2000);
        } else {
          alert("Invalid email or password");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log(formData);
    e.preventDefault();
    const address = {
      street: formData.street,
      houseNumber: formData.houseNumber,
      postalCode: formData.postalCode,
      state: formData.state,
      city: formData.city,
      country: formData.country,
    };
    const userInput = {
      name: formData.name,
      phoneNumber: formData.phoneNumber,
      emailAddress: formData.emailAddress,
      password: formData.password,
      address,
      seller: formData.seller,
      newsLetter: formData.newsLetter,
      role: "User",
    };
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInput),
      });
      if (response.ok) {
        console.log("User registered successfully");
        setStatusMessage("Successfully registered");
        setStatusMessage("Logging in...");
        console.log(userInput.emailAddress, userInput.password);
        loginAfterRegister(userInput.emailAddress, userInput.password);
      } else {
        console.error("Failed to register user");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="fixed top-0 right-0">
        <Language />
      </div>
      <div className="bg-white w-full max-w-md space-y-8 p-6 rounded-lg shadow-lg sm:p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t("register.cardTitle")}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t("register.registerSubtitle")}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md  -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">
                {t("register.fullname")}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg mb-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder={t("register.fullname")}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="sr-only">
                {t("register.phonenumber")}
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="text"
                autoComplete="phoneNumber"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg mb-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder={t("register.phonenumber")}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="emailAddress" className="sr-only">
                {t("register.email")}
              </label>
              <input
                id="emailAddress"
                name="emailAddress"
                type="emailAddress"
                autoComplete="emailAddress"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg mb-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder={t("register.email")}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                {t("register.password")}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg mb-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder={t("register.password")}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                {t("register.confirmPassword")}
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg mb-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder={t("register.confirmPassword")}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="street" className="sr-only">
                {t("register.streetname")}
              </label>
              <input
                id="street"
                name="street"
                type="text"
                autoComplete="street"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg mb-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder={t("register.streetname")}
                onChange={handleChange}
              />
            </div>
            <div className="flex justify-between	">
              <label htmlFor="houseNumber" className="sr-only">
                {t("register.housenumber")}
              </label>
              <input
                id="houseNumber"
                name="houseNumber"
                type="text"
                autoComplete="houseNumber"
                required
                className="appearance-none w-4/12 relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg mb-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder={t("register.housenumber")}
                onChange={handleChange}
              />
              <label htmlFor="postalCode" className="sr-only">
                {t("register.postalcode")}
              </label>
              <input
                id="postalCode"
                name="postalCode"
                type="number"
                autoComplete="house-number"
                required
                className="appearance-none w-7/12 relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg mb-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder={t("register.postalcode")}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="city" className="sr-only">
                {t("register.city")}
              </label>
              <input
                id="city"
                name="city"
                type="text"
                autoComplete="city"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg mb-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder={t("register.city")}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="state" className="sr-only">
                {t("register.state")}
              </label>
              <input
                id="state"
                name="state"
                type="text"
                autoComplete="state"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg mb-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder={t("register.state")}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="country" className="sr-only">
                {t("register.country")}
              </label>
              <select
                id="country"
                name="country"
                autoComplete="country"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg mb-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                onChange={handleChange}
              >
                <option value="">{t("register.selectcountry")}</option>
                <CountryOptions />
              </select>
            </div>
            <div className="items-start flex-col">
              <AnimatedCheckbox
                label={t("register.newslettercheckbox")}
                onchange={handleChange}
                name="newsLetter"
                checked={false}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {t("register.register")}
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
          <p className="text-gray-600">
            {t("register.alreadyAccount")}{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {t("register.login")}{" "}
            </Link>
          </p>
        </div>
        {statusMessage && (
          <div className="m-1 p-1 bg-green-300 text-green-700">
            {statusMessage}
          </div>
        )}
        {errorMessage && (
          <div className="m-1 p-1 bg-red-300 text-red-700">{errorMessage}</div>
        )}
        <p className="text-gray-600">If you want to become a seller on our platform please contact customer support!</p>
      </div>
    </div>
  );
};
export default RegisterForm;
