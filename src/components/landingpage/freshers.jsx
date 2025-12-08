import React from "react";
import { useNavigate } from "react-router-dom";

export default function Freshers() {
  const navigate = useNavigate();

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 bg-white font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Hiring Fresh Talent?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Post internships, connect with verified freshers, and build your team with EduSphere.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1: Post Internships */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-md transition-shadow duration-300">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center mb-5">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Post Internship Openings</h3>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Reach thousands of verified freshers and interns from top colleges instantly.
            </p>
            <button 
              onClick={() => navigate('/companysignup')}
              className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg transition-colors duration-200"
            >
              Get Started
            </button>
          </div>

          {/* Column 2: College Partnerships */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-md transition-shadow duration-300">
            <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center mb-5">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C6.248 6.253 2.25 10.248 2.25 16.252v.953m9.75-13v13m0-13C17.752 6.253 21.75 10.248 21.75 16.252v.953M18 16.478v.953m0 0a5.001 5.001 0 01-5 4.999m5-4.999a5 5 0 00-5 5v.953M9 20.458a5 5 0 01-5-5v-.953" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Partner with Colleges</h3>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Build partnerships with top institutions and access a consistent talent pipeline.
            </p>
            <button 
              onClick={() => navigate('/companysignup')}
              className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg transition-colors duration-200"
            >
              Partner Now
            </button>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-6 text-base">Ready to start hiring?</p>
          <button
            onClick={() => navigate('/companysignup')}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Sign Up as Company
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
