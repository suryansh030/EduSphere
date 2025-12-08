import React, { useState, useEffect } from "react";

const feedbacks = [
  {
    name: "Priya Sharma",
    role: "Student, IIT Delhi",
    rating: 5,
    quote: "EduSphere helped me land my dream internship! The mentorship program and industry connections are exceptional.",
    img: "https://randomuser.me/api/portraits/women/1.jpg"
  },
  {
    name: "Dr. Ramesh Kumar",
    role: "Dean, ABC College",
    rating: 5,
    quote: "Our students are now industry-ready. The NEP compliance tracking and real-time analytics are game-changers for our institution.",
    img: "https://randomuser.me/api/portraits/men/1.jpg"
  },
  {
    name: "Sonal Taneja",
    role: "HR Manager, TechCorp",
    rating: 5,
    quote: "Hiring verified interns has never been easier. The platform is intuitive, efficient, and saves us significant time.",
    img: "https://randomuser.me/api/portraits/women/2.jpg"
  },
  {
    name: "Amit Patel",
    role: "Student, NIT Bangalore",
    rating: 4,
    quote: "The internship opportunities on EduSphere are curated and genuine. Got placed at my top choice company!",
    img: "https://randomuser.me/api/portraits/men/2.jpg"
  },
  {
    name: "Neha Verma",
    role: "Placement Officer, XYZ College",
    rating: 5,
    quote: "The digital logbooks feature has streamlined our verification process. Students love the transparency.",
    img: "https://randomuser.me/api/portraits/women/3.jpg"
  },
  {
    name: "Vikram Singh",
    role: "Founder, StartUp Hub",
    rating: 4,
    quote: "Great platform for connecting with fresh talent. The API integration was seamless and the support team is fantastic.",
    img: "https://randomuser.me/api/portraits/men/3.jpg"
  }
];

export default function Feedback() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % (feedbacks.length - itemsPerView + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [itemsPerView]);

  const visibleFeedbacks = feedbacks.slice(currentIndex, currentIndex + itemsPerView);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + feedbacks.length) % (feedbacks.length - itemsPerView + 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % (feedbacks.length - itemsPerView + 1));
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 bg-white font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of students, colleges, and companies who trust EduSphere for their career growth.
          </p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-hidden">
            {visibleFeedbacks.map((feedback, idx) => (
              <div
                key={currentIndex + idx}
                className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-all duration-300 transform"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={feedback.img}
                    alt={feedback.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{feedback.name}</h3>
                    <p className="text-sm text-gray-600">{feedback.role}</p>
                  </div>
                </div>

                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <svg
                      key={idx}
                      className={`w-5 h-5 ${
                        idx < feedback.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>

                <p className="text-gray-700 leading-relaxed italic">
                  "{feedback.quote}"
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
              aria-label="Previous"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex gap-2">
              {Array.from({ length: feedbacks.length - itemsPerView + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentIndex ? "bg-gray-900 w-8" : "bg-gray-300"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
              aria-label="Next"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
