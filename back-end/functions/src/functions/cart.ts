import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import cartService from "../../../service/cart.service";

interface CartItemRequest {
  productId: string;
  quantity: number;
}

interface CartItemUpdateRequest {
  itemId: string;
  productId: string;
  quantity: number;
}

interface CartCheckoutRequest {
  cart: {
    items: Array<{
      productId: string;
      quantity: number;
    }>;
  };
}

app.http("getCartItems", {
  methods: ["GET"],
  route: "cart/items/{userId}",
  handler: async (
    req: HttpRequest,
    ctx: InvocationContext
  ): Promise<HttpResponseInit> => {
    try {
      const { userId } = req.params;
      const cartItems = await cartService.getCartItems(userId);
      return { status: 200, body: JSON.stringify(cartItems) };
    } catch (e: any) {
      ctx.log(e);
      return { status: 500, body: e.message };
    }
  },
});

app.http("addToCart", {
  methods: ["POST"],
  route: "cart/add/{userId}",
  handler: async (
    req: HttpRequest,
    ctx: InvocationContext
  ): Promise<HttpResponseInit> => {
    try {
      const { userId } = req.params;
      const body = (await req.json()) as CartItemRequest;
      const result = await cartService.addToCart(
        userId,
        body.productId,
        Number(body.quantity)
      );
      return { status: 200, body: JSON.stringify(result) };
    } catch (e: any) {
      ctx.log(e);
      return { status: 400, body: e.message };
    }
  },
});

app.http("removeFromCart", {
  methods: ["DELETE"],
  route: "cart/remove/{userId}",
  handler: async (
    req: HttpRequest,
    ctx: InvocationContext
  ): Promise<HttpResponseInit> => {
    try {
      const { userId } = req.params;
      const body = (await req.json()) as { productId: string };
      const result = await cartService.removeFromCart(userId, body.productId);
      return { status: 200, body: JSON.stringify(result) };
    } catch (e: any) {
      ctx.log(e);
      return { status: 400, body: e.message };
    }
  },
});

app.http("updateCart", {
  methods: ["PUT"],
  route: "cart/update/{userId}",
  handler: async (
    req: HttpRequest,
    ctx: InvocationContext
  ): Promise<HttpResponseInit> => {
    try {
      const { userId } = req.params;
      const body = (await req.json()) as CartItemUpdateRequest;
      const result = await cartService.updateCart(
        userId,
        body.productId,
        Number(body.quantity),
        body.itemId
      );
      return { status: 200, body: JSON.stringify(result) };
    } catch (e: any) {
      ctx.log(e);
      return { status: 400, body: e.message };
    }
  },
});

app.http("checkout", {
  methods: ["DELETE"],
  route: "cart/checkout/{userId}",
  handler: async (
    req: HttpRequest,
    ctx: InvocationContext
  ): Promise<HttpResponseInit> => {
    try {
      const { userId } = req.params;
      const body = (await req.json()) as CartCheckoutRequest;
      const result = await cartService.checkout(userId, body.cart);
      return { status: 200, body: JSON.stringify(result) };
    } catch (e: any) {
      ctx.log(e);
      return { status: 400, body: e.message };
    }
  },
});

app.http("getOrdersByUserId", {
  methods: ["GET"],
  route: "cart/orders/{userId}",
  handler: async (
    req: HttpRequest,
    ctx: InvocationContext
  ): Promise<HttpResponseInit> => {
    try {
      const { userId } = req.params;
      const orders = await cartService.getOrdersByUserId(userId);
      return { status: 200, body: JSON.stringify(orders) };
    } catch (e: any) {
      ctx.log(e);
      return { status: 400, body: e.message };
    }
  },
});
