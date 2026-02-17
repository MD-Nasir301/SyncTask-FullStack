function App() {
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

      </div>
    </div>
  );
}

export default App;
