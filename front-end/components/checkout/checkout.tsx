import { checkoutService } from "@/services/cartService";
import { ShoppingCart } from "@/types/cartTypes";
import { CreditCard, ShoppingBag } from "lucide-react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import React from "react";
import { useEffect, useState } from "react";
import Modal from "react-modal";

interface CheckoutProps {
  userId: string;
  cart: ShoppingCart | undefined;
}

const CheckoutComponent: React.FC<CheckoutProps> = ({ userId, cart }) => {
  const [total, setTotal] = useState<number>(0);
  const [btw, setBtw] = useState<number>(0);
  const [shipping, setShipping] = useState<number>(0);
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [modalIsOpen, setIsOpen] = useState(false);
  function openModal() {
    setIsOpen(true);
  }
  const { t } = useTranslation();

  const checkout = (userId: string, cart: ShoppingCart) => async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const checkout = checkoutService(userId, cart, token);
        if ((await checkout).ok) {
          console.log("Checkout successful");
          openModal();
          setTimeout(() => {
            window.location.href = "/";
          }, 3000);
        }
      } else {
        throw new Error("Token is null");
      }
    } catch (error) {
      console.error("Error checking out:", error);
    }
  };

  useEffect(() => {
    if (cart) {
      const calculatedBtw = cart.total * 0.21;
      const calculatedTotal = cart.total - calculatedBtw;
      const calculatedShipping = Number(calculatedTotal) < 100 ? 25 : 0;

      setBtw(calculatedBtw);
      setTotal(calculatedTotal);
      setShipping(calculatedShipping);
    }
  }, [cart]);

  if (!cart) {
    return (
      <div className="container mx-auto px-4 py-8">{t("checkout.loading")}</div>
    );
  }
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
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-4 sm:px-6 py-4 bg-gray-100 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {t("checkout.title")}
          </h2>
        </div>{" "}
        {cart.items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row items-start items-center space-y-2 sm:space-y-0 sm:space-x-4 py-4 border-b last:border-b-0 mx-5"
          >
            <Image
              src={item.product.media}
              alt={item.product.name}
              width={50}
              height={50}
              className="rounded-md"
            />
            <div className="flex-grow">
              <h3 className="font-semibold">{item.product.name}</h3>
              <p className="text-sm text-gray-500">
                ${item.product.price.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
        <div className="space-y-4 mx-5">
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">{t("checkout.subtotal")}</span>
            <span className="font-medium">€{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">{t("checkout.shipping")}</span>
            <span className="font-medium">€{shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">{t("checkout.vat")}</span>
            <span className="font-medium">€{btw.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-200 my-4"></div>
          <div className="flex justify-between items-center py-2">
            <span className="text-lg font-semibold">{t("checkout.total")}</span>
            <span className="text-lg font-semibold">
              €{Number(cart.total) + shipping}
            </span>
          </div>
        </div>
        <div className="mt-8 mx-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t("checkout.payment")}
          </h2>
          <div className="space-y-4">
            <label
              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                selectedMethod === "card"
                  ? "bg-indigo-50 border border-indigo-200"
                  : "bg-white border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={selectedMethod === "card"}
                onChange={() => setSelectedMethod("card")}
                className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
              />
              <div className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-indigo-500" />
                <span className="text-sm font-medium text-gray-900">
                  {t("checkout.credit_card")}
                </span>
              </div>
            </label>

            <label
              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                selectedMethod === "paypal"
                  ? "bg-indigo-50 border border-indigo-200"
                  : "bg-white border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={selectedMethod === "paypal"}
                onChange={() => setSelectedMethod("paypal")}
                className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
              />
              <div className="flex items-center space-x-2">
                <ShoppingBag className="h-5 w-5 text-indigo-500" />
                <span className="text-sm font-medium text-gray-900">
                  {t("checkout.paypal")}
                </span>
              </div>
            </label>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={checkout(userId, cart)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-8 rounded-md transition duration-150 ease-in-out"
          >
            {t("checkout.order")}
          </button>
        </div>
        <div className="">
          <Modal
            isOpen={modalIsOpen}
            style={customStyleModal}
          >
            <p>{t("checkout.success")}</p>
            <p>{t("checkout.redirect")}</p>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default CheckoutComponent;
