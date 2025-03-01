import { Product } from "@/types/cartTypes";
import { ProductCard } from "./ProductCard";
import { useRouter } from 'next/router';
import { useTranslation } from "next-i18next";


interface AllProductsProps {
  items: Product[];
  onMessage: (text: string) => void;
}

export const AllProducts: React.FC<AllProductsProps> = ({ items, onMessage }) => {

  const router = useRouter();
  const { t } = useTranslation()
  const handleClick = (id: string) => {
    const token = localStorage.getItem('token')
    if (token) {
      router.push(`/products/${id}`);
    } else{
      router.push("/login");
    }
  }

  return (
    <div className="flow-root">
      <div>
        <h2 className="text-2xl font-semibold mb-6">{t('allproducts')}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
        {items.map((item) => (
          <div key={item.id} onClick={() => handleClick(item.id)}>
            <ProductCard
              name={item.name}
              price={item.price}
              media={item.media}
              productId={item.id}
              onMessage={onMessage}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
