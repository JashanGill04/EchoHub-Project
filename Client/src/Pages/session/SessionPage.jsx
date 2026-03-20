import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import WhiteBoard from "../../Component/Whiteboard/WhiteBoardPage";
import RequestsModal from "../../Component/sessions/RequestsModal";
import ParticipantsPanel from "../../Component/sessions/ParticipantsPanel";
import ChatSidebar from "../../Component/sessions/ChatSidebar";
import { useAuthStore } from "../../store/useAuthStore";
import { useSessionStore } from "../../store/useSessionStore";
import { socket } from "../../lib/socket";
import toast from "react-hot-toast";
import { useVoiceCall } from "../../hooks/useVoiceCall";
import VoiceControls from "../../Component/sessions/VoiceControls";
import { useLiveChatStore } from "../../store/useLiveChatStore";

const SessionPage = () => {
  // Navigation & Params
  const navigate = useNavigate();
  const { sessionId } = useParams();

  // Global stores
  const { authUser } = useAuthStore();
  const {  clearchat } = useLiveChatStore();
  const {
    selectedSession,
    getSessionById,
    getJoinRequests,
    leaveSession,
    joinRequest,
    isSessionLoading,
  } = useSessionStore();

  // Local UI state
  const [activeSidebarTab, setActiveSidebarTab] = useState("chat");
  const [showRequests, setShowRequests] = useState(false);

  // Fetch session + socket connect
  useEffect(() => {
    if (!sessionId || !authUser) return;

    getSessionById(sessionId);


    socket.emit("join-session", {
      sessionId,
      userId: authUser.id,
    });

    return () => {
      socket.emit("leave-session", {
        sessionId,
        userId: authUser.id,
      });
    };
  }, [sessionId, authUser]);

  // Derived permissions
  const isHost = authUser?.id === selectedSession?.host?.id;
  const isParticipant = selectedSession?.SessionParticipants?.some(
    (p) => p.userId === authUser?.id
  );

const isCaller= isHost? true : false; 

const {
    startAudio,
    toggleMute,
    leaveAudio,
    toggleSpeakerMute,
    inCall,
    muted,
  } = useVoiceCall({
    sessionId,
    userId: authUser.id,
    isCaller
  });

  // 🔐 Redirect outsiders to waiting page
  useEffect(() => {
    if (!selectedSession || !authUser) return;

    if (!isHost && !isParticipant) {
      navigate(`/sessions/${sessionId}/waiting`);
    }
  }, [selectedSession, authUser]);


  // join-request updates
  useEffect(() => {
    if (!isHost || !sessionId) return;

    const refreshRequests = () => getJoinRequests(sessionId);

    socket.on("join-request-created", refreshRequests);
    socket.on("join-request-updated", refreshRequests);

    return () => {
      socket.off("join-request-created", refreshRequests);
      socket.off("join-request-updated", refreshRequests);
    };
  }, [isHost, sessionId]);


 useEffect(()=>{
    if(!sessionId) return;

    const handleSessionEnded=({message})=>{
          toast(message);
          (navigate('/'));
    };
    socket.on("session-ended",handleSessionEnded);
    return()=>{
      socket.off("session-ended",handleSessionEnded);
    }

 },[sessionId]);

 useEffect(() => {
  if (!sessionId) return;

  const refreshSession = () => {
    getSessionById(sessionId);
  };

  socket.on("participant-joined", refreshSession);
  socket.on("participant-left", refreshSession);

  return () => {
    socket.off("participant-joined", refreshSession);
    socket.off("participant-left", refreshSession);
  };
}, [sessionId]);

  // Leave session handler
  const handleLeaveSession = async () => {
     await leaveSession(sessionId);
     clearchat();
     navigate("/");
  };

  // Loading state
  if (isSessionLoading || !selectedSession) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading session...
      </div>
    );
  }

  // 🔥 Main render (host & participants only)
  return (
 <div className="min-h-screen w-screen bg-base-200 text-base-content flex flex-col p-10 pt-20">
  {/* ↑ pt-16 accounts for global Navbar */}
  {/* HEADER */}
<header className="h-14 text-cyan-200 px-5 flex items-center justify-between bg-gray-950 rounded-2xl border-2  border-zinc-400 ">

  {/* LEFT: Session Info */}
  <div className="flex flex-col leading-tight">
    <span className="text-sm font-semibold truncate max-w-[220px]">
      {selectedSession.title}
    </span>
    <span className="text-xs opacity-60">
      {selectedSession.host.name} {isHost && "(You)"}
    </span>
  </div>

  {/* CENTER: Voice Controls */}
  <div className="flex items-center gap-2 ">
    <VoiceControls
      inCall={inCall}
      muted={muted}
      onJoin={startAudio}
      onMute={toggleMute}
      onSpeakerMute={toggleSpeakerMute}
      onLeave={leaveAudio}
    />
  </div>

  {/* RIGHT: Actions */}
<div className="flex items-center gap-2">

  {isHost && (
    <button
      onClick={() => setShowRequests(true)}
      className="btn btn-primary btn-sm relative !text-cyan-200"
    >
      Requests
      <span className="badge badge-primary badge-xs absolute -top-2 -right-2 !text-cyan-200">
        {joinRequest?.length || 0}
      </span>
    </button>
  )}

  <button
    onClick={handleLeaveSession}
    className="btn btn-xs btn-primary !text-cyan-200"
  >
    Leave
  </button>

</div>
</header>

  {/* MAIN */}
  <main className="flex-1 overflow-hidden px-4 py-6">
    <div className="max-w-[1700px] mx-auto flex gap-6 h-full">

      {/* WHITEBOARD */}
      <section className="flex-1 flex flex-col animate-fade-in-up">
        <div className="
          flex-1 rounded-xl
          bg-base-100
          border border-base-300
          shadow-lg
          overflow-hidden
        ">
<WhiteBoard
  sessionId={sessionId}
  isHost={isHost}
/>
        </div>

        {!isHost && (
          <p className="mt-2 text-xs opacity-60 text-center">
            View-only mode · Host controls the board
          </p>
        )}
      </section>

      {/* SIDEBAR (WIDER) */}
      <aside
        className="
          w-[440px]
          min-w-[420px]
          bg-base-100
          rounded-xl
          border border-base-300
          shadow-lg
          flex flex-col
          overflow-hidden
          animate-fade-in-up
        "
      >
        {/* Tabs */}
        <div className="flex border-b border-base-300">
          <button
            onClick={() => setActiveSidebarTab('chat')}
            className={`
              flex-1 py-3 text-sm font-medium btn btn-primary btn-sm transition
              ${
                activeSidebarTab === 'chat'
                  ? 'bg-base-200 text-primary'
                  : 'opacity-60 hover:bg-base-200'
              }
            `}
          >
            Chat
          </button>

          <button
            onClick={() => setActiveSidebarTab('participants')}
            className={`
              flex-1 py-3 text-sm btn btn-primary btn-sm font-medium transition
              ${
                activeSidebarTab === 'participants'
                  ? 'bg-base-200 text-primary'
                  : 'opacity-60 hover:bg-base-200'
              }
            `}
          >
            Participants
          </button>
        </div>

        {/* Content */}
<div className="flex-1 overflow-hidden relative">
  
  {/* CHAT TAB */}
  <div className={`h-full ${activeSidebarTab === 'chat' ? "block" : "hidden"}`}>
    <ChatSidebar sessionId={sessionId} user={authUser}/>
  </div>

  {/* PARTICIPANTS TAB */}
  <div className={`h-full ${activeSidebarTab === 'participants' ? "block" : "hidden"}`}>
    <ParticipantsPanel
      host={selectedSession.host}
      participants={selectedSession.SessionParticipants || []}
    />
  </div>

</div>
      </aside>
    </div>
  </main>

  {/* FOOTER */}
  <footer className="py-3 text-center text-xs opacity-50 border-t border-base-300">
    © 2025 Collab · Built for local collaborative sessions
  </footer>

  {/* REQUEST MODAL */}
  {isHost && showRequests && (
    <RequestsModal onClose={() => setShowRequests(false)} />
  )}
</div>


  );
};

export default SessionPage;
