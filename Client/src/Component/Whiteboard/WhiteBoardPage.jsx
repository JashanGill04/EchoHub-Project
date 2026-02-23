import { useRef, useState } from "react";
import Canvas from "./Canvas";

const WhiteBoard = ({ sessionId, isHost }) => {
  const toolRef = useRef("pen");
  const colorRef = useRef("#000000");
  const sizeRef = useRef(2);

  const [reset, setReset] = useState(0);
  const [activeTool, setActiveTool] = useState("pen");

  const selectTool = (tool) => {
    if (!isHost) return;
    toolRef.current = tool;
    setActiveTool(tool);
  };

  return (
    <div className="flex flex-col gap-4">

      {/* TOOLBAR */}
      <div
        className={`
          flex items-center gap-4
          px-5 py-3 rounded-xl
          bg-gradient-to-r from-[#1b1026] to-[#241430]
          border border-white/10
          shadow-lg shadow-black/40
          backdrop-blur-md
          ${!isHost ? "opacity-70 pointer-events-none" : ""}
        `}
      >
        {/* Pen / Eraser */}
        <div className="flex gap-2">
          <button
            onClick={() => selectTool("pen")}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
              transition-all duration-200
              ${
                activeTool === "pen"
                  ? "bg-amber-400 text-black shadow-md shadow-amber-500/30"
                  : "bg-white/5 text-gray-200 hover:bg-white/10"
              }
            `}
          >
            ✏️ <span>Pen</span>
          </button>

          <button
            onClick={() => selectTool("eraser")}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
              transition-all duration-200
              ${
                activeTool === "eraser"
                  ? "bg-amber-400 text-black shadow-md shadow-amber-500/30"
                  : "bg-white/5 text-gray-200 hover:bg-white/10"
              }
            `}
          >
            🧽 <span>Eraser</span>
          </button>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-white/10" />

        {/* Color Picker */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-300">Color</span>
          <input
            type="color"
            disabled={!isHost}
            onChange={(e) => (colorRef.current = e.target.value)}
            className="
              w-9 h-9 rounded-md cursor-pointer
              bg-transparent border border-white/20
            "
          />
        </div>

        {/* Size Slider */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-300">Size</span>
          <input
            type="range"
            min="1"
            max="10"
            defaultValue="2"
            disabled={!isHost}
            onChange={(e) => (sizeRef.current = Number(e.target.value))}
            className="accent-amber-400 cursor-pointer"
          />
        </div>

        {/* Reset */}
        <button
          onClick={() => isHost && setReset((c) => c + 1)}
          disabled={!isHost}
          className="
            ml-auto flex items-center gap-2
            px-4 py-2 rounded-lg
            bg-red-500/90 text-white text-sm font-medium
            hover:bg-red-500
            transition shadow-md shadow-red-500/30
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          🔄 Reset
        </button>
      </div>

      {/* VIEW-ONLY NOTICE */}
      {!isHost && (
        <p className="text-xs text-center text-gray-400">
          View-only mode · Only host can draw
        </p>
      )}

      {/* CANVAS */}
      <Canvas
        toolRef={toolRef}
        colorRef={colorRef}
        sizeRef={sizeRef}
        reset={reset}
        sessionId={sessionId}
        isHost={isHost}
      />
    </div>
  );
};

export default WhiteBoard;
