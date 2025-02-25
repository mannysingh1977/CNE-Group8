import { User } from "@/types/types";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  getAllUsers,
  revokeSellerUser,
  grantSellerUser,
  deleteUser,
} from "@/services/UserService";
import { Store, Trash } from "lucide-react";
import Tooltip from "@mui/material/Tooltip";

const Admin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [token, setToken] = useState<string | null>(null);

  interface DecodedToken {
    name: string;
    [key: string]: any;
  }

  const decodedToken = token ? jwtDecode<DecodedToken>(token) : null;
  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
  }, []);

  useEffect(() => {
    const setUniformWidth = (id: string) => {
      const elements = document.querySelectorAll(`#${id}`);
      let maxWidth = 0;

      elements.forEach((element) => {
        const width = element.getBoundingClientRect().width;
        if (width > maxWidth) {
          maxWidth = width;
        }
      });

      elements.forEach((element) => {
        (element as HTMLElement).style.width = `${maxWidth}px`;
      });
    };

    setUniformWidth("username");
    setUniformWidth("emailaddress");
  }, [users]);

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      if (data) {
        const sortedData = data.sort((a: User, b: User) => {
          if (a.id === undefined) return 1;
          if (b.id === undefined) return -1;
          return a.id - b.id;
        });
        setUsers(sortedData);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    loadUsers();
  }, [users]);

  const handleRevokeSeller = (userId: number) => async () => {
    console.log("Revoke seller", userId);
    try {
      const res = await revokeSellerUser(userId);
      if (!res || !res.ok) {
        console.log("Something went wrong");
      }
      loadUsers();
    } catch (error) {
      console.log(error);
    }
  };
  const handleGrantSeller = (userId: number) => async () => {
    console.log("Grant seller", userId);
    try {
      const res = await grantSellerUser(userId);
      if (!res || !res.ok) {
        console.log("Something went wrong");
      }
      loadUsers();
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteuser = (userId: number) => async () => {
    console.log("Delete", userId);
    try {
      const res = await deleteUser(userId);
      if (!res || !res.ok) {
        console.log("Something went wrong");
      }
      loadUsers();
    } catch (error) {
      console.log(error);
    }
  };
  if (!users) {
    return <p>Loading...</p>;
  } else {
    return (
      <>
        <div>
          <h1 className="mb-3">All users</h1>
        </div>
        <div className="w-full flex flex-col gap-3">
          {users.map(
            (user) =>
              user.id !== undefined &&
              !(decodedToken && user.name === decodedToken.name) &&
              user.role != "Admin" &&
              user.role != "Owner" && (
                <section
                  className="flex rounded justify-between bg-white shadow-md py-2 px-2"
                  key={user.id}
                >
                  <div className="flex gap-5">
                    <p id="username">{user.name}</p>{" "}
                    <p id="emailaddress">{user.emailAddress}</p>
                  </div>
                  <div className="flex gap-5">
                    {user.seller ? (
                      <Tooltip
                        title={`Revoke ${user.name}'s "Seller" status`}
                        placement="bottom"
                      >
                        <button onClick={handleRevokeSeller(user.id)}>
                          <Store className="text-red-500" />
                        </button>
                      </Tooltip>
                    ) : (
                      <Tooltip
                        title={`Grant ${user.name} "Seller" status`}
                        placement="bottom"
                      >
                        <button onClick={handleGrantSeller(user.id)}>
                          <Store className="text-green-500" />
                        </button>
                      </Tooltip>
                    )}
                    <Tooltip title={`Delete ${user.name}`} placement="bottom">
                      <button onClick={handleDeleteuser(user.id)}>
                        <Trash className="text-red-500" />
                      </button>
                    </Tooltip>
                  </div>
                </section>
              )
          )}
        </div>
      </>
    );
  }
};

export default Admin;
