import React from "react";
import { useAuthStore } from "../store/useAuthStore";

const ChatPage = () => {
  const { logout } = useAuthStore();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-white text-4xl font-bold">Chats</h1>

      <button
        onClick={logout}
        className="
          w-fit px-6 py-2 rounded-lg
          bg-red-500 text-white font-medium
          hover:bg-red-600
          active:scale-95
          transition-all
        "
      >
        Logout
      </button>
    </div>
  );
};

export default ChatPage;
