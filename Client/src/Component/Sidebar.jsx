import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { motion } from "framer-motion";
import { Users } from "lucide-react";

const Sidebar = () => {
  const { getUsers,getAllUsers,users,allUsers ,selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers,authUser } = useAuthStore();
  const [searchValue, setSearchValue] = useState("");
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
    getAllUsers();
  }, []);

  const handleChange = (e) => {
    setSearchValue(e.target.value);
  }


let displayedUsers;

if (searchValue.trim() !== "") {
  displayedUsers = allUsers.filter((user) =>
    user.name.toLowerCase().includes(searchValue.toLowerCase())
  );
} else {
  displayedUsers = users;
}

if (showOnlineOnly) {
  console.log(displayedUsers[0].id);
  displayedUsers = displayedUsers.filter((user) =>
    onlineUsers.includes(`${user.id}`)
  );
}

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
       
      <div className="w-full pt-1">
      <input
        type="text"
        value={searchValue}
        onChange={handleChange}
        placeholder="Search..."
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
      />
    </div>

        


        {/* TODO: Online filter toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length==0 ? 0 : onlineUsers.length-1} online)</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
      {displayedUsers.map((user) => (
  <motion.button
   key={user.id}
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
    onClick={() =>{ setSelectedUser(user,authUser.id);
      console.log("Selected user:", user);
    }}

    className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors
      ${selectedUser?.id === user.id ? "bg-base-300 ring-1 ring-base-300" : ""}
    `}
  >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(`${user.id}`) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.name}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(`${user.id}`) ? "Online" : "Offline"}
              </div>
            </div>
          </motion.button>
        ))}

        {displayedUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;

