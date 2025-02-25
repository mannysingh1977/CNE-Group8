export const fetchProducts = async (amountLoaded: number) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}products/desc/limit/${amountLoaded}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return await res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};
