export const getReviewsForProduct = async (productId: string) => {
    const token = localStorage.getItem("token");
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}review/${productId}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            method: 'GET',
        })
    if (!res.ok) {
        throw new Error("Failed to fetch reviews");
    }
    return res;
}

export const deleteReviewById = async (id: string, productId: string) => {
    const token = localStorage.getItem('token');
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}review/delete/${id}/${productId}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            method: 'DELETE',
        })
    return res
}
