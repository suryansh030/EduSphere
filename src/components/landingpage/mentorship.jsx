import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MENTORS_MOCK_DATA } from '../../mockData/mentorsMockData';

// Currency formatter
const formatCurrency = (price) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumSignificantDigits: 3,
  }).format(price);

export default function Mentorship() {
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);

  const visibleMentors = showAll ? MENTORS_MOCK_DATA : MENTORS_MOCK_DATA.slice(0, 4);

  return (
    <div className="py-16 bg-[#f6f8fb] font-sans text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full 
            bg-blue-100/50 backdrop-blur-md text-blue-700 shadow-sm border border-white/50">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            Mentorship Program
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Learn from Industry Experts
          </h2>

          <p className="text-xl text-slate-600 max-w-3xl leading-relaxed">
            Book 1:1 sessions with professionals from top companies.
          </p>
        </div>

        {/* MENTOR GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {visibleMentors.map((mentor) => (
            <MentorCard
              key={mentor.id}
              mentor={mentor}
              onClick={() => setSelectedMentor(mentor)}
              onBook={() => navigate('/mentors')}
            />
          ))}
        </div>

        {/* VIEW ALL BTN */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/mentors')}
            className="px-8 py-3 text-base font-semibold text-blue-700 
              bg-white/70 backdrop-blur-md border border-blue-200 
              rounded-full hover:bg-blue-50/70 transition-all shadow-md">
            View All Mentors
          </button>
        </div>
      </div>

      {/* MODAL */}
      {selectedMentor && (
        <MentorProfileModal
          mentor={selectedMentor}
          onClose={() => setSelectedMentor(null)}
          onBook={() => navigate('/mentors')}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// CARD (iOS GLASS STYLE)
// ---------------------------------------------------------------------------

function MentorCard({ mentor, onClick, onBook }) {
  return (
    <div
      onClick={onClick}
      className="
        group relative bg-white/40 backdrop-blur-xl rounded-3xl
        border border-white/60
        shadow-[0_8px_30px_rgba(0,0,0,0.08)]
        hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]
        transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full
      "
    >
      <div className="p-6 flex flex-col h-full">

        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-4">
            <div className="relative">
              <img
                src={mentor.image}
                alt={mentor.name}
                className="w-14 h-14 rounded-full object-cover 
                  shadow-md border border-white/70 backdrop-blur-md"
              />
              {mentor.verified && (
                <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5 border-2 border-white shadow-md">
                  <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"/>
                  </svg>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition">
                {mentor.name}
              </h3>
              <p className="text-sm text-slate-600 font-medium">{mentor.title}</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            {mentor.superMentor && (
              <span className="px-2 py-1 rounded text-[10px] font-bold 
                bg-amber-100/70 backdrop-blur-md border border-white/40 text-amber-700 uppercase tracking-wide">
                Super Mentor
              </span>
            )}
            <div className="flex items-center gap-1 text-slate-700 font-bold text-sm">
              {mentor.rating}
              ⭐
            </div>
          </div>
        </div>

        <span className="inline-block px-3 py-1 rounded-md bg-white/40 backdrop-blur-md 
          border border-white/60 text-slate-700 text-xs">
          {mentor.company}
        </span>

        <div className="flex flex-wrap gap-2 my-6">
          {mentor.skills.slice(0, 3).map((s) => (
            <span
              key={s}
              className="text-sm px-3 py-1 rounded-full 
                bg-white/50 border border-white/70 backdrop-blur-sm text-slate-700 shadow-sm"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/60">
          <div>
            <span className="block text-xs text-slate-500">Starting at</span>
            <span className="text-lg font-bold text-slate-900">
              {formatCurrency(mentor.pricePerSession)}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onBook();
            }}
            className="px-6 py-2.5 bg-blue-600/90 backdrop-blur-md 
              text-white text-sm font-bold rounded-xl 
              shadow-md hover:bg-blue-700/90 active:scale-[0.97] transition-all"
          >
            Book Session
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MODAL — iOS FROSTED GLASS
// ---------------------------------------------------------------------------

function MentorProfileModal({ mentor, onClose, onBook }) {
  const [tab, setTab] = useState("about");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="
        bg-white/30 backdrop-blur-2xl border border-white/40 
        rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.2)]
        w-full max-w-4xl relative z-10 flex flex-col md:flex-row
        max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200
      ">

        {/* LEFT PANEL */}
        <div className="flex-1 overflow-y-auto p-8">

          <div className="flex items-start gap-6 mb-8">
            <img
              src={mentor.image}
              className="w-24 h-24 rounded-2xl shadow-md border border-white/60 backdrop-blur"
            />

            <div className="flex-1 pt-1">
              <h2 className="text-2xl font-bold">{mentor.name}</h2>
              <p className="text-lg text-slate-700">
                {mentor.title} at <span className="font-semibold">{mentor.company}</span>
              </p>
            </div>

            <button onClick={onClose} className="text-slate-600 hover:text-slate-800">
              ✕
            </button>
          </div>

          {/* TABS */}
          <div className="border-b border-white/50 mb-6 flex gap-8">
            {['about', 'reviews'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`pb-3 text-base font-semibold capitalize border-b-2 transition 
                  ${tab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600'}
                `}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "about" ? (
            <div className="space-y-8">

              <div>
                <h4 className="text-sm font-bold text-slate-500 uppercase mb-4">About</h4>
                <p className="text-slate-700 leading-7 text-base">{mentor.bio}</p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-500 uppercase mb-4">Expertise</h4>
                <div className="flex flex-wrap gap-2">
                  {mentor.skills.map((s) => (
                    <span
                      key={s}
                      className="px-4 py-2 rounded-full bg-white/40 backdrop-blur-md 
                        border border-white/70 text-slate-700 text-sm shadow-sm"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="py-12 text-center text-slate-600 bg-white/40 backdrop-blur-md rounded-xl border border-white/60">
              Reviews coming soon…
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="
          w-full md:w-80 bg-white/40 backdrop-blur-xl border-l border-white/50
          p-8 flex flex-col
        ">
          <div className="bg-white/50 backdrop-blur-md p-6 rounded-xl border border-white shadow-sm mb-6">
            <div className="text-slate-600 text-sm">Session Price</div>
            <div className="text-3xl font-bold text-slate-900">
              {formatCurrency(mentor.pricePerSession)}
            </div>
          </div>

          <p className="text-sm text-slate-700 mb-4">
            Proceed to mentors page to check availability & book.
          </p>

          <button
            onClick={onBook}
            className="w-full py-4 bg-blue-600/90 backdrop-blur-xl text-white font-bold rounded-xl shadow-md hover:bg-blue-700/90 active:scale-95 transition">
            Go to Booking Page
          </button>
        </div>

      </div>
    </div>
  );
}
