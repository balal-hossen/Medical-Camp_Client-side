import React from "react";

const Skeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse p-6">
      <div className="bg-gray-300 h-48 w-full mb-4 rounded-lg"></div>
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6 mb-2"></div>
      <div className="h-8 bg-gray-300 rounded w-32 mt-4"></div>
    </div>
  );
};

export default Skeleton;
