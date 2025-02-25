import { postProduct } from "@/services/productService";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { addProductType } from "@/types/cartTypes";
import Modal from "react-modal";
import router from "next/router";

const addProduct: React.FC = () => {
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }
  const [formData, setFormData] = useState<addProductType>({
    name: "",
    description: "",
    media: "",
    stock: 0,
    price: 0,
    details: "",
    userId: 0,
  });

  const customStyleModal = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (
        file.type !== "image/jpeg" &&
        file.type !== "image/png" &&
        file.type !== "image/SVG"
      ) {
        setError("Invalid file type. Please upload a JPEG or PNG file.");
        return;
      }
      console.log("File name:", file.name);
      console.log("File type:", file.type);
      console.log("File size:", file.size);

      const newName = "/productPictures/" + file.name.replace(/\s/g, "_");

      const formData = new FormData();
      formData.append("media", file);

      const token = localStorage.getItem("token");

      setFormData((prevFormData) => ({
        ...prevFormData,
        media: newName,
      }));

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}upload`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (response.ok) {
          console.log("File uploaded successfully");
        } else {
          console.error("Failed to upload file");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const setError = async (message: string) => {
    setErrorMessage(message);

    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await postProduct(formData);
      console.log("Response:", response);
      if (response && response.ok) {
        console.log("File uploaded successfully");
        openModal();
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        console.error("Failed to upload file:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    console.log(name, value, type);
    console.log(value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="bg-white w-full max-w-md space-y-8 p-6 rounded-lg shadow-lg sm:p-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {t("product.add")}
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="sr-only">
                  {t("product.name")}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  onChange={handleChange}
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder={t("product.name")}
                />
              </div>
              <div>
                <label htmlFor="description" className="sr-only">
                  {t("product.description")}
                </label>
                <input
                  id="description"
                  name="description"
                  type="text"
                  onChange={handleChange}
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder={t("product.description")}
                />
              </div>
              <div>
                <label htmlFor="media" className="sr-only">
                  {t("product.media")}
                </label>
                <input
                  id="media"
                  name="media"
                  type="file"
                  onChange={handleFileChange}
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder={t("product.media")}
                />
              </div>
              <div>
                <label htmlFor="stock" className="sr-only">
                  {t("product.stock")}
                </label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  onChange={handleChange}
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder={t("product.stock")}
                />
              </div>
              <div>
                <label htmlFor="price" className="sr-only">
                  {t("product.price")}
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  onChange={handleChange}
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder={t("product.price")}
                />
              </div>
              <div>
                <label htmlFor="details" className="sr-only">
                  {t("product.details")}
                </label>
                <input
                  id="details"
                  name="details"
                  type="text"
                  onChange={handleChange}
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder={t("product.details")}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {t("product.add")}
              </button>
            </div>
          </form>
          {errorMessage && (
            <div className="m-1 p-1 bg-red-300 text-red-700">
              {errorMessage}
            </div>
          )}
          <footer className="text-gray-500 w-full text-center mt-4">
            {t("product.disclaimer")}
          </footer>
        </div>
        <Modal isOpen={modalIsOpen} contentLabel="" style={customStyleModal}>
          <p>{t("product.success")}</p>
          <p>{t("product.redirect")}</p>
        </Modal>
      </div>
    </>
  );
};

export default addProduct;
