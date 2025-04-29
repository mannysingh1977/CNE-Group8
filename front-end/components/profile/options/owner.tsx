import UserService, {
  deleteUser,
  grantSellerUser,
  revokeSellerUser,
} from "@/services/UserService";
import { Address, Role, User } from "@/types/types";
import { Tooltip } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { Section, Store, Trash } from "lucide-react";
import { useEffect, useState } from "react";

interface ProfileProps {
  userId?: string;
  name: string;
  phoneNumber: string;
  emailAddress: string;
  password: string;
  address: Address;
  seller: boolean;
  newsLetter: boolean;
  role: Role;
}

const Owner: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const roles = ["Admin", "Owner", "User"];
  const [currentUserId, setCurrentUserId] = useState<string>();

  const getAllUsers = async () => {
    try {
      const users = await UserService.getAllUsers();
      users.sort((a: User, b: User) => (Number(a.id) || 0) - (Number(b.id) || 0));
      setUsers(users);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    const fetchToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode<ProfileProps>(token);
        if (decoded && decoded.userId) {
          setCurrentUserId(decoded.userId);
        }
      }
    };
    fetchToken();
  }, []);

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleRevokeSeller = (userId: string) => async () => {
    console.log("Revoke seller", userId);
    try {
      const res = await revokeSellerUser(userId);
      if (!res || !res.ok) {
        console.log("Something went wrong");
      }
      getAllUsers();
    } catch (error) {
      console.log(error);
    }
  };
  const handleGrantSeller = (userId: string) => async () => {
    console.log("Grant seller", userId);
    try {
      const res = await grantSellerUser(userId);
      if (!res || !res.ok) {
        console.log("Something went wrong");
      }
      getAllUsers();
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteuser = (userId: string) => async () => {
    console.log("Delete", userId);
    try {
      const res = await deleteUser(userId);
      if (!res || !res.ok) {
        console.log("Something went wrong");
      }
      getAllUsers();
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (userId: string, newRole: Role) => {
    if (userId === currentUserId) {
      const confirmChange = window.confirm(
        "Are you sure you want to change your own role? You will lose access to this page."
      );
      if (!confirmChange) {
        return;
      }
    }
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );

    try {
      UserService.updateUserRole(userId, newRole);
      console.log(`Role updated for user ${userId}`);
    } catch (error) {
      console.log(`Failed to update role for ${userId}: ${error}`);
    }
  };

  return (
    <>
      <div className="w-full flex flex-col gap-3">
        {users.map((user) => (
          <section
            className="flex rounded justify-between bg-white shadow-md py-2 px-2"
            key={user.id}
          >
            <p>{user.name}</p>
            <div className="flex gap-5">
              <select
                value={user.role || "Role not found"}
                onChange={(e) =>
                  user.id !== undefined &&
                  handleChange(user.id, e.target.value as Role)
                }
                className="ml-2 p-1 rounded-lg bg-transparent text-black border-black border-2"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              {user.seller ? (
                <Tooltip
                  title={`Revoke ${user.name}'s "Seller" status`}
                  placement="bottom"
                >
                  <button
                    onClick={
                      user.id !== undefined
                        ? handleRevokeSeller(user.id)
                        : undefined
                    }
                  >
                    <Store className="text-red-500" />
                  </button>
                </Tooltip>
              ) : (
                <Tooltip
                  title={`Grant ${user.name} "Seller" status`}
                  placement="bottom"
                >
                  <button
                    onClick={
                      user.id !== undefined
                        ? handleGrantSeller(user.id)
                        : undefined
                    }
                  >
                    <Store className="text-green-500" />
                  </button>
                </Tooltip>
              )}
              <Tooltip title={`Delete ${user.name}`} placement="bottom">
                <button
                  onClick={
                    user.id !== undefined
                      ? handleDeleteuser(user.id)
                      : undefined
                  }
                >
                  <Trash className="text-red-500" />
                </button>
              </Tooltip>
            </div>
          </section>
        ))}
      </div>
    </>
  );
};

export default Owner;
