import React from "react";
import { Briefcase, Building2, GraduationCap, Users, ArrowUpRight } from "lucide-react";

// Industry partner logos
const companies = [
  { name: "Google", logo: "https://www.logo.wine/a/logo/Google/Google-Logo.wine.svg" },
  { name: "Microsoft", logo: "https://www.logo.wine/a/logo/Microsoft/Microsoft-Logo.wine.svg" },
  { name: "Amazon", logo: "https://www.logo.wine/a/logo/Amazon_Web_Services/Amazon_Web_Services-Logo.wine.svg" },
  { name: "Spotify", logo: "https://www.logo.wine/a/logo/Spotify/Spotify-Logo.wine.svg" },
  { name: "Netflix", logo: "https://www.logo.wine/a/logo/Netflix/Netflix-Logo.wine.svg" },
  { name: "Airbnb", logo: "https://www.logo.wine/a/logo/Airbnb/Airbnb-Logo.wine.svg" }
];

const stats = [
  { label: "Active Partners", value: "100+", sub: "Global Companies", icon: Building2 },
  { label: "Students Placed", value: "500+", sub: "In last 6 months", icon: Users },
  { label: "Universities", value: "50+", sub: "Across the country", icon: GraduationCap },
  { label: "Success Rate", value: "95%", sub: "Interview clearance", icon: Briefcase },
];

export default function Companies() {
  return (
    <section className="relative py-24 bg-white overflow-hidden font-sans text-slate-900 border-b border-slate-100">

      {/* Background Pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.35]"
        style={{
          backgroundImage: "radial-gradient(#d7dce3 1px, transparent 1px)",
          backgroundSize: "28px 28px"
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-white"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            Trusted Ecosystem
          </div>

          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">
            We work with the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              industry leaders.
            </span>
          </h2>

          <p className="text-lg text-slate-500 leading-relaxed">
            Partnering with global innovators to build the future of opportunities.
          </p>
        </div>

        {/* Logos Section */}
        <div className="mb-20">
          <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">
            Our Hiring Partners
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 items-center justify-items-center">

            {companies.map((company, index) => (
              <div
                key={index}
                className="
                  group w-full flex justify-center items-center
                  bg-white border border-slate-200/60 rounded-xl shadow-sm
                  hover:shadow-xl hover:border-slate-300
                  p-4 h-28
                  transition-all duration-300 hover:-translate-y-2
                "
              >
                <img
                  src={company.logo}
                  alt={company.name}
                  className="
                    h-14 md:h-20 w-auto object-contain
                    opacity-80 group-hover:opacity-100
                    transition-all duration-300
                  "
                />
              </div>
            ))}

          </div>
        </div>

        {/* Stats Section */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 via-purple-100 to-blue-100 rounded-2xl opacity-50 blur-sm"></div>

          <div className="relative bg-white rounded-xl shadow-xl border border-slate-100 p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100">

              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={i}
                    className="flex flex-col items-start md:items-center text-left md:text-center px-4 pt-6 md:pt-0"
                  >
                    <div className="flex items-center gap-2 mb-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      <Icon size={16} strokeWidth={2.5} />
                      <span className="text-xs font-bold uppercase tracking-wide">
                        {stat.label}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-4xl font-bold text-slate-900 tracking-tight">
                        {stat.value}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-emerald-500" strokeWidth={3} />
                    </div>

                    <p className="text-sm font-medium text-slate-400 mt-1">
                      {stat.sub}
                    </p>
                  </div>
                );
              })}

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
