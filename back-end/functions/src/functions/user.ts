// functions/src/functions/user.ts

import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import userService from "../../../service/user.service";
import { Role, UserInput } from "../../../types";

interface LoginBody {
  email: string;
  password: string;
}

interface RegisterBody {
  email: string;
  password: string;
  fullname: string;
}

interface UpdateRoleBody {
  role: Role;
}

interface TokenBody {
  token: string;
}

// 1) GET /users
app.http("getUsers", {
  methods: ["GET"],
  route: "users",
  handler: async (
    req: HttpRequest,
    ctx: InvocationContext
  ): Promise<HttpResponseInit> => {
    try {
      const users = await userService.getAllUsers();
      return { status: 200, body: JSON.stringify(users) };
    } catch (e: any) {
      ctx.log(e);
      return { status: 500, body: e.message };
    }
  },
});

// 2) POST /users/login
app.http("login", {
  methods: ["POST"],
  route: "users/login",
  handler: async (
    req: HttpRequest,
    ctx: InvocationContext
  ): Promise<HttpResponseInit> => {
    try {

      const body = await req.json();
      const input = body as UserInput; // type assertion
      const result = await userService.authenticate(input);
      return { status: 200, body: JSON.stringify(result) };
    } catch (e: any) {
      ctx.log(e);
      return { status: 401, body: e.message };
    }
  },
});

// 3) POST /users/register
app.http("register", {
  methods: ["POST"],
  route: "users/register",
  handler: async (
    req: HttpRequest,
    ctx: InvocationContext
  ): Promise<HttpResponseInit> => {
    try {
      const body = await req.json();
      const input = body as UserInput;
      const user = await userService.addUser(input);
      return { status: 201, body: JSON.stringify(user) };
    } catch (e: any) {
      ctx.log(e);
      return { status: 400, body: e.message };
    }
  },
});

// 4) GET /users/{id}
app.http("getUserById", {
  methods: ["GET"],
  route: "users/{id}",
  handler: async (
    req: HttpRequest,
    ctx: InvocationContext
  ): Promise<HttpResponseInit> => {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      return { status: 200, body: JSON.stringify(user) };
    } catch (e: any) {
      ctx.log(e);
      return { status: 400, body: e.message };
    }
  },
});

// 5) PUT /users/updateRole/{userId}
app.http("updateUserRole", {
  methods: ["PUT"],
  route: "users/updateRole/{userId}",
  handler: async (
    req: HttpRequest,
    ctx: InvocationContext
  ): Promise<HttpResponseInit> => {
    try {
      const { userId } = req.params;
      const body = (await req.json()) as UpdateRoleBody;
      const updated = await userService.updateUserRole(userId, body.role);
      return { status: 200, body: JSON.stringify(updated) };
    } catch (e: any) {
      ctx.log(e);
      return { status: 400, body: e.message };
    }
  },
});

// 6) PUT /users/seller/grant/{userId}
app.http("grantSeller", {
  methods: ["PUT"],
  route: "users/seller/grant/{userId}",
  handler: async (
    req: HttpRequest,
    ctx: InvocationContext
  ): Promise<HttpResponseInit> => {
    try {
      const { userId } = req.params;
      const body = (await req.json()) as TokenBody;
      const updated = await userService.grantSellerStatus(
        userId,
        String(body.token)
      );
      return { status: 200, body: JSON.stringify(updated) };
    } catch (e: any) {
      ctx.log(e);
      return { status: 400, body: e.message };
    }
  },
});

// 7) PUT /users/seller/revoke/{userId}
app.http("revokeSeller", {
  methods: ["PUT"],
  route: "users/seller/revoke/{userId}",
  handler: async (
    req: HttpRequest,
    ctx: InvocationContext
  ): Promise<HttpResponseInit> => {
    try {
      const { userId } = req.params;
      const body = (await req.json()) as TokenBody;
      const updated = await userService.revokeSellerStatus(
        userId,
        String(body.token)
      );
      return { status: 200, body: JSON.stringify(updated) };
    } catch (e: any) {
      ctx.log(e);
      return { status: 400, body: e.message };
    }
  },
});

// 8) DELETE /users/seller/remove/{userId}
app.http("removeUser", {
  methods: ["DELETE"],
  route: "users/seller/remove/{userId}",
  handler: async (
    req: HttpRequest,
    ctx: InvocationContext
  ): Promise<HttpResponseInit> => {
    try {
      const { userId } = req.params;
      const body = (await req.json()) as TokenBody;
      const deleted = await userService.deleteUser(userId, String(body.token));
      return { status: 200, body: JSON.stringify(deleted) };
    } catch (e: any) {
      ctx.log(e);
      return { status: 400, body: e.message };
    }
  },
});
