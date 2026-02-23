import React from "react";

const WaitingArea = ({ onCancel }) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        className="
          card bg-base-100
          border border-base-300
          shadow-xl
          rounded-xl
          p-8
          max-w-md w-full
          animate-fade-in-up
          transition-all duration-300
        "
      >
        <div className="flex flex-col items-center text-center gap-5">

          {/* Animated Loader */}
          <div className="relative">
            <span className="loading loading-ring loading-lg text-primary"></span>
          </div>

          {/* Title */}
          <h2 className="text-xl font-semibold tracking-tight">
            Waiting for Approval
          </h2>

          {/* Description */}
          <p className="text-sm opacity-70 leading-relaxed max-w-sm">
            Your request to join this session has been sent to the host.
            You’ll be automatically allowed in once approved.
          </p>

          {/* Divider */}
          <div className="w-full border-t border-base-300" />

          {/* Optional Cancel */}
          {onCancel && (
            <button
              onClick={onCancel}
              className="
                btn btn-outline btn-error
                text-error-content
                btn-sm
                transition-all
                hover:scale-105 active:scale-95
              "
            >
              Cancel Request
            </button>
          )}

          {/* Hint */}
          <p className="text-xs opacity-50">
            Please keep this page open
          </p>
        </div>
      </div>
    </div>
  );
};

export default WaitingArea;
