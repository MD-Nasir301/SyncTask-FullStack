import { auth, googleProvider } from "../firebase";
import { signInWithPopup, signOut } from "firebase/auth";

import demoProfile from "../assets/demo-profile-img.png";

function Header({ user }) {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("লগইন হয়নি কারণ:", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("লগআউট হয়নি কারণ:", error.message);
    }
  };

  return (
    <header className="flex justify-between items-center bg-slate-600 p-3 rounded-2xl ">
      <div>TS</div>
      <div>ToDo</div>

      {user ? (
        <div className="text-white text-sm relative group flex gap-3 items-center bg-slate-500 px-3 py-1 rounded-full cursor-pointer">
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
          <button
            onClick={handleLogout}
            className="cursor-pointer w-full top-full right-0 hidden group-hover:block bg-slate-800  border-2 font-bold text-[14px] px-2 py-2 left-0 rounded-2xl absolute"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="text-white text-sm flex gap-3 items-center  bg-slate-500 px-3 py-1 rounded-full cursor-pointer">
          {" "}
          <span onClick={handleLogin}>LogIn</span>
          <div className="w-8 h-8 bg-slate-300 rounded-full border overflow-hidden border-orange-400">
            <img className="w-full" src={demoProfile} alt="" />
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
