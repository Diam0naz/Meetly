/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  QrCode,
  Trophy,
  Check,
  Sparkles,
  Camera,
  X,
  Award,
  PartyPopper,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Attendee, BingoCell, LeaderboardEntry } from '../types';

interface QRBingoGameProps {
  currentAttendee: Attendee;
  allAttendees: Attendee[];
  bingoBoard: BingoCell[];
  onCompleteSquare: (squareId: number, completedByAttendee: Attendee) => void;
  leaderboard: LeaderboardEntry[];
}

export const QRBingoGame: React.FC<QRBingoGameProps> = ({
  currentAttendee,
  allAttendees,
  bingoBoard,
  onCompleteSquare,
  leaderboard,
}) => {
  const [activeTab, setActiveTab] = useState<'board' | 'leaderboard'>('board');
  const [selectedCell, setSelectedCell] = useState<BingoCell | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [lastCompletedToast, setLastCompletedToast] = useState<string | null>(null);

  // Confetti celebration overlay state
  const [celebrationOverlay, setCelebrationOverlay] = useState<{
    type: 'line' | 'blackout';
    title: string;
    description: string;
    badge: string;
  } | null>(null);

  // Completed squares and line calculation
  const completedSquaresCount = bingoBoard.filter((c) => c.completed).length;

  const calculateCompletedLines = (): number => {
    let lines = 0;
    // Rows
    for (let r = 0; r < 5; r++) {
      let full = true;
      for (let c = 0; c < 5; c++) {
        if (!bingoBoard[r * 5 + c]?.completed) full = false;
      }
      if (full) lines++;
    }
    // Cols
    for (let c = 0; c < 5; c++) {
      let full = true;
      for (let r = 0; r < 5; r++) {
        if (!bingoBoard[r * 5 + c]?.completed) full = false;
      }
      if (full) lines++;
    }
    // Diagonals
    if (
      bingoBoard[0]?.completed &&
      bingoBoard[6]?.completed &&
      bingoBoard[12]?.completed &&
      bingoBoard[18]?.completed &&
      bingoBoard[24]?.completed
    ) {
      lines++;
    }
    if (
      bingoBoard[4]?.completed &&
      bingoBoard[8]?.completed &&
      bingoBoard[12]?.completed &&
      bingoBoard[16]?.completed &&
      bingoBoard[20]?.completed
    ) {
      lines++;
    }
    return lines;
  };

  const linesCount = calculateCompletedLines();

  // Track previous counts to detect fresh completions
  const isFirstMount = useRef(true);
  const prevLinesCount = useRef(linesCount);
  const prevSquaresCount = useRef(completedSquaresCount);

  // Fire confetti bursts with warm gold/amber theme
  const fireConfetti = (isBlackout = false) => {
    if (isBlackout) {
      // Grand celebration
      const duration = 2.5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
        const particleCount = 45 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: 0.15 + Math.random() * 0.7, y: Math.random() - 0.2 },
          colors: ['#f59e0b', '#d97706', '#ea580c', '#fbbf24', '#ffffff', '#10b981'],
        });
      }, 250);
    } else {
      // Line completion burst
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#f59e0b', '#d97706', '#ea580c', '#fbbf24', '#10b981'],
        zIndex: 9999,
      });
    }
  };

  // Detect newly completed line or blackout
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      prevLinesCount.current = linesCount;
      prevSquaresCount.current = completedSquaresCount;
      return;
    }

    // Check blackout (all 25 completed)
    if (completedSquaresCount === 25 && prevSquaresCount.current < 25) {
      fireConfetti(true);
      setCelebrationOverlay({
        type: 'blackout',
        title: '🏆 BLACKOUT BINGO CHAMPION!',
        description: 'Incredible! You verified all 25 networking prompts across the room.',
        badge: 'Blackout Master',
      });
    } else if (linesCount > prevLinesCount.current) {
      fireConfetti(false);
      setCelebrationOverlay({
        type: 'line',
        title: '🎯 BINGO! Line Completed!',
        description: `You connected 5 in a row (${linesCount} line${linesCount > 1 ? 's' : ''} total)! Bonus points added to leaderboard.`,
        badge: `${linesCount} Line Complete`,
      });
    }

    prevLinesCount.current = linesCount;
    prevSquaresCount.current = completedSquaresCount;
  }, [linesCount, completedSquaresCount]);

  const handleSimulateScan = (attendee: Attendee) => {
    let targetSquareId = selectedCell && !selectedCell.completed ? selectedCell.id : null;

    if (!targetSquareId) {
      const traitMatches = bingoBoard.filter(
        (c) => !c.completed && attendee.bingoTraits.includes(c.id)
      );

      if (traitMatches.length > 0) {
        targetSquareId = traitMatches[0].id;
      } else {
        const uncompleted = bingoBoard.filter((c) => !c.completed);
        if (uncompleted.length > 0) {
          targetSquareId = uncompleted[0].id;
        }
      }
    }

    if (targetSquareId) {
      onCompleteSquare(targetSquareId, attendee);
      setLastCompletedToast(`Stamped square #${targetSquareId} with ${attendee.name}!`);
      setIsScannerOpen(false);
      setSelectedCell(null);
    }
  };

  const handleQuickCompleteRowDemo = () => {
    const rowSquares = [1, 2, 3, 4, 5];
    const candidateAttendees = allAttendees.filter((a) => a.id !== currentAttendee.id);

    rowSquares.forEach((sqId, idx) => {
      const cell = bingoBoard.find((c) => c.id === sqId);
      if (cell && !cell.completed) {
        const att = candidateAttendees[idx % candidateAttendees.length];
        onCompleteSquare(sqId, att);
      }
    });
    setLastCompletedToast('Fast-stamped horizontal row to trigger Bingo!');
  };

  return (
    <div className="w-full space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {lastCompletedToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[90%] rounded-2xl bg-stone-900 text-white p-3 shadow-xl border border-amber-500/50 flex items-center justify-between text-xs font-semibold animate-in slide-in-from-top-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{lastCompletedToast}</span>
          </div>
          <button
            onClick={() => setLastCompletedToast(null)}
            className="text-stone-400 hover:text-white ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Confetti Celebration Overlay Modal */}
      {celebrationOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-stone-900 via-stone-850 to-[#271e16] p-6 text-white text-center shadow-2xl border border-amber-400/80 animate-in zoom-in-95 relative overflow-hidden">
            <div className="relative">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-stone-950 flex items-center justify-center shadow-lg shadow-amber-400/20 mb-3 animate-bounce">
                <PartyPopper className="w-8 h-8 stroke-[2.2]" />
              </div>

              <span className="inline-block px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 font-extrabold text-[11px] tracking-wider uppercase border border-amber-400/40 mb-2 font-display">
                {celebrationOverlay.badge}
              </span>

              <h3 className="text-xl font-black tracking-tight text-white leading-tight font-display">
                {celebrationOverlay.title}
              </h3>

              <p className="mt-2 text-xs text-stone-300 leading-relaxed max-w-xs mx-auto">
                {celebrationOverlay.description}
              </p>

              <div className="mt-6 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => fireConfetti(celebrationOverlay.type === 'blackout')}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-2.5 text-xs font-bold text-white shadow-sm hover:from-amber-600 hover:to-amber-700 active:scale-95 transition font-display"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Blast More Confetti!</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCelebrationOverlay(null)}
                  className="w-full rounded-xl bg-white/10 hover:bg-white/20 py-2.5 text-xs font-semibold text-white transition active:scale-95"
                >
                  Continue Playing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Screen Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-200/80 pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200/70 px-2.5 py-0.5 rounded-full font-display">
            Interactive Game
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
            5×5 Networking Bingo
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Scan attendee badges to verify prompts, stamp your grid, and climb the leaderboard
          </p>
        </div>

        <button
          onClick={() => setIsScannerOpen(true)}
          className="self-start sm:self-auto flex items-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 px-4 py-2.5 text-xs font-bold text-white shadow-xs active:scale-95 transition font-display"
        >
          <Camera className="w-4 h-4" />
          <span>Scan Badge QR</span>
        </button>
      </div>

      {/* Mode Tabs on mobile/tablet */}
      <div className="flex rounded-xl bg-stone-200/70 p-1 text-xs font-bold font-display lg:hidden">
        <button
          onClick={() => setActiveTab('board')}
          className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
            activeTab === 'board'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>My Bingo Card ({completedSquaresCount}/25)</span>
        </button>

        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
            activeTab === 'leaderboard'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-600" />
          <span>Leaderboard</span>
        </button>
      </div>

      {/* Desktop side-by-side Grid: Board on left (8 cols), Leaderboard on right (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* BINGO BOARD CONTAINER */}
        <div
          className={`space-y-4 lg:col-span-7 ${
            activeTab === 'board' ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Progress Banner */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-stone-200/90 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 font-extrabold text-sm flex items-center justify-center shadow-xs font-display">
                {linesCount}
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-stone-900 flex items-center gap-1 font-display">
                  <span>
                    {linesCount === 1
                      ? '1 Completed Line! 🎯'
                      : linesCount > 1
                      ? `${linesCount} Lines Completed! 🚀`
                      : 'Connect 5 in a row'}
                  </span>
                </div>
                <div className="text-xs text-stone-500">
                  {completedSquaresCount} of 25 squares stamped
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fireConfetti(linesCount >= 5)}
                className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 transition active:scale-95 border border-amber-200"
                title="Trigger Confetti Burst"
              >
                <PartyPopper className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsScannerOpen(true)}
                className="text-xs font-bold text-amber-900 hover:text-stone-950 bg-amber-100/70 hover:bg-amber-200/70 border border-amber-300 px-3 py-2 rounded-xl transition font-display"
              >
                + Stamp
              </button>
            </div>
          </div>

          {/* Quick Demo Line Trigger */}
          {linesCount === 0 && (
            <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950">
              <span className="font-medium">Want to test line completion?</span>
              <button
                onClick={handleQuickCompleteRowDemo}
                className="font-bold text-amber-900 bg-white border border-amber-300 px-2.5 py-1 rounded-lg shadow-xs hover:bg-amber-100 transition active:scale-95 font-display text-[11px]"
              >
                Auto-complete 1 Line ⚡
              </button>
            </div>
          )}

          {/* 5x5 Grid: Responsive, clean dark stone surface with warm contrast */}
          <div className="rounded-2xl border border-stone-800 bg-stone-900 p-3 sm:p-4 shadow-sm">
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {bingoBoard.map((cell) => {
                const isCenter = cell.isFreeSpace;
                return (
                  <button
                    key={cell.id}
                    onClick={() => setSelectedCell(cell)}
                    className={`aspect-square rounded-xl p-1 sm:p-1.5 flex flex-col items-center justify-center text-center transition-all relative overflow-hidden select-none active:scale-95 ${
                      cell.completed
                        ? isCenter
                          ? 'bg-amber-500 text-stone-950 font-extrabold ring-2 ring-amber-400'
                          : 'bg-emerald-600 text-white font-bold'
                        : 'bg-stone-800/90 hover:bg-stone-750 text-stone-300 border border-stone-700/50'
                    }`}
                  >
                    {cell.completed ? (
                      <div className="flex flex-col items-center justify-center h-full w-full">
                        <div className="w-4 h-4 rounded-full bg-white/25 flex items-center justify-center mb-0.5">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className="text-[9px] sm:text-[10px] leading-tight font-extrabold line-clamp-2 px-0.5 font-display">
                          {isCenter ? 'FREE' : cell.completedAttendeeName?.split(' ')[0] || 'Done'}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[9px] sm:text-[10px] font-medium leading-[1.15] line-clamp-3 text-stone-200">
                        {cell.prompt}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-xs text-center text-stone-500 font-medium">
            Tap any cell to inspect or scan someone’s badge QR code to mark it.
          </p>
        </div>

        {/* LIVE LEADERBOARD CONTAINER */}
        <div
          className={`space-y-4 lg:col-span-5 ${
            activeTab === 'leaderboard' ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="rounded-2xl border border-stone-200/90 bg-white p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 font-display">
                Live Standings
              </span>
              <span className="text-xs font-bold text-amber-700 flex items-center gap-1 font-display">
                <Trophy className="w-3.5 h-3.5 text-amber-600" />
                <span>Prizes at Minute 80</span>
              </span>
            </div>

            <div className="mt-3 space-y-2">
              {leaderboard.map((entry, index) => {
                const isCurrentUser = entry.attendeeId === currentAttendee.id;
                return (
                  <div
                    key={entry.attendeeId}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition ${
                      isCurrentUser
                        ? 'border-amber-400 bg-amber-50/70 shadow-xs'
                        : 'border-stone-100 bg-stone-50/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 font-mono ${
                          index === 0
                            ? 'bg-amber-500 text-stone-950 shadow-xs'
                            : index === 1
                            ? 'bg-stone-300 text-stone-800'
                            : index === 2
                            ? 'bg-amber-800 text-white'
                            : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        {index + 1}
                      </div>

                      <img
                        src={entry.avatar}
                        alt={entry.name}
                        className="w-8 h-8 rounded-xl object-cover border border-stone-200 shrink-0"
                      />

                      <div className="min-w-0 truncate">
                        <div className="text-xs font-bold text-stone-900 flex items-center gap-1 truncate font-display">
                          <span className="truncate">{entry.name}</span>
                          {isCurrentUser && (
                            <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-1.5 py-0.2 rounded-full shrink-0">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-stone-500 truncate">
                          {entry.squaresCompleted} squares • {entry.linesCompleted} lines
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 pl-2">
                      <span className="text-xs font-bold text-stone-900 font-mono">
                        {entry.squaresCompleted * 10 + entry.linesCompleted * 50} pts
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Cell Detail Modal */}
      {selectedCell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 font-display">
                Bingo Prompt #{selectedCell.id}
              </span>
              <button
                onClick={() => setSelectedCell(null)}
                className="p-1 rounded-full text-stone-400 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4">
              <h3 className="font-display text-lg font-bold text-stone-900 leading-snug">
                "{selectedCell.prompt}"
              </h3>

              {selectedCell.completed ? (
                <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Check className="w-4 h-4 text-emerald-700 stroke-[3]" />
                    <span>Stamped & Completed!</span>
                  </div>
                  <p className="mt-1 text-emerald-900">
                    Verified with: <strong>{selectedCell.completedAttendeeName}</strong>
                  </p>
                </div>
              ) : (
                <p className="mt-2 text-xs text-stone-600">
                  Find someone at the event who matches this criteria and scan their badge QR code to mark this square.
                </p>
              )}
            </div>

            <div className="mt-6 flex items-center gap-2">
              {!selectedCell.completed && (
                <button
                  onClick={() => {
                    setSelectedCell(null);
                    setIsScannerOpen(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 py-2.5 text-xs font-bold text-white shadow-xs active:scale-95 transition font-display"
                >
                  <Camera className="w-4 h-4" />
                  <span>Scan to Fill Square</span>
                </button>
              )}
              <button
                onClick={() => setSelectedCell(null)}
                className="flex-1 rounded-xl bg-stone-100 hover:bg-stone-200 py-2.5 text-xs font-bold text-stone-700 active:scale-95 transition font-display"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Scanner / Simulation Modal */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-stone-900">
                    Badge QR Scanner
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Simulate scanning an attendee badge
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsScannerOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mock Camera Viewfinder */}
            <div className="mt-4 relative aspect-[4/3] rounded-2xl bg-stone-950 overflow-hidden flex flex-col items-center justify-center border-2 border-amber-500">
              <div className="w-40 h-40 border-2 border-dashed border-amber-400 rounded-2xl flex items-center justify-center relative">
                <div className="w-full h-0.5 bg-amber-400/80 animate-bounce" />
                <span className="absolute bottom-2 text-[10px] text-amber-300 font-mono font-bold tracking-wider uppercase">
                  Point at Attendee QR
                </span>
              </div>
            </div>

            {/* Quick Simulate Picker */}
            <div className="mt-4 space-y-2">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider font-display">
                Select Attendee to Scan:
              </label>

              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                {allAttendees
                  .filter((a) => a.id !== currentAttendee.id)
                  .map((attendee) => (
                    <button
                      key={attendee.id}
                      type="button"
                      onClick={() => handleSimulateScan(attendee)}
                      className="w-full p-2 rounded-xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/50 flex items-center justify-between text-left transition text-xs group"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <img
                          src={attendee.avatar}
                          alt={attendee.name}
                          className="w-7 h-7 rounded-lg object-cover"
                        />
                        <div className="truncate">
                          <div className="font-bold text-stone-900 group-hover:text-amber-800 font-display">
                            {attendee.name}
                          </div>
                          <div className="text-[10px] text-stone-500 truncate">
                            {attendee.title}
                          </div>
                        </div>
                      </div>

                      <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-1 rounded-lg group-hover:bg-amber-600 group-hover:text-white transition font-display">
                        Scan
                      </span>
                    </button>
                  ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setIsScannerOpen(false)}
                className="w-full rounded-xl bg-stone-100 py-2.5 text-xs font-bold text-stone-700 hover:bg-stone-200 transition font-display"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
