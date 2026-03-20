import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Link } from "react-router-dom";
import { LogOut, MessageSquare, Menu, X } from 'lucide-react';
import HomePageSidebar from '../Component/HomePageSidebar';
const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* NAVBAR */}
      <header className='border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80'>
        
        <div className="container mx-auto px-4 h-16">
          <div className='flex items-center justify-between h-full'>

            {/* LEFT */}
            <div className='flex items-center gap-4'>

              {/* MENU BUTTON */}
              <button 
                onClick={() => setOpen(true)}
                className="p-2 rounded-lg hover:bg-base-200 transition"
              >
                <Menu className="size-5 text-cyan-500 dark:text-cyan-300" />
              </button>

              {/* FIXED LINK WRAP */}
              <Link to='/' className="flex items-center gap-2.5 hover:opacity-80 transition-all">

                <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-cyan-500 dark:text-cyan-300"/>
                </div>

                <h1 className="
                  font-serif text-4xl sm:text-5xl font-extrabold 
                  bg-gradient-to-r 
                  from-cyan-400 via-cyan-300 to-teal-400 
                  dark:from-cyan-300 dark:via-cyan-400 dark:to-teal-300
                  bg-clip-text text-transparent
                  hover:opacity-90 transition-all duration-300
                ">
                  EchoHub
                </h1>

              </Link>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2">
              {authUser && (
                <button 
                  className="flex gap-2 items-center px-2 py-1 rounded-md hover:bg-base-200 transition"
                  onClick={logout}
                >
                  <LogOut className="size-5 text-cyan-500 dark:text-cyan-300" />
                  <span className="hidden sm:inline text-cyan-600 dark:text-cyan-200 font-medium">
                    Logout
                  </span>
                </button>
              )}
            </div>

          </div>
        </div>
      </header>

    {/* SIDEBAR */}
<div className={`
  fixed top-0 left-0 h-full z-50
  transform ${open ? "translate-x-0" : "-translate-x-full"}
  transition-transform duration-300 ease-in-out
`}>

  {/* WRAPPER (to control width + shadow) */}
  <div className="relative">

    {/* CLOSE BUTTON (floating over sidebar) */}
    <button 
      onClick={() => setOpen(false)}
      className="absolute top-4 right-4 z-50 p-1 rounded-md hover:bg-white/10"
    >
      <X className="size-6 text-cyan-400" />
    </button>

    {/* YOUR SIDEBAR COMPONENT */}
    <HomePageSidebar />

  </div>
</div>

      {/* OVERLAY */}
      {open && (
        <div 
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/30 z-40"
        />
      )}
    </>
  )
}

export default Navbar;