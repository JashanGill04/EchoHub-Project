import React from 'react'

const VoiceControls = ({
  inCall,
  muted,
  onJoin,
  onMute,
  onLeave,
  onSpeakerMute,
}) => {

  const handleMute=()=>{
    onMute();
    onSpeakerMute();
  }
  return (
     <div className="flex gap-3 items-center">
      {!inCall ? (
        <button className="btn btn-primary btn-sm" onClick={onJoin}>
          Join Audio
        </button>
      ) : (
        <>
          <button
            className="btn btn-outline btn-sm"
            onClick={handleMute}
          >
            {muted ? "Unmute" : "Mute"}
          </button>

          <button
            className="btn btn-error btn-sm"
            onClick={onLeave}
          >
            Leave Audio
          </button>
        </>
      )}
    </div>
  );
};
export default VoiceControls