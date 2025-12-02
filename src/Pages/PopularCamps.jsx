import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import { Helmet } from "react-helmet-async";
import '../../src/App.css';
import '../../src/Animation/Buttonstyle.css';
import Skeleton from "../components/ui/skeletor";

const PopularCamps = () => {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);

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

  // Fetch data
  useEffect(() => {
    setLoading(true);

    if (isOnline) {
      axios.get("https://medical-camp-server-sage.vercel.app/camps")
        .then(res => {
          const sortedCamps = res.data.sort(
            (a, b) => b.participantCount - a.participantCount
          );
          const sliced = sortedCamps.slice(0, 6);

          setTimeout(() => {
            setCamps(sliced);
            setError("");
            setLoading(false);
          }, 4000); // Skeleton delay
        })
        .catch(err => {
          console.error("Failed to fetch popular camps:", err);
          setTimeout(() => {
            setError("⚠️ Popular camp data fetch করতে ব্যর্থ হয়েছে।");
            setLoading(false);
          }, 4000);
        });
    } else {
      // No internet → keep loading skeleton until online
      setError("⚠️ Internet connection নেই। অনুগ্রহ করে সংযুক্ত করুন।");
      setLoading(true);
    }
  }, [isOnline]);

  return (
    <div className="relative max-w-8xl mx-auto px-4 my-10">
      <Helmet>
        <title>Popular Camp | MedCampMS</title>
        <meta
          name="description"
          content="Welcome to MedCampMS - Your trusted medical camp management system."
        />
      </Helmet>

      <h2 className="relative z-10 lg:text-3xl md:text-3xl text-2xl font-cinzel mb-8 text-center">
        Popular Medical Camps
      </h2>

      {(!isOnline && loading) && (
        <p className="text-center text-red-600 font-bold mb-6">
          ⚠️ Internet connection নেই। অনুগ্রহ করে সংযুক্ত করুন।
        </p>
      )}

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)
          : error
          ? <p className="text-center mt-10 text-red-600 font-cinzel text-2xl font-bold">{error}</p>
          : camps.map(camp => (
            <div
              key={camp._id}
              className=" font-bold font-cinzel rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-105 transform transition duration-300 ease-in-out"
            >
              <img src={camp.image} className="w-full h-48 object-cover" alt={camp.camp_name} />
              <h1 className="text-center font-bold font-cinzel">
                OrganizerName: {camp.name}
              </h1>
              <div className="p-6 text-black dark:text-white">
                <div className="grid justify-between items-center mb-3">
                  <h3 className="text-md font-semibold text-indigo-800">
                    camp: {camp.camp_name}
                  </h3>
                  <p className="text-lg text-green-600">
                    💰Camp Fees: ${camp.fees}
                  </p>
                </div>
                <div className="text-lg text-green-600">
                  <p className="mb-1">
                  <strong>📅 Date & Time:</strong> {camp.dateTime}
                </p>
                <p className="mb-1 ">
                  <strong>📍Location:</strong> {camp.location}
                </p>
                <p className="mb-3">
                  <strong>👨‍⚕️Professional:</strong> {camp.doctor}
                </p>
                <p className="mb-3">
                  <strong>👥participant count: </strong> {camp.participantCount}
                </p>
                </div>

                <div className="flex justify-end">
                  <Link
                    to={`/camp-details/${camp._id}`}
                    className="mt-8 mr-36 md:mr-20 lg:mr-20"
                  >
                    <button className="button-82-pushable" role="button">
                      <span className="button-82-shadow"></span>
                      <span className="button-82-edge"></span>
                      <span className="button-82-front text"> View Details </span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
      </div>

      {!loading && !error && (
        <div className="relative z-10 text-center mt-12">
          <Link to="/availecamp">
            <button className="btn btn-primary bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300 btn-gradient-hover">
              See All Camps
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default PopularCamps;
