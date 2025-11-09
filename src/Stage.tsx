export function Stage() {
  return (
    <div className="mb-12">
      <div className="relative">
        {/* Stage platform */}
        <div className="bg-gradient-to-b from-purple-900 to-purple-700 rounded-t-3xl p-8 text-center shadow-2xl">
          <div className="text-white text-2xl mb-2">STAGE</div>
          <div className="h-1 bg-purple-400 w-3/4 mx-auto rounded"></div>
        </div>
        
        {/* Stage edge/curtain effect */}
        <div className="h-4 bg-gradient-to-b from-purple-600 to-transparent"></div>
      </div>
      
      {/* Stage indicator text */}
      <div className="text-center mt-4 text-sm text-gray-500">
        ↑ Front of Venue ↑
      </div>
    </div>
  );
}
