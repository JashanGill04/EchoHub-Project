import React, { useEffect, useState } from "react";
import { useSessionStore } from "../../store/useSessionStore";
import { Link, useNavigate } from "react-router-dom";
import { socket } from "../../lib/socket";
import HomePage from "../HomePage";

const SessionList = () => {
  const { sessions, getSessions, isSessionLoading } = useSessionStore();
  const [searchQuery, setSearchQuery] = useState("");
  const { requestToJoin } = useSessionStore();
  const navigate = useNavigate();

  useEffect(() => {
    getSessions();
  }, []);

  useEffect(() => {
    const refreshSessions = () => getSessions();

    socket.on("session-created", refreshSessions);
    socket.on("session-removed", refreshSessions);

    return () => {
      socket.off("session-created", refreshSessions);
      socket.off("session-removed", refreshSessions);
    };
  }, []);

  const handleClick = (id) => {
    requestToJoin(id);
    navigate(`/sessions/${id}`);
  };

  const filteredSessions = sessions.filter((session) => {
    const query = searchQuery.toLowerCase();
    return (
      session.title.toLowerCase().includes(query) ||
      session.host?.name?.toLowerCase().includes(query) ||
      session.id.toString().includes(query)
    );
  });

  return (
    <HomePage>
      <div className="min-h-screen w-full bg-base-200 text-base-content flex flex-col">

        {/* CONTENT */}
        <div className="flex-1 pt-24 pb-12 max-w-[1600px] mx-auto w-full">

          {/* HEADER */}
          <div className="px-6 mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              {/* PRIMARY TITLE */}
              <h1 className="text-3xl font-bold tracking-tight text-cyan-200">
                LOCAL SESSIONS
              </h1>

              {/* MUTED SUBTEXT */}
              <p className="text-sm mt-1 text-base-content/60">
                Join live whiteboard sessions around you
              </p>
            </div>

            {/* BUTTON (PRIMARY ACCENT) */}
            <Link
              to="/sessions/create"
              className="
                btn 
                !bg-cyan-400 hover:!bg-cyan-300 
                !text-black border-none
              "
            >
              + Create Session
            </Link>
          </div>

          {/* SEARCH */}
          <div className="px-6 mb-10">
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                input input-bordered
                w-full max-w-md
                text-base-content
                placeholder:text-base-content/40
                focus:ring-2 focus:!ring-cyan-400
              "
            />
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
            {isSessionLoading ? (
              <p className="px-6 text-base-content/60 animate-pulse">
                Loading sessions...
              </p>
            ) : filteredSessions.length > 0 ? (
              filteredSessions.map((session) => (
                <div
                  key={session.id}
                  className="
                    card bg-base-100
                    border border-base-300
                    shadow-md
                    transition-all duration-300
                    hover:-translate-y-1 hover:shadow-xl
                  "
                >
                  <div className="card-body gap-4">

                    {/* STATUS */}
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-cyan-200">
                      <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
                      Active
                    </div>

                    {/* TITLE (PRIMARY) */}
                    <h2 className="card-title text-lg text-cyan-200 dark:text-cyan-200">
                      {session.title}
                    </h2>

                    {/* HOST (SECONDARY CYAN + NEUTRAL NAME) */}
                    <p className="text-sm text-cyan-300 dark:text-cyan-300">
                      Host:{" "}
                      <span className="font-medium text-base-content">
                        {session.host?.name ?? "Unknown"}
                      </span>
                    </p>

                    {/* ID (MUTED) */}
                    <p className="text-xs text-base-content/50">
                      Session ID: {session.id}
                    </p>

                    {/* ACTION BUTTON */}
                    <div className="card-actions mt-auto">
                      <button
                        onClick={() => handleClick(session.id)}
                        className="
                          btn 
                          !bg-cyan-400 hover:!bg-cyan-300 
                          !text-black border-none
                        "
                      >
                        Request to Join
                      </button>
                    </div>

                  </div>
                </div>
              ))
            ) : (
              <p className="px-6 text-base-content/60">
                No sessions found.
              </p>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <footer className="py-3 text-center text-xs text-base-content/50 border-t border-base-300">
          © 2025 Collab · Local Collaborative Sessions
        </footer>

      </div>
    </HomePage>
  );
};

export default SessionList;