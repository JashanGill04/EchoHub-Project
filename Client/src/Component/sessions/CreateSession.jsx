import React, { useState } from "react";
import Navbar from "../../Pages/Navbar";
import { useSessionStore } from "../../store/useSessionStore";
import { useNavigate } from 'react-router-dom';

const CreateSession = () => {
    const navigate = useNavigate();

  const [title, setTitle] = useState("");

  const { createSession, iscreatingSession } = useSessionStore();

  const handleSubmit = (e) => {
    e.preventDefault();         
    createSession(title,navigate); 
            
  };

  return (
    <div className="min-h-screen w-screen bg-[#120a1a] text-gray-200">
      <Navbar />

      <div className="max-w-2xl mx-auto pt-24 px-6">
        <div className="bg-[#1b1026] border border-white/10 rounded-xl p-6 shadow-lg">

          <h1 className="text-2xl font-semibold mb-2">
            Host a Session
          </h1>

          <p className="text-sm text-gray-400 mb-6">
            Create a whiteboard session and allow others to request access.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm mb-1 text-gray-300">
                Session Title
              </label>
              <input
                type="text"
                placeholder="e.g. DBMS – Normal Forms"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-[#120a1a] border border-white/10"
              />
            </div>

            <button
              type="submit"
              disabled={iscreatingSession}
              className={`
                w-full py-2 rounded-lg font-medium text-sm
                ${
                  iscreatingSession
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-amber-400 text-black hover:bg-amber-300"
                }
              `}
            >
              {iscreatingSession ? "Creating..." : "Host Session"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateSession;
