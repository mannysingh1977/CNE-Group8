import { Role, User } from "@/types/types";
import { jwtDecode, JwtPayload } from "jwt-decode";

export interface CustomJwtPayload extends JwtPayload {
  role: string;
}

const loginUser = (user: User) => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
};

export const getUser = async (userId: string) => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + `users/${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const user = await response.json();
  return user;
};

export const getAllUsers = async () => {
  const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  const user = await response.json();
  return user;
};

export const revokeSellerUser = async (userId: string) => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("no token found");
    return;
  }

  const decodedToken = jwtDecode<CustomJwtPayload>(token);

  if (decodedToken.role !== "Admin" && decodedToken.role !== "Owner") {
    console.log("User is not Admin or Owner");
    return;
  }

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + `users/seller/revoke/${userId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        token: token,
      }),
    }
  );
  //   console.log(decodedToken);
  //   console.log(token);
  return response;
};

export const grantSellerUser = async (userId: string) => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("no token found");
    return;
  }

  const decodedToken = jwtDecode<CustomJwtPayload>(token);

  if (decodedToken.role !== "Admin" && decodedToken.role !== "Owner") {
    console.log("User is not Admin or Owner");
    return;
  }
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + `users/seller/grant/${userId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        token: token,
      }),
    }
  );
  //   console.log(decodedToken);
  //   console.log(token);
  return response;
};

export const deleteUser = async (userId: string) => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("no token found");
    return;
  }

  const decodedToken = jwtDecode<CustomJwtPayload>(token);

  if (decodedToken.role !== "Admin" && decodedToken.role !== "Owner") {
    console.log("User is not Admin or Owner");
    return;
  }
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + `users/seller/remove/${userId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        token: token,
      }),
    }
  );
  //   console.log(decodedToken);
  //   console.log(token);
  return response;
};

const updateUserRole = async (userId: string, role: Role) => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + `users/updateRole/${userId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ role }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update role");
  }

  const user = await response.json();
  return user;
};

const UserService = {
  loginUser,
  getUser,
  getAllUsers,
  updateUserRole,
};

export default UserService;
