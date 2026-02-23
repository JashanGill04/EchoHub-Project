import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { useSessionStore } from "../../store/useSessionStore";
import { Link,useNavigate } from "react-router-dom";
import { socket } from "../../lib/socket";

const SessionList = () => {
  const { sessions, getSessions, isSessionLoading } = useSessionStore();
  const [searchQuery, setSearchQuery] = useState("");
  const {requestToJoin}=useSessionStore();
  const navigate= useNavigate();

  // ✅ fetch once
  useEffect(() => {
    getSessions();
    console.log("Fetching sessions...");
    console.log(sessions);
  }, []);

useEffect(() => {
  const refreshSessions = () => {
    getSessions();
  };
  

  socket.on("session-created", refreshSessions);
  socket.on("session-removed", refreshSessions);

  return () => {
    socket.off("session-created", refreshSessions);
    socket.off("session-removed", refreshSessions);
  };
}, []);



  const handleClick=(id)=>{
    requestToJoin(id);
    navigate(`/sessions/${id}`);
  }

  // ✅ safe filtering
  const filteredSessions = sessions.filter((session) => {
    const query = searchQuery.toLowerCase();

    return (
      session.title.toLowerCase().includes(query) ||
      session.host?.name?.toLowerCase().includes(query) ||
      session.id.toString().includes(query)
    );
  });


  
  return (
 <div className="min-h-screen w-screen bg-base-200 text-base-content flex flex-col">

      {/* Page Content */}
      <div className="flex-1 pt-24 pb-12 max-w-[1600px] mx-auto w-full animate-fade-in-up">

        {/* Header */}
        <div className="px-6 mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Local Sessions
            </h1>
            <p className="text-sm opacity-60 mt-1">
              Join live whiteboard sessions around you
            </p>
          </div>

          <Link
            to="/sessions/create"
            className="
              btn btn-primary text-primary-content
              transition-transform duration-200
              hover:scale-105 active:scale-95
            "
          >
            + Create Session
          </Link>
        </div>

        {/* Search */}
        <div className="px-6 mb-10">
          <input
            type="text"
            placeholder="Search by session title, host, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="
              input input-bordered
              w-full max-w-md
              transition-all duration-300
              focus:outline-none
              focus:ring-2 focus:ring-primary/40
            "
          />
        </div>

        {/* Sessions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
          {isSessionLoading ? (
            <p className="opacity-60 px-6 animate-pulse">
              Loading sessions...
            </p>
          ) : filteredSessions.length > 0 ? (
            filteredSessions.map((session, index) => (
              <div
                key={session.id}
                style={{ animationDelay: `${index * 80}ms` }}
                className="
                  card bg-base-100
                  border border-base-300
                  shadow-md
                  transition-all duration-300
                  hover:-translate-y-1 hover:shadow-xl
                  animate-fade-in-up
                "
              >
                <div className="card-body gap-4">

                  {/* Status */}
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wide opacity-70">
                    <span className="h-2.5 w-2.5 rounded-full bg-success" />
                    Active
                  </div>

                  {/* Title */}
                  <h2 className="card-title text-lg leading-snug">
                    {session.title}
                  </h2>

                  {/* Host */}
                  <p className="text-sm opacity-70">
                    Host:{" "}
                    <span className="font-medium opacity-90">
                      {session.host?.name ?? "Unknown"}
                    </span>
                  </p>

                  {/* ID */}
                  <p className="text-xs opacity-50">
                    Session ID: {session.id}
                  </p>

                  {/* Action */}
                  <div className="card-actions mt-auto">
                    <button
                      onClick={() => handleClick(session.id)}
                      className="
                        btn btn-accent text-accent-content
                        transition-transform duration-200
                        hover:scale-[1.03] active:scale-[0.96]
                      "
                    >
                      Request to Join
                    </button>
                  </div>

                </div>
              </div>
            ))
          ) : (
            <p className="opacity-60 px-6">
              No sessions found.
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-3 text-center text-xs opacity-50 border-t border-base-300">
        © 2025 Collab · Local Collaborative Sessions
      </footer>
    </div>

  );
};



export default SessionList;
