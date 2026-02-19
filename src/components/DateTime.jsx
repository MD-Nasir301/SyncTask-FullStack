import { useEffect, useState } from "react";
function DateTime() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer); // For my understand -- Clean up the timer when the component unmounts
  }, []);

  return (
    <div className="flex justify-between mt-4 px-2 text-slate-400 font-mono text-sm md:text-lg">
      <div>
        <span className="text-yellow-400">Time:</span>{" "}
        {currentTime.toLocaleTimeString()}
      </div>
      <div>
        <span className="text-yellow-400">Date:</span>{" "}
        {new Intl.DateTimeFormat("en-GB").format(new Date(currentTime))}
      </div>
    </div>
  );
}

export default DateTime;
