/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Users,
  Copy,
  Check,
  Send,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Mail,
  FileText,
  Share2,
} from 'lucide-react';
import { Attendee, MatchResult } from '../types';

interface PostEventConnectProps {
  currentAttendee: Attendee;
  matches: MatchResult[];
  allAttendees: Attendee[];
  foundAttendeeIds: string[];
}

export const PostEventConnect: React.FC<PostEventConnectProps> = ({
  currentAttendee,
  matches,
  allAttendees,
  foundAttendeeIds,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [personalNotes, setPersonalNotes] = useState<Record<string, string>>({});
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNoteText, setTempNoteText] = useState('');

  // People you met: includes attendees marked found or matched
  const peopleMet = allAttendees.filter(
    (a) => foundAttendeeIds.includes(a.id) || matches.some((m) => m.matchedAttendee.id === a.id)
  );

  const handleCopyCard = (person: Attendee) => {
    const contactText = `Meetly Connection: ${person.name} (${person.title})\nTelegram: ${person.contact.telegram || person.contact.handle}\nEmail: ${person.contact.email || 'N/A'}\nCan help with: ${person.canHelpWith.join(', ')}`;
    navigator.clipboard?.writeText?.(contactText);
    setCopiedId(person.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSaveNote = (personId: string) => {
    setPersonalNotes((prev) => ({ ...prev, [personId]: tempNoteText }));
    setEditingNoteId(null);
    setTempNoteText('');
  };

  return (
    <div className="w-full space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-200/80 pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200/70 px-2.5 py-0.5 rounded-full font-display">
            Post-Event Roll
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
            People You Met
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Connections verified during the meetup with 1-tap follow-up notes
          </p>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-xs font-bold px-3 py-1.5 rounded-full font-display">
          <span>{foundAttendeeIds.length} Verified Met</span>
        </div>
      </div>

      {/* Roster of People Met: Responsive Grid for Desktop */}
      {peopleMet.length === 0 ? (
        <div className="w-full rounded-2xl border border-dashed border-stone-300 bg-white p-8 sm:p-12 text-center text-stone-500">
          <Users className="w-10 h-10 text-stone-400 mx-auto mb-3" />
          <h4 className="font-display text-base font-bold text-stone-800">No connections recorded yet</h4>
          <p className="text-xs sm:text-sm mt-1 max-w-sm mx-auto text-stone-600">
            Mark "Found them" in your Matches tab or scan badges during Bingo to populate your post-event connections.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {peopleMet.map((person) => {
            const matchInfo = matches.find((m) => m.matchedAttendee.id === person.id);
            const isFound = foundAttendeeIds.includes(person.id);
            const userNote = personalNotes[person.id];

            return (
              <div
                key={person.id}
                className="w-full rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={person.avatar}
                        alt={person.name}
                        className="w-12 h-12 rounded-xl object-cover border border-stone-200 shadow-xs"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-display text-sm font-bold text-stone-900">
                            {person.name}
                          </h3>
                          {isFound && (
                            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full">
                              Met ✓
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-medium text-stone-600 line-clamp-1">
                          {person.title}
                        </p>
                        <p className="text-[11px] text-stone-400">
                          {person.contact.handle} • {person.company || 'Builder'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopyCard(person)}
                      className="p-2 rounded-xl text-xs font-bold border border-stone-200 text-stone-600 hover:bg-stone-50 active:scale-95 transition flex items-center gap-1"
                      title="Copy full contact card"
                    >
                      {copiedId === person.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-[10px] text-emerald-700 font-semibold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-stone-500" />
                          <span className="text-[10px]">Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Reason line */}
                  {matchInfo && (
                    <div className="mt-3 p-3 rounded-xl bg-stone-50 border border-stone-200/70 text-xs text-stone-700">
                      <span className="text-[10px] uppercase font-bold text-amber-800 block mb-0.5 font-display">
                        Match Context:
                      </span>
                      <p className="leading-snug">{matchInfo.reason}</p>
                    </div>
                  )}

                  {/* Skill complementarity tags */}
                  <div className="mt-3 space-y-1.5">
                    <div className="text-[11px] text-stone-500 flex items-center gap-1">
                      <span className="font-semibold text-stone-700">Offers:</span>
                      <span>{person.canHelpWith.join(', ')}</span>
                    </div>
                    <div className="text-[11px] text-stone-500 flex items-center gap-1">
                      <span className="font-semibold text-stone-700">Seeking:</span>
                      <span>{person.lookingFor.join(', ')}</span>
                    </div>
                  </div>

                  {/* Personal follow-up note */}
                  <div className="mt-3 pt-3 border-t border-stone-100">
                    {editingNoteId === person.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={tempNoteText}
                          onChange={(e) => setTempNoteText(e.target.value)}
                          placeholder="Quick follow-up note (e.g. Discussed Solana RPC grants, meet next Tuesday)"
                          className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50 resize-none h-16"
                        />
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => setEditingNoteId(null)}
                            className="px-2.5 py-1 text-xs text-stone-500 hover:text-stone-700 font-medium"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveNote(person.id)}
                            className="px-3 py-1 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition font-display"
                          >
                            Save Note
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        {userNote ? (
                          <div className="text-xs text-stone-700 italic bg-amber-50/70 p-2 rounded-lg border border-amber-200/80 flex-1 mr-2">
                            "{userNote}"
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingNoteId(person.id);
                              setTempNoteText(userNote || '');
                            }}
                            className="text-[11px] font-semibold text-stone-500 hover:text-amber-800 flex items-center gap-1 font-display"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>+ Add Follow-up Note</span>
                          </button>
                        )}

                        {userNote && (
                          <button
                            onClick={() => {
                              setEditingNoteId(person.id);
                              setTempNoteText(userNote);
                            }}
                            className="text-[10px] text-amber-800 font-bold hover:underline font-display"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* 1-Tap Connect Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100">
                  <a
                    href={`https://t.me/${(person.contact.telegram || person.contact.handle || '').replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-amber-50/80 text-amber-900 border border-amber-200/80 font-bold hover:bg-amber-100/80 transition active:scale-95 text-xs font-display"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-700" />
                    <span>Telegram</span>
                  </a>

                  <a
                    href={`https://x.com/${(person.contact.twitter || person.contact.handle || '').replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-stone-100 text-stone-800 border border-stone-200 font-bold hover:bg-stone-200 transition active:scale-95 text-xs font-display"
                  >
                    <Share2 className="w-3.5 h-3.5 text-stone-600" />
                    <span>Twitter / X</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
