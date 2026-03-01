import Header from "./components/Header";
import { useEffect, useMemo, useState } from "react";
import DateTime from "./components/DateTime";
import { db, auth, googleProvider } from "./firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isAutoSync, setIsAutoSync] = useState(true);
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [category, setCategory] = useState("all");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("লগইন হয়নি কারণ:", error.message);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("লগআউট হয়নি কারণ:", error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const cloudTasks = await fetchTaskFromCloud(currentUser.uid);
        const localData = localStorage.getItem("tasks");
        const localTasks = localData ? JSON.parse(localData) : [];

        const combined = [...localTasks, ...cloudTasks];

        const uniqueTasks = Array.from(
          new Map(combined.map((item) => [item.id, item])).values(),
        );

        setTasks(uniqueTasks);
      }
    });
    return () => unsubscribe();
  }, []);

  //-----------------------------------------------------------------
  //-----------------------------------------------------------------

  const fetchTaskFromCloud = async (uid) => {
    try {
      setLoading(true);
      const q = query(collection(db, "tasks"), where("userId", "==", uid));
      const querySnapshot = await getDocs(q);
      const cloudTasks = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        docId: doc.id,
      }));
      return cloudTasks;
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const uploadTaskToFirebase = async (taskData) => {
    try {
      if (!auth.currentUser) {
        const confirmLogin = window.confirm("Please Login to upload");
        if (confirmLogin) {
          await handleLogin();
          if (!auth.currentUser) {
            throw new Error("Login failed. Please Try again");
          }
        } else {
          throw new Error("User cancelled login");
        }
      }
      if (auth.currentUser) {
        const docRef = await addDoc(collection(db, "tasks"), {
          ...taskData,
          userId: auth.currentUser.uid,
          isSynced: true,
        });

        return docRef;
      }
    } catch (error) {
      console.log(error.message);
      alert("Data upload not successfull" + "  > " + error.message);
      return null;
    }
  };

  const handleAddTask = async () => {
    if (inputValue.length === 0) return;
    const task = {
      id: crypto.randomUUID(),
      text: inputValue,
      date: new Date().toLocaleDateString(),
      isCompleted: false,
      isSynced: false,
    };

    if (auth.currentUser && isAutoSync) {
      try {
        setLoading(true);
        await uploadTaskToFirebase(task);
        task.isSynced = true;
        setLoading(false);
      } catch (error) {
        console.error("Cloud save failed, saving locally only:", error);
        throw error;
      }
    }

    setTasks((prevTasks) => [...prevTasks, task]);
    setInputValue("");
  };

  const handleUploadToCloud = async (task) => {
    try {
      setLoading(true);
      const result = await uploadTaskToFirebase(task);
      if (result) {
        task.isSynced = true;
        setLoading(false);
        setTasks((prevTasks) => {
          return prevTasks.map((t) => (t.id === task.id ? task : t));
        });
      }
    } catch (error) {
      console.log("Not Upload, somethind Wrond", error);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskCompletedFromFirebase = async (docId) => {
    try {
      if (!docId) throw new Error("Document ID missing!");
      const taskDocRef = doc(db, "tasks", docId);
      // await deleteDoc(taskDocRef);
      await updateDoc(taskDocRef, {
        isCompleted: true,
      });

      return true;
    } catch (error) {
      console.log(error.message);
      alert("Update Failed" + error.message);
      return false;
    }
  };

  // -------------------------------------------------------------------
  // -------------------------------------------------------------------

  const displayTasks = useMemo(() => {
    if (category === "local") {
      return tasks.filter((t) => !t.isSynced);
    }
    if (category === "cloud") {
      return tasks.filter((t) => t.isSynced);
    }
    return tasks;
  }, [tasks, category]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const activeTasks = displayTasks.filter((task) => !task.isCompleted);
  const completedTasks = displayTasks.filter((task) => task.isCompleted);

  const groupedTasks = activeTasks.reduce((groups, task) => {
    const { date } = task;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(task);
    return groups;
  }, {});

  const dates = Object.keys(groupedTasks);
  const sortDates = dates.sort((a, b) => {
    return new Date(b) - new Date(a);
  });

  const handleDone = async (id, docId) => {
    if (docId) {
      const  success = await updateTaskCompletedFromFirebase(docId);
      if ( success) {
        const completedTasks = tasks.map((task) => {
          if (task.id !== id) {
            return task;
          } else {
            return { ...task, isCompleted: true };
          }
        });

        setTasks(completedTasks);
      }
    }
  };

  const handleEdit = (id) => {
    if (editText.length === 0) {
      return;
    }
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, text: editText } : task,
    );
    setTasks(updatedTasks);
    setEditId(null);
  };

  const handleDelete = (id) => {
    const remaingTask = tasks.filter((task) => task.id !== id);
    setTasks(remaingTask);
  };

  console.log(".......App.........");
  return (
    <div>
      <div className="min-h-screen bg-slate-800 p-4">
        <Header
          user={user}
          handleLogin={handleLogin}
          handleLogout={handleLogout}
          filterData={setCategory}
        />
        <DateTime />

        <div className="max-w-3xl mx-auto mt-5">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddTask();
                }
                if (e.key === "Escape") {
                  setInputValue("");
                }
              }}
              placeholder="Type Your Task..."
              className="flex-1 bg-slate-800 border-2 border-slate-700 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-orange-500 transition-all   "
            />
            <button
              onClick={handleAddTask}
              className=" bg-orange-400 px-6 text-white font-bold rounded-2xl hover:bg-amber-400 transition-all shadow-lg cursor-pointer hover:text-black active:scale-95"
            >
              Add
            </button>
          </div>
          {auth.currentUser && (
            <div className="flex gap-4">
              <span className="flex items-center ml-2">
                <input
                  type="checkbox"
                  name="sync"
                  id="sync-checkbox"
                  checked={isAutoSync}
                  onChange={(e) => setIsAutoSync(e.target.checked)}
                />
                <label
                  htmlFor="sync-checkbox"
                  className=" text-slate-400  ml-2"
                >
                  Auto Sync
                </label>
              </span>
              {loading && (
                <span className="text-center text-slate-500 ">
                  Please wait...
                </span>
              )}
            </div>
          )}

          {!auth.currentUser && (
            <p className="text-center text-slate-500 ">
              Sign in to enable cloud sync and access your tasks from any
              device!
            </p>
          )}
        </div>

        <div className="max-w-3xl mx-auto mt-8 space-y-8">
          {sortDates.map((date) => {
            return (
              <section key={date}>
                <h3 className="text-slate-500 font-bold mb-4 border-b border-slate-400 pb-2 text-sm md:text-lg">
                  🗓️ {new Intl.DateTimeFormat("en-GB").format(new Date(date))}
                </h3>
                {groupedTasks[date].map((task) => {
                  return (
                    <div
                      key={task.id}
                      className="flex single-task mb-3  gap-4 justify-between border-l-4 border-orange-400 group transition-all hover:border-white p-3 rounded-xl bg-slate-900"
                    >
                      <div className="flex-1 text-white text-lg font-medium ">
                        {editId === task.id ? (
                          <input
                            className="block border placeholder:text-sm border-amber-300 px-2 w-full"
                            value={editText}
                            onChange={(e) => {
                              setEditText(e.target.value);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleEdit(task.id);
                              if (e.key === "Escape") setEditId(null);
                            }}
                            type="text"
                            placeholder="Add Some text . . ."
                            autoFocus
                          />
                        ) : (
                          <div className="text-[17px] text-justify text-yellow-200">
                            {task.text}
                          </div>
                        )}

                        {task.isSynced ? (
                          <span className="text-[10px] a  px-2 py-[2px]  rounded bg-green-500/60 text-black font-medium">
                            ☁️ Cloud Synced
                          </span>
                        ) : (
                          <span
                            onClick={() => handleUploadToCloud(task)}
                            className="text-[10px] cursor-pointer   text-amber-300/40 px-2 py-0.5 rounded-md hover:border hover:border-amber-400 hover:text-white transition-all"
                          >
                            ⬆️ Click to Upload
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        {editId === task.id ? (
                          <button
                            onClick={() => setEditId(null)}
                            className="border  px-6 text-orange-400 font-bold rounded-2xl hover:bg-amber-400 transition-all shadow-lg cursor-pointer hover:text-black active:scale-95"
                          >
                            Cancel
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDone(task.id, task.docId)}
                            // onClick ={()=> deleteTaskFromFirebase(task.docId)}
                            className="border  px-6 text-orange-400 font-bold rounded-2xl hover:bg-amber-400 transition-all shadow-lg cursor-pointer hover:text-black active:scale-95"
                          >
                            Done
                          </button>
                        )}
                        {editId === task.id ? (
                          <button
                            onClick={() => handleEdit(task.id)}
                            className="border border-orange-400 px-6 text-orange-400 font-bold rounded-2xl hover:bg-amber-400 transition-all shadow-lg cursor-pointer hover:text-black active:scale-95"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              (setEditId(task.id), setEditText(task.text));
                            }}
                            className="border border-orange-400 px-6 text-orange-400 font-bold rounded-2xl hover:bg-amber-400 transition-all shadow-lg cursor-pointer hover:text-black active:scale-95"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </section>
            );
          })}
        </div>

        {completedTasks.length > 0 && (
          <div>
            <div className="flex justify-between bg-yellow-300  text-center  max-w-3xl mx-auto p-2 rounded-2xl mt-12 mb-5">
              <p className="flex-1 text-center text-2xl font-bold">
                {" "}
                Completed Tasks
              </p>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-slate-800 cursor-pointer rounded-2xl px-5 font-light text-white"
              >
                ‍<span> {isOpen ? "Close" : "Open"} </span>
                <span
                  className={`transition-transform duration-700 inline-block ${isOpen ? "rotate-180" : "rotate-0"}`}
                >
                  ⬇️
                </span>
              </button>
            </div>
            <div
              className={`max-w-3xl mx-auto transition-all duration-700 ease-in-out overflow-hidden ${
                isOpen
                  ? "max-h-[1000px] opacity-100 mt-4 overflow-y-auto"
                  : "max-h-0 opacity-0"
              }`}
            >
              <section>
                {completedTasks.map((task) => {
                  return (
                    <div
                      key={task.id}
                      className="flex single-task mb-3  gap-4 justify-between border-l-4 border-orange-400 group transition-all hover:border-white p-3 rounded-xl bg-sky-600/20"
                    >
                      <div className="flex-1 text-white text-lg font-medium ">
                        <div className="text-[16px] text-justify text-yellow-200">
                          {task.text}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="border  px-6 text-orange-400 font-bold rounded-2xl hover:bg-amber-400 transition-all shadow-lg cursor-pointer hover:text-black active:scale-95"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
