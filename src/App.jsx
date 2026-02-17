import { useEffect, useState } from "react";

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer); // For my understand -- Clean up the timer when the component unmounts
  }, []);

  return (
    <div>
      <div className="min-h-screen bg-slate-800 p-4">
        <header className="flex justify-between items-center bg-slate-600 p-4 rounded-2xl ">
          <div>TS</div>
          <div>ToDo</div>
          <div className="text-white text-sm flex gap-3 items-center bg-slate-500 px-3 py-1 rounded-full cursor-pointer">
            <span>LogIn</span>
            <div className="w-8 h-8 bg-slate-300 rounded-full border border-orange-400"></div>
          </div>
        </header>
        <div className="flex justify-between mt-6 px-2 text-slate-400 font-mono text-sm md:text-lg">
          <di>
            <span className="text-yellow-400">Time:</span>{" "}
            {currentTime.toLocaleTimeString()}
          </di>
          <div>
            <span className="text-yellow-400">Date:</span>{" "}
            {currentTime.toLocaleDateString()}
          </div>
        </div>


      </div>
    </div>
  );
}

export default App;
