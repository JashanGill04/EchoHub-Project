import { useEffect, useRef, useState } from "react";
import { socket } from "../lib/socket";
import { rtcConfig } from "../lib/WebrtcConfig";

export const useVoiceCall = ({ sessionId }) => {
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteAudioRef = useRef(null);
const [speakerMuted, setSpeakerMuted] = useState(false);

  const [inCall, setInCall] = useState(false);
  const [muted, setMuted] = useState(false);

  /* -------------------- PEER CONNECTION -------------------- */
  const ensurePeerConnection = () => {
    if (pcRef.current) return;

    const pc = new RTCPeerConnection(rtcConfig);
    pcRef.current = pc;

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("webrtc-signal", {
          sessionId,
          data: e.candidate,
        });
      }
    };

    pc.ontrack = (e) => {
      if (!remoteAudioRef.current) {
        const audio = document.createElement("audio");
        audio.autoplay = true;
        audio.playsInline = true;
        remoteAudioRef.current = audio;
        document.body.appendChild(audio);
      }
      remoteAudioRef.current.srcObject = e.streams[0];
      console.log("🔊 Remote audio playing");
    };

    pc.onnegotiationneeded = async () => {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("webrtc-signal", {
        sessionId,
        data: offer,
      });
    };
  };

  /* -------------------- SIGNAL HANDLING -------------------- */
  useEffect(() => {
    ensurePeerConnection();

    socket.on("webrtc-signal", async ({ data }) => {
      const pc = pcRef.current;
      if (!pc) return;

      if (data.type === "offer") {
        await pc.setRemoteDescription(data);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("webrtc-signal", { sessionId, data: answer });
      }

      if (data.type === "answer") {
        await pc.setRemoteDescription(data);
      }

      if (data.candidate) {
        await pc.addIceCandidate(data);
      }
    });

    return () => socket.off("webrtc-signal");
  }, [sessionId]);

  /* -------------------- START AUDIO -------------------- */
  const startAudio = async () => {
    ensurePeerConnection();

    if (!localStreamRef.current) {
      localStreamRef.current =
        await navigator.mediaDevices.getUserMedia({ audio: true });

      localStreamRef.current.getTracks().forEach((track) => {
        pcRef.current.addTrack(track, localStreamRef.current);
      });
    }

    setInCall(true);
  };

  /* -------------------- MUTE -------------------- */
  const toggleMute = () => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (!track) return;

    
  const nextMuted = track.enabled;
  track.enabled = !nextMuted;
  setMuted(nextMuted);
  };
  const toggleSpeakerMute = () => {
  if (!remoteAudioRef.current) return;

  remoteAudioRef.current.muted = !remoteAudioRef.current.muted;
  setSpeakerMuted(remoteAudioRef.current.muted);
};


  /* -------------------- LEAVE AUDIO -------------------- */
  const leaveAudio = () => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;

    if (remoteAudioRef.current) {
      remoteAudioRef.current.remove();
      remoteAudioRef.current = null;
    }

    setInCall(false);
    setMuted(false);
  };

  return {
    startAudio,
    toggleMute,
    leaveAudio,
    toggleSpeakerMute,    // speaker mute
    inCall,
    muted,
  };
};
