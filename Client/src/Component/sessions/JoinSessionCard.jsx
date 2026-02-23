import React from "react";
const JoinSessionCard = ({ onRequestJoin, isPending }) => {
  return (
    <div className="border border-white/10 rounded-xl p-4 bg-[#1b1026]">
      <p className="text-sm text-gray-300 mb-3">
        You are not part of this session.
      </p>

      <button
        onClick={onRequestJoin}
        disabled={isPending}
        className={`
          w-full py-2 rounded-lg text-sm font-medium
          ${
            isPending
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-amber-400 text-black hover:bg-amber-300"
          }
        `}
      >
        {isPending ? "Request Sent" : "Request to Join"}
      </button>
    </div>
  );
};

export default JoinSessionCard;
