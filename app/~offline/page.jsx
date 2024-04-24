import React from 'react'

const OfflinePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
      {/* Your page content below */}
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">Whoops! Offline Mode</h1>
        <p className="text-center text-lg mb-8">
          Looks like your internet connection took a break. Don&apos;t worry, we&apos;ll
          be back online soon!
        </p>
      </div>
    </div>
  );
}

export default OfflinePage