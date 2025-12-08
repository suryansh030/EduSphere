import React, { useEffect, useMemo, useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";

const localCourses = [
  {
    id: 1,
    title: "Frontend Web Development (React)",
    duration: "6 weeks",
    price: 0,
    rating: 4.6,
    students: 1240,
    tag: "Free",
  },
  {
    id: 2,
    title: "Data Structures & Algorithms",
    duration: "8 weeks",
    price: 499,
    rating: 4.8,
    students: 2150,
    tag: "Paid",
  },
  {
    id: 3,
    title: "Machine Learning Basics",
    duration: "10 weeks",
    price: 799,
    rating: 4.7,
    students: 980,
    tag: "Paid",
  },
];

function Price({ price }) {
  return price === 0 ? (
    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
      Free
    </span>
  ) : (
    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
      ₹{price}
    </span>
  );
}

export default function CoursesPage() {
  const [sectors, setSectors] = useState([]);
  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    state: "",
    sectorId: "",
  });

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        const [sectorRes, centreRes] = await Promise.all([
          fetch("/api/skillindia/sectors"),       // or full URL if no backend
          fetch("/api/skillindia/centres"),
        ]);

        const sectorsData = await sectorRes.json();
        const centresData = await centreRes.json();

        // Log once and inspect in console to know exact field names
        console.log("Sectors from API:", sectorsData);
        console.log("Centres from API:", centresData);

        setSectors(sectorsData || []);
        setCentres(centresData || []);
      } catch (e) {
        console.error(e);
        setError("Could not load Skill India data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // Derive unique states and sectors for filters (adjust key names after checking console)
  const availableStates = useMemo(() => {
    const set = new Set();
    centres.forEach((c) => {
      if (c.state) set.add(c.state);
    });
    return Array.from(set).sort();
  }, [centres]);

  const availableSectors = useMemo(() => {
    // adjust property names depending on actual response,
    // e.g. sectorName / name / sectorTitle etc.
    return sectors;
  }, [sectors]);

  const filteredCentres = useMemo(() => {
    return centres.filter((c) => {
      const byState = filters.state ? c.state === filters.state : true;

      // Suppose centre has sectorId or sectorName;
      // you will adapt this based on real keys.
      const bySector = filters.sectorId
        ? String(c.sectorId) === String(filters.sectorId)
        : true;

      return byState && bySector;
    });
  }, [centres, filters]);

  return (
    <section className="px-6 md:px-10 py-16 bg-slate-50 min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* 1. Your existing Trending block */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">
              Trending Now — Learn In-Demand Skills
            </h2>
            <p className="underline cursor-pointer text-blue-600">Show more</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {localCourses.map((c) => (
              <div
                key={c.id}
                className="p-6 rounded-xl shadow hover:shadow-xl bg-white transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {c.title}
                    </h3>
                    <p className="text-sm text-gray-500">{c.duration}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      c.tag === "Free"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {c.tag}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-4">
                  <StarIcon className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm text-gray-900">{c.rating}</span>
                  <span className="text-xs text-gray-500">
                    • {c.students} students
                  </span>
                </div>
                <div className="flex justify-between items-center mt-6">
                  <Price price={c.price} />
                  <button className="px-4 py-2 bg-[#1877F2] text-white rounded-md hover:bg-[#1456b8] transition">
                    Enroll Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Govt Skill India data */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Government Skill Courses & Training Centres
            </h2>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                State
              </label>
              <select
                className="mt-1 block w-48 border-gray-300 rounded-md shadow-sm"
                value={filters.state}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, state: e.target.value }))
                }
              >
                <option value="">All</option>
                {availableStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Sector
              </label>
              <select
                className="mt-1 block w-56 border-gray-300 rounded-md shadow-sm"
                value={filters.sectorId}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, sectorId: e.target.value }))
                }
              >
                <option value="">All</option>
                {availableSectors.map((s) => (
                  <option key={s.id || s.sectorId} value={s.id || s.sectorId}>
                    {s.name || s.sectorName || s.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Content */}
          {loading && <p>Loading Skill India data…</p>}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCentres.slice(0, 30).map((c) => (
                <div
                  key={c.id || c.tcId}
                  className="p-4 rounded-xl bg-white shadow hover:shadow-md transition"
                >
                  <h3 className="text-lg font-semibold text-gray-900">
                    {c.tcName || c.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {c.address || c.fullAddress}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {c.district}, {c.state}
                  </p>
                  {c.sectorName && (
                    <p className="mt-1 text-xs text-blue-700 font-medium">
                      Sector: {c.sectorName}
                    </p>
                  )}
                  {c.website && (
                    <a
                      href={c.website}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-block text-sm text-blue-600 underline"
                    >
                      Visit centre website
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}