import React from "react";
import { useNavigate } from "react-router-dom";

export default function JoinCollege() {
  const navigate = useNavigate();

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-20 sm:py-28 bg-white font-sans relative overflow-hidden">
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-white pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-20">
          <span className="inline-block text-sm font-bold text-blue-600 uppercase tracking-wider mb-4">
            For Institutions
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Bring Your College to EduSphere
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Connect with top companies, streamline internships, and ensure NEP-compliant student tracking
          </p>
        </div>

        {/* Features Grid - 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {/* Card 1 */}
          <div className="group">
            <div className="bg-white/30 backdrop-blur-xl rounded-xl p-6 border border-white/40 hover:border-blue-300/60 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <svg className="w-6 h-6 text-blue-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Company Partnerships
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Connect with 500+ industry partners and bring verified internship opportunities directly to your students.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group">
            <div className="bg-white/30 backdrop-blur-xl rounded-xl p-6 border border-white/40 hover:border-green-300/60 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:text-white transition-all">
                <svg className="w-6 h-6 text-green-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Digital Logbooks
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Automate NEP-compliant logbooks, assessments, and streamline evaluation workflows effortlessly.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group">
            <div className="bg-white/30 backdrop-blur-xl rounded-xl p-6 border border-white/40 hover:border-purple-300/60 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-all">
                <svg className="w-6 h-6 text-purple-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Monitoring Dashboard
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Assign mentors, track progress in real-time, verify tasks, and approve credits instantly.
              </p>
            </div>
          </div>
        </div>

        {/* Why Partner Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20 bg-white/25 backdrop-blur-2xl rounded-3xl p-12 md:p-16 relative overflow-hidden border border-white/40 shadow-2xl">
          {/* Subtle glass effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl pointer-events-none"></div>
          
          <div className="relative z-10">
            <h3 className="text-3xl font-bold text-gray-900 mb-8">Why Partner With EduSphere?</h3>
            <ul className="space-y-5">
              {[
                "Access to verified jobs and internships",
                "NEP compliance made simple",
                "Real-time student progress tracking",
                "Dedicated support & onboarding",
                "Better placement outcomes"
              ].map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-lg font-medium">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="hidden md:flex items-center justify-center relative z-10">
            <div className="relative w-64 h-64">
              {/* Glass effect container */}
              <div className="absolute inset-0 bg-white/40 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl bg-blue-300/40 backdrop-blur-lg border border-blue-200/50 flex items-center justify-center shadow-lg mx-auto mb-4">
                    <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <p className="text-gray-700 text-sm font-semibold">Smart Management</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-2">Ready to Get Started?</h3>
          <p className="text-gray-600 mb-10 text-lg">Register your institution in minutes and join the EduSphere network</p>
          
          <button
            onClick={() => navigate('/adminsignup')}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-105"
          >
            <span>Register Your College</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          <p className="mt-8 text-gray-600">
            Questions? <span className="font-semibold text-gray-900">Contact our team</span>
          </p>
        </div>
      </div>
    </section>
  );
}
