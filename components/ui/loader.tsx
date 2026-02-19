import React from "react";

function Loader({ parentHeight = 200 }: { parentHeight?: number }) {
  return (
    <div
    style={{height: parentHeight}}
    className="flex justify-center items-center"
    >
      <div className="h-10 w-10 border border-black border-t-gray-300 border-8 rounded-full animate-spin"></div>
    </div>
  );
}

export default Loader;
