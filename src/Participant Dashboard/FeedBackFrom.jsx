import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import "../../src/App.css";
import image from "../assets/image/no data.jpg";
import Skeleton from "../components/ui/skeletor";

const FeedBackFrom = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const itemsPerPage = 6;

  // Internet status listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Fetch feedbacks
  useEffect(() => {
    setLoading(true);

    if (isOnline) {
      fetch("https://medical-camp-server-sage.vercel.app/feedbacks")
        .then((res) => res.json())
        .then((data) => {
          setTimeout(() => {
            setFeedbacks(data);
            setError(null);
            setLoading(false);
          }, 3000); // Skeleton delay
        })
        .catch(() => {
          setTimeout(() => {
            setError("Failed to fetch feedbacks.");
            setLoading(false);
          }, 3000);
        });
    } else {
      setError("⚠️ Internet connection নেই। অনুগ্রহ করে সংযুক্ত করুন।");
      setLoading(true); // keep skeleton loading while offline
    }
  }, [isOnline]);

  // Pagination setup
  const totalPages = Math.ceil(feedbacks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFeedbacks = feedbacks.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="relative overflow-hidden">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-opacity-60 z-0" />

      {/* Main Content */}
      <div className="relative z-10 w-full">
        <h2 className="lg:text-3xl md:text-3xl text-2xl py-6 font-cinzel text-center">
          📣 Participant Feedback
        </h2>

        {/* No Internet Message */}
        {!isOnline && (
          <p className="text-center text-red-600 font-bold mb-6">
            ⚠️ Internet connection নেই। অনুগ্রহ করে সংযুক্ত করুন।
          </p>
        )}

        {/* Skeleton Loading */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-6 py-10">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} />
              ))
            : error
            ? (
              <div className="text-center text-2xl font-bold mt-4 text-red-600">
                <p>{error}</p>
                <img
                  src={image}
                  alt="No Data"
                  className="mx-auto mt-4 w-60 rounded-lg"
                />
              </div>
            )
            : currentFeedbacks.map((fb) => (
              <div
                key={fb._id}
                className="bg-opacity-90 backdrop-blur-md shadow-md p-6 transition-transform hover:scale-105 duration-300 border flex flex-col justify-between rounded-xl"
              >
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <img
                      className="w-14 h-14 rounded-2xl object-cover"
                      src={fb.participantImage}
                      alt=""
                    />
                    <h3 className="font-semibold text-indigo-700  font-cinzel mt-1">
                      {fb.participantName}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500 font-bold">
                    {Array.from({ length: Math.round(fb.rating) }, (_, i) => (
                      <FaStar key={i} />
                    ))}
                    <span className="ml-1 text-black dark:text-white">({fb.rating} / 5)</span>
                  </div>
                </div>
                <p className="text-gray-400 italic mb-3 font-Montserrat ">"{fb.comment}"</p>
                <p className="text-sm text-gray-500 text-right font-bold font-cinzel">
                  🕒{" "}
                  {fb.date
                    ? new Date(fb.date).toLocaleDateString()
                    : "Unknown Date"}
                </p>
              </div>
            ))}
        </div>

        {/* Pagination */}
        {!loading && feedbacks.length > itemsPerPage && (
          <div className="flex justify-center mt-8 gap-2 flex-wrap">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="btn btn-sm"
            >
              ←
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`btn btn-sm ${
                  currentPage === i + 1 ? "btn-primary" : ""
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="btn btn-sm"
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedBackFrom;
