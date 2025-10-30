"use client";

export default function LoadingShell() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-pulse space-y-3 w-full max-w-4xl p-6">
        <div className="h-6 bg-gray-200 rounded w-1/4" />
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="h-20 bg-gray-200 rounded" />
          <div className="h-20 bg-gray-200 rounded" />
          <div className="h-20 bg-gray-200 rounded" />
          <div className="h-20 bg-gray-200 rounded" />
        </div>
        <div className="h-64 bg-gray-200 rounded mt-6" />
      </div>
    </div>
  );
}
