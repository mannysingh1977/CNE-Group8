"use client";

import { Carousel } from "@/components/main/Carousel";
import { ScrollableRow } from "@/components/main/ScrollableRow";
import { ProductCard } from "@/components/main/ProductCard";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { StatusMessage, StatusMessageContainer } from "./status-message";
import { AllProducts } from "./AllProducts";
import { fetchProducts } from "@/services/mainService";
import { useRouter } from "next/router";

interface Product {
  id: number;
  name: string;
  price: number;
  media: string;
  stock: number;
  details: string
}
interface Message {
  id: string;
  text: string;
}

export default function Home() {
  const { t } = useTranslation();
  const [products10, setProducts10] = useState<Product[]>([]);
  const [productsDynamic, setProductsDynamic] = useState<Product[]>([]);
  const [amountLoaded10, setAmountLoaded10] = useState(10);
  const [amountLoadedDynamic, setAmountLoadedDynamic] = useState(25);
  const [messages, setMessages] = useState<Message[]>([]);

  const removeMessage = (id: string) => {
    setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id));
  };

  const addMessage = (text: String) => {
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      text: text.toString(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setTimeout(() => {
      removeMessage(newMessage.id);
    }, 3000);
  };

  const handleMessage = (text: string) => {
    addMessage(text);
  };
  const fetchData10 = async () => {
    const data = await fetchProducts(amountLoaded10);
    if (data) {
      setProducts10(data);
    }
  };
  const fetchDataDynamic = async () => {
    const data = await fetchProducts(amountLoadedDynamic);
    if (data) {
      setProductsDynamic(data);
    }
  };
  useEffect(() => {
    fetchData10();
    fetchDataDynamic();
  }, [amountLoaded10]);

  const router = useRouter();
  const handleClick = (id: number) => {
    const token = localStorage.getItem('token')
    if (token) {
      router.push(`/products/${id}`);
    } else{
      router.push("/login");
    }
  }


  return (
    <>
      <div className="container mx-auto px-4 my-12">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">{t("index.featured")}</h2>
          <div className="md:hidden">
            <Carousel
              items={products10.map((product) => (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  price={product.price}
                  media={product.media}
                  productId={product.id}
                  onMessage={handleMessage}
                />
              ))}
            />
          </div>
          <div className="hidden md:block">
            <ScrollableRow
              items={products10.map((product) => (
                <button onClick={() => handleClick(product.id)}>
                  <ProductCard
                    key={product.id}
                    name={product.name}
                    price={product.price}
                    media={product.media}
                    productId={product.id}
                    onMessage={handleMessage}
                  />
                </button>
              ))}
            />
          </div>
        </section>
      </div>
      <div className="container mx-auto px-4 my-12">
        <div>
          <AllProducts items={productsDynamic} onMessage={handleMessage} />
        </div>
      </div>
      <StatusMessageContainer>
        {messages.map((msg) => (
          <StatusMessage
            key={msg.id}
            id={msg.id}
            message={msg.text}
            onClose={removeMessage}
          />
        ))}
      </StatusMessageContainer>
    </>
  );
}
