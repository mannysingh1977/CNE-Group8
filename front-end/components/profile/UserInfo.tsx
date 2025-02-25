import { User } from "@/types/types";

export default function UserInfo({ user }: { user: User }) {
  return (
    <div className="mt-4">
      <p className="text-gray-600"><strong>Email:</strong> {user.emailAddress}</p>
      <p className="text-gray-600"><strong>Member since:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
      <p className="text-gray-600"><strong>Last login:</strong> {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}</p>
      {user.bio && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Bio</h2>
          <p className="text-gray-600">{user.bio}</p>
        </div>
      )}
    </div>
  )
}

