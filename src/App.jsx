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
        <header className="flex justify-between items-center bg-slate-600 p-3 rounded-2xl ">
          <div>TS</div>
          <div>ToDo</div>
          <div className="text-white text-sm flex gap-3 items-center bg-slate-500 px-3 py-1 rounded-full cursor-pointer">
            <span>LogIn</span>
            <div className="w-8 h-8 bg-slate-300 rounded-full border border-orange-400"></div>
          </div>
        </header>
        <div className="flex justify-between mt-4 px-2 text-slate-400 font-mono text-sm md:text-lg">
          <di>
            <span className="text-yellow-400">Time:</span>{" "}
            {currentTime.toLocaleTimeString()}
          </di>
          <div>
            <span className="text-yellow-400">Date:</span>{" "}
            {currentTime.toLocaleDateString()}
          </div>
        </div>

        <div className="max-w-3xl mx-auto mt-5">
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 bg-slate-800 border-2 border-slate-700 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-orange-500 transition-all   "
            />
            <button className=" bg-orange-400 px-6 text-white font-bold rounded-2xl hover:bg-amber-400 transition-all shadow-lg cursor-pointer hover:text-black active:scale-95">
              Add
            </button>
          </div>
        </div>

        <div className="max-w-3xl mx-auto mt-8 space-y-8">
          <section>
            <h3 className="text-slate-500 font-bold mb-4 border-b border-slate-400 pb-2 text-sm md:text-lg">
              🗓️ 20-02-2026
            </h3>

            <div className="flex single-task mb-3  gap-4 justify-between border-l-4 border-orange-400 group transition-all hover:border-white p-3 rounded-xl bg-slate-900">
              <div className="flex-1 text-white text-lg font-medium ">
                <div className="text-[16px] text-justify text-yellow-200">
                  আমার নাম জেমস, আমি একজন সফটওয়্যার ডেভেলপার।
                </div>
                <span className="text-[10px]  bg-blue-500/10 mt-1 text-blue-300 px-2 py-0.5 rounded-md">
                  ☁️ Cloud Synced
                </span>
                {/* <span className="text-[10px] cursor-pointer bg-amber-500/20 mt-1 text-amber-500 px-2 py-0.5 rounded-md hover:bg-amber-500 hover:text-white transition-all">
                  ⚠️ Not Synced (Click to Upload)
                </span> */}
              </div>

              <div className="flex flex-col gap-2">
                <button className="border  px-6 text-orange-400 font-bold rounded-2xl hover:bg-amber-400 transition-all shadow-lg cursor-pointer hover:text-black active:scale-95">
                  Done
                </button>
                <button className="border border-orange-400 px-6 text-orange-400 font-bold rounded-2xl hover:bg-amber-400 transition-all shadow-lg cursor-pointer hover:text-black active:scale-95">
                  Edit
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
