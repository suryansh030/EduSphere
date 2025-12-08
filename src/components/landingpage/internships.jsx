import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTrendingInternships } from "../../mockData/internshipsMockData.js";

export default function Internships() {
  const navigate = useNavigate();
  const internships = getTrendingInternships();
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-white via-slate-50 to-blue-50 font-sans relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 -ml-32 -mb-32"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 mb-14">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
              <span className="text-sm font-bold text-blue-600 uppercase tracking-wider">Featured Internships</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Launch Your Career
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
              Discover verified internships from top companies. Gain real experience, build your portfolio, and kickstart your professional journey.
            </p>
          </div>
          <button
            onClick={() => navigate('/internships')}
            className="hidden md:inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 whitespace-nowrap transform hover:scale-105"
          >
            <span>Explore All</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {internships.map((item, index) => (
            <div
              key={item.id}
              className="opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <InternshipCard 
                data={item} 
                onApply={() => navigate('/internships')}
                isHovered={hoveredId === item.id}
              />
            </div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="md:hidden text-center">
          <button
            onClick={() => navigate('/internships')}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 w-full sm:w-auto transform hover:scale-105"
          >
            <span>View All Internships</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
}

function InternshipCard({ data, onApply, isHovered }) {
  const getCategoryColor = (category) => {
    const colors = {
      'Frontend': 'from-blue-600 to-cyan-600',
      'Backend': 'from-purple-600 to-pink-600',
      'Design': 'from-rose-600 to-orange-600',
      'Marketing': 'from-amber-600 to-yellow-600',
      'Data Science': 'from-emerald-600 to-teal-600',
      'Content': 'from-orange-600 to-red-600',
      'HR': 'from-indigo-600 to-purple-600',
      'Business Analysis': 'from-cyan-600 to-blue-600',
      'Mobile': 'from-pink-600 to-rose-600',
      'Video': 'from-red-600 to-orange-600',
    };
    return colors[category] || 'from-blue-600 to-indigo-600';
  };

  return (
    <div 
      onClick={onApply}
      className={`relative h-full rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col transform ${
        isHovered ? 'scale-102' : 'scale-100'
      }`}
    >
      {/* Gradient Background Banner */}
      <div className={`h-20 bg-gradient-to-br ${getCategoryColor(data.category)} relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-20 mix-blend-overlay">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
        </div>
        
        {/* Category Badge on Banner */}
        <div className="absolute top-2 right-2">
          <span className="inline-block bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-full text-[9px] font-bold text-gray-900 shadow-md">
            {data.category}
          </span>
        </div>

        {/* Logo */}
        <div className={`absolute bottom-0 left-2 w-14 h-14 rounded-lg flex items-center justify-center font-bold text-xl text-white bg-gradient-to-br ${getCategoryColor(data.category)} shadow-md border-2 border-white`}>
          {data.company.charAt(0)}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-4 bg-white">
        {/* Header with Badge */}
        <div className="flex items-start justify-between mb-2 pt-1">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
              {data.title}
            </h3>
            <p className="text-sm font-semibold text-gray-600 mt-0">{data.company}</p>
          </div>
          {data.badge && (
            <div className="ml-1">
              <span className="inline-block bg-gradient-to-r from-green-400 to-emerald-500 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-sm">
                {data.badge}
              </span>
            </div>
          )}
        </div>

        {/* Tagline */}
        <p className="text-xs text-gray-500 italic mb-3 line-clamp-1">{data.tagline}</p>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-2.5"></div>

        {/* Key Details with Enhanced Icons */}
        <div className="space-y-2 mb-3">
          {/* Location */}
          <div className="flex items-center gap-2 text-sm">
            <div className="w-6 h-6 rounded-md bg-red-50 flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
            </div>
            <span className="text-gray-600 font-medium">{data.location}</span>
          </div>

          {/* Stipend */}
          <div className="flex items-center gap-2 text-sm">
            <div className="w-6 h-6 rounded-md bg-green-50 flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-gray-600 font-bold">₹{data.stipendMin.toLocaleString()}-{data.stipendMax.toLocaleString()}</span>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-2 text-sm">
            <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-gray-600 font-medium">{data.durationText}</span>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {data.skills.slice(0, 2).map((skill) => (
              <span key={skill} className="px-2 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs font-bold rounded-md border border-blue-200">
                {skill}
              </span>
            ))}
            {data.skills.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-md">
                +{data.skills.length - 2}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-semibold text-gray-700">{data.applicants}</span>
        </div>
        <span className="text-xs text-gray-500 font-medium">{data.postedAgo}</span>
      </div>
    </div>
  );
}
