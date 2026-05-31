"use client";
import { useState, useRef, useEffect } from "react";

const RUNAWAY_PHRASE_INDEX = 11; // "You can't say no to me!"
const MOUSE_THRESHOLD = 120;
const MOVE_SPEED = 24;

export default function Page() {
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const [runawayPos, setRunawayPos] = useState({ x: 900, y: 500 });
  const yesButtonSize = noCount * 20 + 16;
  const runawayContainerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const runawayPosRef = useRef(runawayPos);

  runawayPosRef.current = runawayPos;
  const isRunawayMode = noCount >= RUNAWAY_PHRASE_INDEX;

  const handleNoClick = () => {
    if (!isRunawayMode) setNoCount(noCount + 1);
  };

  useEffect(() => {
    if (!isRunawayMode || !runawayContainerRef.current || !buttonRef.current)
      return;

    const container = runawayContainerRef.current;
    const button = buttonRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const containerRect = container.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      const pos = runawayPosRef.current;

      const mouseX = e.clientX - containerRect.left;
      const mouseY = e.clientY - containerRect.top;
      const buttonCenterX = pos.x + buttonRect.width / 2;
      const buttonCenterY = pos.y + buttonRect.height / 2;

      const dx = buttonCenterX - mouseX;
      const dy = buttonCenterY - mouseY;
      const distance = Math.hypot(dx, dy);

      if (distance < MOUSE_THRESHOLD && distance > 0) {
        const norm = distance;
        const moveX = (dx / norm) * MOVE_SPEED;
        const moveY = (dy / norm) * MOVE_SPEED;

        setRunawayPos((prev) => {
          const maxX = Math.max(0, containerRect.width - buttonRect.width);
          const maxY = Math.max(0, containerRect.height - buttonRect.height);
          return {
            x: Math.max(0, Math.min(maxX, prev.x + moveX)),
            y: Math.max(0, Math.min(maxY, prev.y + moveY)),
          };
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isRunawayMode]);

  const getNoButtonText = () => {
    const phrases = [
      "No",
      "Are you sure?",
      "Think again <3",
      "Pretty please?",
      "With a big bag of Protein?",
      "What about lots of kissies?",
      "PLEASE POOKIE",
      "Say yes to your babyyyy!!??",
      "I really like you :') ",
      ":((((",
      "Last chance to say yes!",
      "You can't say no to me!",
    ];

    return phrases[Math.min(noCount, phrases.length - 1)];
  };

  return (
    <div className="-mt-16 flex h-screen flex-col items-center justify-center">
      {yesPressed ? (
        <>
          <img src="https://media.tenor.com/gUiu1zyxfzYAAAAi/bear-kiss-bear-kisses.gif" />
          <div className="my-4 text-4xl font-bold">
            WOOOOOO!!! I love you my pookie bear!! ;))
          </div>
        </>
      ) : (
        <>
          <img
            className="h-[200px]"
            src="https://gifdb.com/images/high/cute-love-bear-roses-ou7zho5oosxnpo6k.gif"
          />
          <h1 className="my-4 text-4xl">Asif, Will You be my Boyfriend?</h1>
          <div className="flex items-center">
            <button
              className={`mr-4 rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700`}
              style={{ fontSize: yesButtonSize }}
              onClick={() => setYesPressed(true)}
            >
              Yes
            </button>
            <div
              ref={runawayContainerRef}
              className={
                isRunawayMode
                  ? "pointer-events-none fixed inset-0 z-10 flex items-center justify-center"
                  : "relative ml-4"
              }
            >
              <button
                ref={buttonRef}
                onClick={handleNoClick}
                className={
                  isRunawayMode
                    ? "pointer-events-auto rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
                    : "rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
                }
                style={
                  isRunawayMode
                    ? {
                        position: "absolute",
                        left: runawayPos.x,
                        top: runawayPos.y,
                        transition: "none",
                      }
                    : undefined
                }
              >
                {noCount === 0 ? "No" : getNoButtonText()}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
