import React from 'react'

const ParticipantsPanel = ({ host, participants }) => {
  const filteredParticipants = participants.filter(
  (p) => p.userId !== host.id
);

  return (
    <div className="border-b border-white/10 p-3">
      <p className="text-xs text-gray-400 mb-2">
        Participants ({filteredParticipants.length + 1})
      </p>

      <div className="space-y-2 text-sm">

        {/* Host */}
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-amber-400 text-black flex items-center justify-center text-xs font-bold">
            {host.name[0]}
          </div>
          <span>{host.name}</span>
          <span className="text-xs text-amber-400">(Host)</span>
        </div>

        {/* Participants */}
        {filteredParticipants.map((p) => (
          <div key={p.userId} className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-[#120a1a] border border-white/10 flex items-center justify-center text-xs">
              {p.User.name[0]}
            </div>
            <span>{p.User.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParticipantsPanel;
