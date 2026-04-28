import React from 'react';

const Top10Debug = () => {
  return (
    <div className="p-4 bg-yellow-600 text-white mb-4">
      <h3 className="font-bold text-lg">Top 10 Debug Info</h3>
      <p className="text-sm">Open browser console (F12) to see detailed logs</p>
      <p className="text-xs mt-2">Look for "Top10Row:" messages in console</p>
    </div>
  );
};

export default Top10Debug;
