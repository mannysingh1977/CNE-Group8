import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import Link from "next/link";

interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const setError = async (message: string) => {
    setErrorMessage(message);

    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  useEffect(() => {
    const emailInput = document.querySelector<HTMLInputElement>(
      "input[name='email']"
    );
    const passwordInput = document.querySelector<HTMLInputElement>(
      "input[name='password']"
    );

    if (emailInput && emailInput.value) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        email: emailInput.value,
      }));
    }

    if (passwordInput && passwordInput.value) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        password: passwordInput.value,
      }));
    }
  }, []);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userInput = {
      emailAddress: formData.email,
      password: formData.password,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInput),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        if (data.message === "Authentication Successful") {
          window.location.href = "../";
        } else {
          alert("Invalid email or password");
        }
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
      console.error("Error:", error);
    }
  };
  return (
    <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="bg-white w-full max-w-md space-y-8 p-6 rounded-lg shadow-lg sm:p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t("login.login")}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t("login.loginSubtitle")}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md  -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                {t("login.email")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                onChange={handleChange}
                required
                className="mb-3 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                {t("login.password")}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                onChange={handleChange}
                required
                className="appearance-none  relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg  focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {t("login.login")}
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
          <p className="text-gray-600">
            {t("login.NoAccount")}{" "}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {t("login.signup")}
            </Link>
          </p>
        </div>
        {errorMessage && (
          <div className="m-1 p-1 bg-red-300 text-red-700">{errorMessage}</div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
