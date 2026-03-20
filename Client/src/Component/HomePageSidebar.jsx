import { Home, MessageSquare, MapPin, User, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const HomePageSidebar = () => {
  return (
    <div className="w-64 h-screen bg-[#0f0f0f] border-r border-white/10 flex flex-col p-4">



      <nav className="flex flex-col gap-2">
              
              <div className="mb-6 px-15 py-4">
        <h2 className="text-sm font-semibold tracking-wider uppercase 
        !text-cyan-300 opacity-80">
          Menu
        </h2>
      </div>


        <Link
          to="/"
          className="flex items-center gap-3 p-3 rounded-lg 
          !text-cyan-400 hover:!text-cyan-300 
          no-underline hover:bg-white/5 transition"
        >
          <Home size={20} className="!text-cyan-400" />
          Home
        </Link>

        <Link
          to="/sessionList"
          className="flex items-center gap-3 p-3 rounded-lg 
          !text-cyan-400 hover:!text-cyan-300 
          no-underline hover:bg-white/5 transition"
        >
          <MapPin size={20} className="!text-cyan-400" />
          Local Sessions
        </Link>

        <Link
          to="/chat"
          className="flex items-center gap-3 p-3 rounded-lg 
          !text-cyan-400 hover:!text-cyan-300 
          no-underline hover:bg-white/5 transition"
        >
          <MessageSquare size={20} className="!text-cyan-400" />
          Messages
        </Link>

        <Link
          to="/profile"
          className="flex items-center gap-3 p-3 rounded-lg 
          !text-cyan-400 hover:!text-cyan-300 
          no-underline hover:bg-white/5 transition"
        >
          <User size={20} className="!text-cyan-400" />
          Profile
        </Link>

        <Link
          to="/settings"
          className="flex items-center gap-3 p-3 rounded-lg 
          !text-cyan-400 hover:!text-cyan-300 
          no-underline hover:bg-white/5 transition"
        >
          <Settings size={20} className="!text-cyan-400" />
          Settings
        </Link>

      </nav>
    </div>
  );
};

export default HomePageSidebar;