import React from 'react';

const CardSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 animate-pulse">
    <div className="h-4 w-28 bg-gray-200 rounded mb-4" />
    <div className="h-8 w-40 bg-gray-200 rounded" />
  </div>
);

const TableSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mt-6">
    <div className="h-5 w-40 bg-gray-200 rounded mb-4 animate-pulse" />
    <div className="overflow-x-auto">
      <div className="min-w-full">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 bg-gray-100 my-2 rounded animate-pulse" />
        ))}
      </div>
    </div>
  </div>
);

const LoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-72 bg-gray-200 rounded animate-pulse" />
          <div className="h-9 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <TableSkeleton />
      </div>
    </div>
  );
};

export default LoadingSkeleton;
