import { useState } from "react";
import demoProfile from "../assets/demo-profile-img.png";
import taskImg from "../assets/task.png";

function Header({ user, handleLogin, handleLogout, filterData }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  console.log("..........Header...........");
  return (
    <header className="flex justify-between items-center bg-slate-600 p-3 rounded-2xl ">
      <div>
        <img className="w-10 h-10" src={taskImg} alt="" />{" "}
      </div>
      <div className="text-xl font-bold text-orange-400 text-shadow-red-600 text-shadow-lg">
        To <span className="inline-block  rotate-5">Do</span>
      </div>
      <div className="flex items-center ">
        {user ? (
          <div
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white text-sm relative  flex gap-3 items-center bg-slate-500 px-3 py-1 rounded-full cursor-pointer"
          >
            {" "}
            <span className="flex-1 text-sm md:text-lg text-slate-900">
              {user.displayName}
            </span>
            <div className="w-8 h-8 rounded-full border overflow-hidden border-orange-400">
              <img
                src={user?.photoURL || "https://via.placeholder.com/40"}
                referrerPolicy="no-referrer"
                className="w-full"
                alt={user.displayName || "User"}
              />
            </div>
          </div>
        ) : (
          <div className="text-white text-sm flex gap-3 items-center  bg-slate-500 px-3 py-1 rounded-full cursor-pointer">
            {" "}
            <span
              className="hover:bg-gray-600 px-3 py-0.5 rounded-2xl"
              onClick={handleLogin}
            >
              LogIn
            </span>
            <div className="w-8 h-8 bg-slate-300 rounded-full border overflow-hidden border-orange-400">
              <img className="w-full" src={demoProfile} alt="" />
            </div>
          </div>
        )}
        <div className=" cursor-pointer  px-5 relative text-white p">
          <span
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rotate-90 block text-2xl tracking-widest font-bold "
          >
            ...
          </span>
          <ul
            className={`absolute top-full right-0 py-5 pt-4 w-52 z-50 ${isMenuOpen ? "block" : "hidden"}`}
          >
            <li
              onClick={() => filterData("local")}
              className="bg-black px-6 py-1 border-2 border-transparent hover:border-blue-300"
            >
              Only Local Data
            </li>
            <li
              onClick={() => filterData("cloud")}
              className="bg-green-500 text-black px-6 py-1 border-2 border-transparent hover:border-blue-300"
            >
              Only Database Data
            </li>
            <li
              onClick={() => filterData("all")}
              className="bg-slate-500 text-black px-6 py-1 border-2 border-transparent hover:border-blue-300"
            >
              All Data
            </li>
            {user ? (
              <li
                onClick={handleLogout}
                className="bg-slate-600 text-black px-6 py-1 border-2 border-transparent hover:border-blue-300"
              >
                Logout
              </li>
            ) : null}
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;
