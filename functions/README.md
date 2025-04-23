# CNE Group 8 Azure Functions

This project contains Azure Functions for CNE Group 8's full-stack e-commerce application. It provides serverless API endpoints to manage various resources.

## Function Endpoints

### Items API

- GET /api/items - Get all items for the authenticated user
- POST /api/items - Create a new item
- DELETE /api/items/{id} - Delete an item

### Products API

- GET /api/products - Get all products (with optional search query parameter 'q')
- GET /api/products/{id} - Get a product by ID
- POST /api/products - Create a new product (authentication required)
- PUT /api/products/{id} - Update a product (authentication required)
- DELETE /api/products/{id} - Delete a product (authentication required)

### Cart API

- GET /api/cart - Get the authenticated user's shopping cart
- POST /api/cart/items - Add an item to the cart
- PUT /api/cart/items/{productId} - Update an item's quantity in the cart
- DELETE /api/cart/items/{productId} - Remove an item from the cart
- POST /api/cart/checkout - Checkout the cart (creates order, updates stock)

### User API

- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login and get authentication token
- GET /api/user/profile - Get the current user's profile (authentication required)
- PUT /api/user/profile - Update the current user's profile (authentication required)

### Upload API

- POST /api/upload - Upload a file (images, etc.)

## Local Development

### Prerequisites

- Node.js (v18 or later)
- Azure Functions Core Tools v4
- Azure Cosmos DB Emulator (optional for local testing)
- Azure Storage Emulator (optional for local testing)

### Setup

1. Clone the repository
2. Navigate to the `functions` directory
3. Install dependencies: `npm install`
4. Configure local settings:
   - Update `local.settings.json` with your Cosmos DB connection information
   - Set Azure Storage connection string for file uploads
   - Set a JWT secret for authentication

### Running Locally

```bash
npm start
```

## Deployment

### Deploying to Azure

```bash
npm run deploy
```

This will deploy the functions to Azure Function App named `cne-group8-functions`.

### Environment Variables

The following environment variables must be configured in Azure:

- `COSMOS_DB_ENDPOINT`: The Cosmos DB endpoint URL
- `COSMOS_DB_KEY`: The Cosmos DB access key
- `COSMOS_DB_DATABASE_NAME`: The name of the Cosmos DB database
- `COSMOS_DB_CONTAINER_NAME`: The name of the items container
- `PRODUCT_CONTAINER_NAME`: The name of the products container
- `CART_CONTAINER_NAME`: The name of the shopping cart container
- `USER_CONTAINER_NAME`: The name of the users container
- `AZURE_STORAGE_CONNECTION_STRING`: Connection string for Azure Blob Storage
- `STORAGE_CONTAINER_NAME`: Container name for file uploads
- `JWT_SECRET`: Secret for JWT token validation

## Project Structure

- `/domain`: Domain models (Item, Product, User, Cart)
- `/helpers`: Helper functions for authentication and error handling
- `/repository`: Data access layer for Cosmos DB
- `/service`: Business logic layer
- `/GetItemsHttpTrigger`: Function for retrieving items
- `/CreateItemHttpTrigger`: Function for creating new items
- `/DeleteItemHttpTrigger`: Function for deleting items
- `/GetProductsHttpTrigger`: Function for retrieving products
- `/GetProductByIdHttpTrigger`: Function for retrieving a single product
- `/CreateProductHttpTrigger`: Function for creating new products
- `/UpdateProductHttpTrigger`: Function for updating products
- `/DeleteProductHttpTrigger`: Function for deleting products
- `/GetCartHttpTrigger`: Function for retrieving the user's cart
- `/AddToCartHttpTrigger`: Function for adding items to cart
- `/UpdateCartItemHttpTrigger`: Function for updating cart items
- `/RemoveCartItemHttpTrigger`: Function for removing items from cart
- `/CheckoutCartHttpTrigger`: Function for processing cart checkout
- `/UserLoginHttpTrigger`: Function for user login
- `/UserRegisterHttpTrigger`: Function for user registration
- `/UserProfileHttpTrigger`: Function for managing user profile
- `/UploadFileHttpTrigger`: Function for handling file uploads
