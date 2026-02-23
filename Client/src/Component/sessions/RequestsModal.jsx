import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSessionStore } from "../../store/useSessionStore";

const RequestsModal = ({ onClose }) => {
  const { sessionId } = useParams();

  const {
    joinRequest = [],
    getJoinRequests,
    acceptJoinRequest,
    rejectJoinRequest,
    isJoinRequestLoading,
  } = useSessionStore();

  const [selected, setSelected] = useState(null);

  // Fetch join requests when modal opens
  useEffect(() => {
    if (sessionId) {
      getJoinRequests(sessionId);
    }
  }, [sessionId]);

  // Auto-select first request
  useEffect(() => {
    if (joinRequest.length > 0) {
      setSelected(joinRequest[0]);
    } else {
      setSelected(null);
    }
  }, [joinRequest]);

  const handleAccept = async () => {
    if (!selected) return;
    await acceptJoinRequest(selected.id);
  };

  const handleReject = async () => {
    if (!selected) return;
    await rejectJoinRequest(selected.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div
        className="
          bg-base-100 text-base-content
          w-[760px] max-w-[95vw]
          h-[460px]
          rounded-xl
          border border-base-300
          shadow-xl
          flex overflow-hidden
          relative
          animate-fade-in-up
        "
      >
        {/* LEFT: REQUEST LIST */}
        <aside className="w-1/3 border-r border-base-300 flex flex-col">
          <div className="px-4 py-3 text-sm font-medium border-b border-base-300">
            Join Requests
          </div>

          <div className="flex-1 overflow-y-auto">
            {isJoinRequestLoading ? (
              <p className="p-4 text-sm opacity-60">Loading...</p>
            ) : joinRequest.length === 0 ? (
              <p className="p-4 text-sm opacity-60">
                No pending requests
              </p>
            ) : (
              joinRequest.map((req) => (
                <button
                  key={req.id}
                  onClick={() => setSelected(req)}
                  className={`
                    w-full text-left px-4 py-3 text-sm transition
                    hover:bg-base-200
                    ${
                      selected?.id === req.id
                        ? "bg-base-200 font-medium"
                        : "opacity-80"
                    }
                  `}
                >
                  {req.User.name}
                </button>
              ))
            )}
          </div>
        </aside>

        {/* RIGHT: DETAILS */}
        <section className="flex-1 p-6 flex flex-col justify-between">
          {selected ? (
            <>
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">
                  {selected.User.name}
                </h2>

                <p className="text-sm opacity-60">
                  {selected.User.email}
                </p>

                <p className="mt-4 text-sm opacity-80">
                  This user wants to join your session.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={handleReject}
                  className="
                    btn btn-outline btn-error
                    text-error-content
                    btn-sm
                  "
                >
                  Reject
                </button>

                <button
                  onClick={handleAccept}
                  className="
                    btn btn-success
                    text-success-content
                    btn-sm
                  "
                >
                  Accept
                </button>
              </div>
            </>
          ) : (
            <p className="text-sm opacity-60">
              Select a request to view details
            </p>
          )}
        </section>

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="
            absolute top-4 right-4
            btn btn-ghost btn-sm
            opacity-60 hover:opacity-100
          "
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default RequestsModal;
