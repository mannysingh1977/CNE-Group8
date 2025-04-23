# API Endpoint Mapping

This document maps the Azure Function endpoints to the corresponding backend routes.

## User Authentication

| Azure Function Route    | Backend Route        | Description                    |
| ----------------------- | -------------------- | ------------------------------ |
| POST /api/auth/register | POST /users/register | Register a new user            |
| POST /api/auth/login    | POST /users/login    | Login and get JWT token        |
| GET /api/user/profile   | GET /users/profile   | Get authenticated user profile |
| PUT /api/user/profile   | PUT /users/profile   | Update user profile            |

## Products

| Azure Function Route      | Backend Route         | Description                              |
| ------------------------- | --------------------- | ---------------------------------------- |
| GET /api/products         | GET /products         | List all products (with optional search) |
| GET /api/products/{id}    | GET /products/{id}    | Get product by ID                        |
| POST /api/products        | POST /products        | Create a new product                     |
| PUT /api/products/{id}    | PUT /products/{id}    | Update product                           |
| DELETE /api/products/{id} | DELETE /products/{id} | Delete product                           |

## Shopping Cart

| Azure Function Route               | Backend Route           | Description           |
| ---------------------------------- | ----------------------- | --------------------- |
| GET /api/cart                      | GET /cart               | Get user's cart       |
| POST /api/cart/items               | POST /cart/items        | Add item to cart      |
| PUT /api/cart/items/{productId}    | PUT /cart/items/{id}    | Update item quantity  |
| DELETE /api/cart/items/{productId} | DELETE /cart/items/{id} | Remove item from cart |
| POST /api/cart/checkout            | POST /cart/checkout     | Process checkout      |

## File Upload

| Azure Function Route | Backend Route | Description  |
| -------------------- | ------------- | ------------ |
| POST /api/upload     | POST /upload  | Upload files |

## Integration Notes

When migrating from the Express backend to Azure Functions:

1. Keep the authentication middleware: Azure Functions use our custom authentication wrapper that verifies JWT tokens similarly to the express-jwt middleware.

2. Route pattern adjustments:

   - Azure Functions uses `/api` prefix on all routes
   - Parameter syntax might differ (Azure Functions use binding expressions)

3. Error handling:

   - Express uses an error handler middleware
   - Azure Functions use the CustomError class and function wrappers for error handling

4. CORS:
   - Express configures CORS server-wide
   - Azure Functions handle CORS in the function.json configuration
