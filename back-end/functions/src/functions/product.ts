import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import productService from "../../../service/product.service";

app.http("getAllProducts", {
  methods: ["GET"],
  route: "products/all",
  handler: async (
    req: HttpRequest,
    ctx: InvocationContext
  ): Promise<HttpResponseInit> => {
    try {
      const products = await productService.getAllProducts();
      return { status: 200, body: JSON.stringify(products) };
    } catch (e: any) {
      ctx.log(e);
      return { status: 500, body: e.message };
    }
  },
});

app.http("getProductsWithLimit", {
  methods: ["GET"],
  route: "products/desc/limit/{limit}",
  handler: async (
    req: HttpRequest,
    ctx: InvocationContext
  ): Promise<HttpResponseInit> => {
    try {
      const { limit } = req.params;
      const products = await productService.getProductsLimitDesc(Number(limit));
      return { status: 200, body: JSON.stringify(products) };
    } catch (e: any) {
      ctx.log(e);
      return { status: 500, body: e.message };
    }
  },
});

app.http("getProductById", {
  methods: ["GET"],
  route: "products/{id}",
  handler: async (
    req: HttpRequest,
    ctx: InvocationContext
  ): Promise<HttpResponseInit> => {
    try {
      const { id } = req.params;
      if (!id || id.trim() === "") {
        return {
          status: 400,
          body: JSON.stringify({ error: "Invalid product id provided" }),
        };
      }
      const product = await productService.getProductById(id);
      return { status: 200, body: JSON.stringify(product) };
    } catch (e: any) {
      ctx.log(e);
      return { status: 500, body: e.message };
    }
  },
});

app.http("createProduct", {
  methods: ["POST"],
  route: "products",
  handler: async (
    req: HttpRequest,
    ctx: InvocationContext
  ): Promise<HttpResponseInit> => {
    try {
      const body = await req.json();
      const createdProduct = await productService.createProduct(body);
      return { status: 200, body: JSON.stringify(createdProduct) };
    } catch (e: any) {
      ctx.log(e);
      return { status: 500, body: e.message };
    }
  },
});

app.http("getProductCatalog", {
  methods: ["GET"],
  route: "products/catalog/{userId}",
  handler: async (
    req: HttpRequest,
    ctx: InvocationContext
  ): Promise<HttpResponseInit> => {
    try {
      const { userId } = req.params;
      const catalog = await productService.getProductCatalog(userId);
      return { status: 200, body: JSON.stringify(catalog) };
    } catch (e: any) {
      ctx.log(e);
      return { status: 500, body: e.message };
    }
  },
});
