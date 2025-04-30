import { CosmosClient } from "@azure/cosmos";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const endpoint = process.env.COSMOS_DB_ENDPOINT as string;
const databaseId = process.env.COSMOS_DB_ID as string;
const key = process.env.COSMOS_DB_KEY

const client = new CosmosClient({ endpoint:endpoint, key:key });

async function seedDatabase() {
  console.log("Seeding database...");

  // Ensure database exists
  const { database } = await client.databases.createIfNotExists({ id: databaseId });

  // Get containers
  const usersContainer = database.container("user");
  const addressesContainer = database.container("address");
  const productsContainer = database.container("product");
  const reviewContainer = database.container("review")

  // Create Addresses
  const addresses = [
    { id: "1", street: "Bondgenotenlaan", houseNumber: "1", city: "Leuven", state: "Vlaams Brabant", postalCode: "3000", country: "Belgium" },
    { id: "2", street: "Maria Theresistraat", houseNumber: "20", city: "Leuven", state: "Vlaams Brabant", postalCode: "30000", country: "Belgium" },
    { id: "3", street: "Naamsestraat", houseNumber: "45", city: "Leuven", state: "Vlaams Brabant", postalCode: "3000", country: "Belgium" },
    { id: "4", street: "Parkstraat", houseNumber: "12A", city: "Brussels", state: "Brussels Capital", postalCode: "1000", country: "Belgium" },
    { id: "5", street: "Diestsestraat", houseNumber: "58B", city: "Leuven", state: "Vlaams Brabant", postalCode: "3000", country: "Belgium" },
  ];

  for (const address of addresses) {
    await addressesContainer.items.upsert(address);
  }

  // Create Users with pre-created Addresses
  const users = [
    { id: "1", name: "Jhon Doe", phoneNumber: "+32 123 45 67 89", emailAddress: "Jhon.owner@userbazaar.com", password: "JhonsSuperSecretPassword", seller: true, newsLetter: true, role: "Owner", addressId: "1" },
    { id: "2", name: "Jane Toe", phoneNumber: "+32 400 85 96 91", emailAddress: "Jane.Toe@gmail.com", password: "Something_secure", seller: true, newsLetter: true, role: "User", addressId: "2" },
    { id: "3", name: "Mike Smith", phoneNumber: "+32 234 56 78 90", emailAddress: "mike.smith@domain.com", password: "SecurePassword123", seller: false, newsLetter: false, role: "User", addressId: "3" },
    { id: "4", name: "Emily White", phoneNumber: "+32 499 22 33 44", emailAddress: "Emily.admin@userbazaar.com", password: "SuperSecretPassword", seller: true, newsLetter: false, role: "Admin", addressId: "4" },
    { id: "5", name: "Chris Brown", phoneNumber: "+32 488 77 66 55", emailAddress: "Chris.Brown@gmail.com", password: "AnotherSecurePassword", seller: false, newsLetter: true, role: "User", addressId: "5" },
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 12);
    await usersContainer.items.upsert({ ...user, password: hashedPassword });
  }

  // Create Products
  const products = [
    { id: "1", name: "JBL Headphones", description: "Noise-cancelling over-ear headphones", media: "https://cnegroup8picturestorage.blob.core.windows.net/pictures/jbl.jpeg", stock: 50, price: 199, details: "Wireless, 20 hours battery life" },
    { id: "2", name: "Apple iPhone 13", description: "Latest model of the iPhone series", media: "https://cnegroup8picturestorage.blob.core.windows.net/pictures/iphone.jpg", stock: 30, price: 999, details: "128GB, Black" },
    { id: "3", name: "Samsung Galaxy S21", description: "Flagship smartphone from Samsung", media: "https://cnegroup8picturestorage.blob.core.windows.net/pictures/samsung21.jpg", stock: 40, price: 799, details: "256GB, Silver" },
    { id: "4", name: "Sony WH-1000XM4", description: "Industry-leading noise canceling", media: "https://cnegroup8picturestorage.blob.core.windows.net/pictures/SonyWH.png", stock: 25, price: 349, details: "30 hours battery life, touch sensor controls" },
    { id: "5", name: "Dell XPS 13", description: "High-performance laptop with InfinityEdge display", media: "https://cnegroup8picturestorage.blob.core.windows.net/pictures/Dell_XPS_13.png", stock: 15, price: 1199, details: "13.4-inch FHD+, Intel Core i7, 16GB RAM, 512GB SSD" },
    { id: "6", name: "Nintendo Switch", description: "Hybrid gaming console", media: "https://cnegroup8picturestorage.blob.core.windows.net/pictures/NintendoSwitch.jpg", stock: 50, price: 299, details: "Neon Blue and Red Joy-Con" },
    { id: "7", name: "Amazon Echo Dot", description: "Smart speaker with Alexa", media: "https://cnegroup8picturestorage.blob.core.windows.net/pictures/echo.png", stock: 100, price: 49, details: "4th Gen, Charcoal" },
    { id: "8", name: "Apple MacBook Pro", description: "Powerful laptop with M1 chip", media: "https://cnegroup8picturestorage.blob.core.windows.net/pictures/macbook.png", stock: 20, price: 1299, details: "13-inch, 8GB RAM, 256GB SSD" },
    { id: "9", name: "Samsung QLED TV", description: "Smart TV with Quantum Dot technology", media: "https://cnegroup8picturestorage.blob.core.windows.net/pictures/SamsungQled.jpg", stock: 10, price: 1499, details: "65-inch, 4K UHD, HDR" },
    { id: "10", name: "GoPro HERO9", description: "Waterproof action camera", media: "https://cnegroup8picturestorage.blob.core.windows.net/pictures/GoProHERO9.jpg", stock: 50, price: 399, details: "5K video, 20MP photos" },
  ];

  for (const product of products) {
    await productsContainer.items.upsert(product);
  }

  const reviews = [
    { id: "1", userId: "1", productId: "1", reviewText: "Good sound", stars: 3 },
    { id: "2", userId: "2", productId: "1", reviewText: "Very comfortable to wear", stars: 4 },
    { id: "3", userId: "3", productId: "1", reviewText: "Battery lasts long", stars: 5 },
    { id: "4", userId: "1", productId: "2", reviewText: "Great camera quality", stars: 1 },
    { id: "5", userId: "2", productId: "2", reviewText: "Very fast and smooth", stars: 3 },
    { id: "6", userId: "3", productId: "2", reviewText: "Love the design", stars: 3 },
    { id: "7", userId: "1", productId: "3", reviewText: "Amazing display", stars: 4 },
    { id: "8", userId: "4", productId: "3", reviewText: "Very responsive", stars: 5 },
    { id: "9", userId: "2", productId: "3", reviewText: "Solid build quality", stars: 4 },
    { id: "10", userId: "3", productId: "4", reviewText: "Noise canceling is top-notch", stars: 5 },
    { id: "11", userId: "5", productId: "4", reviewText: "Excellent for travel", stars: 4 },
    { id: "12", userId: "4", productId: "5", reviewText: "Fast and lightweight", stars: 5 },
    { id: "13", userId: "1", productId: "5", reviewText: "Beautiful screen", stars: 4 },
    { id: "14", userId: "2", productId: "5", reviewText: "Perfect for work", stars: 5 },
    { id: "15", userId: "3", productId: "6", reviewText: "Fun for the whole family", stars: 5 },
    { id: "16", userId: "4", productId: "6", reviewText: "Great game selection", stars: 4 },
    { id: "17", userId: "5", productId: "6", reviewText: "Easy to set up", stars: 5 },
    { id: "18", userId: "2", productId: "7", reviewText: "Very handy with Alexa", stars: 4 },
    { id: "19", userId: "1", productId: "7", reviewText: "Compact and powerful", stars: 5 },
    { id: "20", userId: "3", productId: "7", reviewText: "Good sound for the size", stars: 4 },
    { id: "21", userId: "4", productId: "8", reviewText: "Super fast with M1 chip", stars: 5 },
    { id: "22", userId: "5", productId: "8", reviewText: "Battery lasts all day", stars: 5 },
    { id: "23", userId: "1", productId: "9", reviewText: "Picture quality is stunning", stars: 5 },
    { id: "24", userId: "2", productId: "9", reviewText: "Great for movies", stars: 4 },
    { id: "25", userId: "3", productId: "10", reviewText: "Perfect for travel vlogs", stars: 5 },
    { id: "26", userId: "4", productId: "10", reviewText: "Easy to use", stars: 4 },
    { id: "27", userId: "5", productId: "10", reviewText: "Great video quality", stars: 5 }
  ];


  for (const review of reviews) {
    await reviewContainer.items.upsert(review);
  }

  console.log("Seeding complete!");
}

// Run the seed script
seedDatabase().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
