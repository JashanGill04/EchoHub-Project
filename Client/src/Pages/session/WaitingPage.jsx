import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import WaitingArea from "../../Component/sessions/Waitingarea";
import { useAuthStore } from "../../store/useAuthStore";
import { useSessionStore } from "../../store/useSessionStore";
import { socket } from "../../lib/socket";

const WaitingPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const { getSessionById } = useSessionStore();

  useEffect(() => {
    if (!authUser || !sessionId) return;

    getSessionById(sessionId);

    // ❌ DO NOT connect/disconnect here
    socket.emit("join-session", {
      sessionId,
      userId: authUser.id,
    });

    const handleApproved = async ({ userId }) => {
      console.log("✅ Approval received for:", userId);
      
            await getSessionById(sessionId);

      if (userId === authUser.id) {
        navigate(`/sessions/${sessionId}`);
      }
    };

    socket.on("join-request-approved", handleApproved);



    return () => {
      socket.off("join-request-approved", handleApproved);
      socket.emit("leave-session", { sessionId, userId: authUser.id });
    };
  }, [sessionId, authUser, navigate]);

const handleCancelRequest = ()=>{
  //cancel logic
}


  return (
     <div className="min-h-screen flex items-center w-screen justify-center bg-[#120a1a]">
      <WaitingArea onCancel={handleCancelRequest}/>
    </div>
  );
};

export default WaitingPage;
