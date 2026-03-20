import React, { useEffect, useRef } from "react";
import { socket } from "../../lib/socket";
import { v4 as uuid } from "uuid";

const BASE_WIDTH = 3000;
const BASE_HEIGHT = 2000;

const Canvas = ({ toolRef, colorRef, sizeRef, reset, sessionId, isHost }) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const containerRef = useRef(null); // 👈 1. New Ref for the scrollable div
  const drawing = useRef(false);
  const currentStrokeRef = useRef(null);

   const handleScroll = (e) => {
    if (!isHost) return;

    const { scrollLeft, scrollTop } = e.currentTarget;
    socket.emit("whiteboard:viewport-sync", {
      sessionId,
      scrollLeft,
      scrollTop,
    });
  };

  /* ------------------ Canvas setup ------------------ */
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = BASE_WIDTH;
    canvas.height = BASE_HEIGHT;

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctxRef.current = ctx;
  }, []);

  /* ------------------ Reset ------------------ */
  useEffect(() => {
    if (!reset) return;

    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    drawing.current = false;
    canvas.width = BASE_WIDTH;
    canvas.height = BASE_HEIGHT;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (isHost && sessionId) {
      socket.emit("whiteboard:clear", { sessionId });
      socket.emit("whiteboard:resize", {
        sessionId,
        width: BASE_WIDTH,
        height: BASE_HEIGHT,
      });
    }
  }, [reset, isHost, sessionId]);

/* ------------------ REMOTE VIEWPORT SYNC ------------------ */
  useEffect(() => {
    if (isHost) return; // Only participants should follow

    const syncViewport = ({ scrollLeft, scrollTop }) => {
      if (containerRef.current) {
        containerRef.current.scrollTo({
          left: scrollLeft,
          top: scrollTop,
          behavior: "smooth", // 👈 Makes it feel natural
        });
      }
    };

    socket.on("whiteboard:viewport-sync", syncViewport);

    return () => {
      socket.off("whiteboard:viewport-sync", syncViewport);
    };
  }, [isHost, sessionId]);



  /* ------------------ Helpers ------------------ */
  
 

  const getCoords = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };




  const resizeCanvas = (newWidth, newHeight) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    canvas.width = newWidth;
    canvas.height = newHeight;
    ctx.putImageData(imageData, 0, 0);
  };

  const applyTool = (ctx, stroke) => {
    if (stroke.tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = stroke.size * 4;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
    }
  };

  /* ------------------ LOCAL DRAW (HOST ONLY) ------------------ */
  const startDraw = (e) => {
    if (!isHost) return;

    e.preventDefault();
    drawing.current = true;

    const { x, y } = getCoords(e);

    const stroke = {
      id: uuid(),
      tool: toolRef.current,
      color: colorRef.current,
      size: sizeRef.current,
      points: [{ x, y }],
    };

    currentStrokeRef.current = stroke;

    const ctx = ctxRef.current;
    applyTool(ctx, stroke);
    ctx.beginPath();
    ctx.moveTo(x, y);

    socket.emit("whiteboard:stroke:start", { sessionId, stroke });
  };

  const draw = (e) => {
    if (!drawing.current || !isHost) return;

    const { x, y } = getCoords(e);
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;

    ctx.lineTo(x, y);
    ctx.stroke();

    const margin = 80;
    let newWidth = canvas.width;
    let newHeight = canvas.height;
    let resized = false;

    if (x > canvas.width - margin) {
      newWidth += 500;
      resized = true;
    }
    if (y > canvas.height - margin) {
      newHeight += 500;
      resized = true;
    }

    if (resized) {
      resizeCanvas(newWidth, newHeight);
      socket.emit("whiteboard:resize", {
        sessionId,
        width: newWidth,
        height: newHeight,
      });
    }

    socket.emit("whiteboard:stroke:move", {
      sessionId,
      strokeId: currentStrokeRef.current.id,
      point: { x, y },
    });
  };

  const endDraw = () => {
    if (!isHost || !currentStrokeRef.current) return;

    drawing.current = false;
    ctxRef.current.closePath();

    socket.emit("whiteboard:stroke:end", {
      sessionId,
      strokeId: currentStrokeRef.current.id,
    });

    currentStrokeRef.current = null;
  };

  /* ------------------ REMOTE DRAW ------------------ */
/* ------------------ REMOTE DRAW ------------------ */
  useEffect(() => {
    const ctx = ctxRef.current;
    // This tracks the settings for active strokes from other users
    const activeStrokes = new Map();

    socket.emit("whiteboard:history-request", { sessionId });

    socket.on("whiteboard:history", ({ strokes }) => {
      strokes.forEach((stroke) => {
        applyTool(ctx, stroke);
        ctx.beginPath();
        if (stroke.points.length > 0) {
          ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
          for (let i = 1; i < stroke.points.length; i++) {
            ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
          }
          ctx.stroke();
        }
      });
      // Reset to default tool after history load
      ctx.globalCompositeOperation = "source-over"; 
    });

    socket.on("whiteboard:stroke:start", ({ stroke }) => {
      activeStrokes.set(stroke.id, stroke);
      // We don't draw yet, just store the initial state
    });

    socket.on("whiteboard:stroke:move", ({ strokeId, point }) => {
      const stroke = activeStrokes.get(strokeId);
      if (!stroke) return;

      // GET the last point to draw the line segment
      const lastPoint = stroke.points[stroke.points.length - 1];

      // IMPORTANT: Set context settings for THIS specific stroke right now
      applyTool(ctx, stroke);
      
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();

      // Save the new point to the stroke history
      stroke.points.push(point);
    });

    socket.on("whiteboard:stroke:end", ({ strokeId }) => {
      activeStrokes.delete(strokeId);
      // Reset context to default so it doesn't mess up other drawings
      ctx.globalCompositeOperation = "source-over";
    });

    socket.on("whiteboard:resize", ({ width, height }) => {
      resizeCanvas(width, height);
    });

    socket.on("whiteboard:clear", () => {
      const canvas = canvasRef.current;
      if (canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    return () => {
      socket.off("whiteboard:history");
      socket.off("whiteboard:stroke:start");
      socket.off("whiteboard:stroke:move");
      socket.off("whiteboard:stroke:end");
      socket.off("whiteboard:resize");
      socket.off("whiteboard:clear");
    };
  }, [sessionId]);
  /* ------------------ UI ------------------ */
  return (
    <div

      ref={containerRef}
      onScroll={handleScroll}
      style={{
        width: "65vw",
        height: "75vh",
        overflow: "auto",
        border: "1px solid #999",
        position:"relative",
      }}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={startDraw}
        onPointerMove={draw}
        onPointerUp={endDraw}
        onPointerLeave={endDraw}
        style={{
          touchAction: "none",
          border: "1px solid #ccc",
          display: "block",
        }}
      />
    </div>
  );
};

export default Canvas;
