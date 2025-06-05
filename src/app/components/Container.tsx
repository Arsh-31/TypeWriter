"use client";

import { useEffect, useState } from "react";
import { getRandomParagraph } from "../lib/paragraph";
import Confetti from "react-confetti";

export default function Container() {
  const [text, setText] = useState("");
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const [loading, setLoading] = useState(true);

  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [wpm, setWPM] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isFinished, setIsFinished] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Fetch a random paragraph on load
  // useEffect(() => {
  //   getRandomParagraph()
  //     .then((paragraph) => setText(paragraph))
  //     .catch((err) => console.error(err));
  // }, []);

  useEffect(() => {
    const loadParagraph = async () => {
      setLoading(true);
      try {
        const paragraph = await getRandomParagraph();
        setText(paragraph);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadParagraph();
  }, []);

  // Automatically focus when user starts typing
  useEffect(() => {
    const handleKeyDown = () => setIsFocused(true);
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Timer and live stat updates
  useEffect(() => {
    if (!startTime || isFinished) return;

    const interval = setInterval(() => {
      const seconds = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(seconds);

      const words = input.length / 5;
      const minutes = seconds / 60;
      const wpmCalc = minutes > 0 ? Math.floor(words / minutes) : 0;
      setWPM(wpmCalc);

      const correctChars = input
        .split("")
        .filter((char, i) => char === text[i]).length;
      const acc = input.length > 0 ? (correctChars / input.length) * 100 : 100;
      setAccuracy(Math.floor(acc));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, input, text, isFinished]);

  // Add to useEffect for keyboard events:
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        restartTest();
      }
      if (e.key === "Tab" && isFinished) {
        e.preventDefault();
        restartTest();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFinished]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isFinished) return;

    const char = e.key;

    if (!startTime) {
      setStartTime(Date.now());
    }

    if (char === "Backspace") {
      setInput((prev) => prev.slice(0, -1));
      return;
    }

    if (input.length >= text.length) return;

    if (char.length === 1) {
      const newInput = input + char;
      setInput(newInput);

      if (newInput.length === text.length) {
        setIsFinished(true);
        setShowStats(true);

        const endTime = Date.now();
        const seconds = Math.floor((endTime - startTime!) / 1000);
        setElapsedTime(seconds);

        const words = newInput.length / 5;
        const minutes = seconds / 60;
        const finalWPM = minutes > 0 ? Math.floor(words / minutes) : 0;
        setWPM(finalWPM);

        const correctChars = newInput
          .split("")
          .filter((char, i) => char === text[i]).length;
        const acc =
          newInput.length > 0 ? (correctChars / newInput.length) * 100 : 100;
        setAccuracy(Math.floor(acc));
      }
    }
  };

  // const restartTest = async () => {
  //   setText(await getRandomParagraph());
  //   setInput("");
  //   setStartTime(null);
  //   setElapsedTime(0);
  //   setWPM(0);
  //   setAccuracy(100);
  //   setIsFinished(false);
  //   setShowStats(false);
  // };

  const restartTest = async () => {
    setLoading(true);
    const newParagraph = await getRandomParagraph();
    setText(newParagraph);
    setInput("");
    setStartTime(null);
    setElapsedTime(0);
    setWPM(0);
    setAccuracy(100);
    setIsFinished(false);
    setShowStats(false);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="text-lg font-medium animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 relative">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 mb-2">
          Speed Typing Test
        </h1>
        <p className="text-gray-400">
          Type the paragraph as fast and accurately as you can
        </p>
      </header>

      {/* Stats Bar */}
      {showStats && (
        <div className="animate-fade-in-down mb-6 w-full max-w-2xl">
          <div className="bg-gray-800/80 backdrop-blur-md border border-gray-700 text-white px-6 py-4 rounded-xl shadow-2xl flex flex-wrap justify-between items-center gap-4">
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-400">WPM</span>
              <span className="text-2xl font-bold text-cyan-400">{wpm}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-400">Accuracy</span>
              <span className="text-2xl font-bold text-emerald-400">
                {accuracy}%
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-400">Time</span>
              <span className="text-2xl font-bold text-purple-400">
                {elapsedTime}s
              </span>
            </div>
            <button
              onClick={restartTest}
              className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 transition-all rounded-lg font-medium shadow-lg hover:shadow-cyan-500/20"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Typing Container */}
      <div
        className={`w-full max-w-3xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-8 rounded-2xl text-lg leading-relaxed tracking-wide relative transition-all duration-300 ${
          isFinished ? "opacity-50" : "opacity-100 shadow-xl shadow-cyan-500/10"
        }`}
        onClick={() => setIsFocused(true)}
      >
        {/* Character indicators */}
        <div className="flex flex-wrap gap-[2px] mb-2">
          {text.split("").map((char, idx) => {
            let className = "text-gray-500 transition-colors duration-100";

            if (idx < input.length) {
              className =
                char === input[idx]
                  ? "text-green-400"
                  : "text-red-400 bg-red-900/30";
            } else if (idx === input.length && !isFinished) {
              className = "text-gray-300 bg-gray-700/50";
            }

            return (
              <span
                key={idx}
                className={`${className} rounded px-[1px] ${
                  char === " " ? "min-w-[0.5rem]" : ""
                }`}
              >
                {char}
              </span>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden mt-4">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-300"
            style={{
              width: `${Math.min(100, (input.length / text.length) * 100)}%`,
            }}
          ></div>
        </div>

        {/* Hidden input */}
        {isFocused && !isFinished && (
          <input
            type="text"
            autoFocus
            onKeyDown={handleKeyPress}
            className="absolute opacity-0 w-full h-full top-0 left-0 cursor-default"
          />
        )}
      </div>
      {isFinished && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
        />
      )}
      {/* Footer */}
      <footer className="mt-8 text-center text-gray-500 text-sm">
        {!startTime && !isFinished ? (
          <p className="animate-pulse">Start typing to begin the test...</p>
        ) : (
          <p>
            Press <kbd className="px-2 py-1 bg-gray-700 rounded">Esc</kbd> to
            reset
          </p>
        )}
      </footer>
    </div>
  );
}
