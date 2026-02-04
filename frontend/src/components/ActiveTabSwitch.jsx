import { useChatStore } from "../store/useChatStore";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div className="relative flex w-full items-center gap-3 rounded-xl bg-slate-800/60 p-3 shadow-sm backdrop-blur-md">
      {/* ACTIVE BACKGROUND */}
      <span
        className={`absolute inset-y-3 rounded-lg bg-cyan-500/20 transition-all duration-300 ease-out
          ${activeTab === "chats" ? "left-3 w-[calc(50%-0.75rem)]" : "left-[calc(50%+0.75rem)] w-[calc(50%-0.75rem)]"}
        `}
      />

      <button
        onClick={() => setActiveTab("chats")}
        className={`relative z-10 flex-1 rounded-lg py-2 text-sm font-medium transition-colors
          ${
            activeTab === "chats"
              ? "text-cyan-400"
              : "text-slate-400 hover:text-slate-200"
          }`}
      >
        Chats
      </button>

      <button
        onClick={() => setActiveTab("contacts")}
        className={`relative z-10 flex-1 rounded-lg py-2 text-sm font-medium transition-colors
          ${
            activeTab === "contacts"
              ? "text-cyan-400"
              : "text-slate-400 hover:text-slate-200"
          }`}
      >
        Contacts
      </button>
    </div>
  );
}

export default ActiveTabSwitch;
