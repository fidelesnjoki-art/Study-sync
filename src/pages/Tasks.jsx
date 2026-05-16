// import { useEffect, useState } from "react";
// import { addDoc, collection, getDocs, deleteDoc, doc, query, where, updateDoc } from "firebase/firestore";
// import { useAuth } from "../auth/AuthContext";
// import { db } from "../firebase/firebase";

// export default function Tasks() {
//   const [tasks, setTasks] = useState([]);
//   const [task, setTask] = useState("");
//   const { user } = useAuth();

//   const handleAddTask = async (e) => {
//     e.preventDefault();
//     if (!task) return;

//     try {
//       await addDoc(collection(db, "tasks"), {
//         title: task,
//         createdAt: new Date(),
//         userId: user.uid,
//         userEmail: user.email,
//         completed: false,
//       });
//       setTask("");
//       fetchTasks();
//     } catch (error) {
//       console.error("Error adding task:", error);
//     }
//   };
//   const fetchTasks = async () => {
//     const q =query(collection(db, "tasks"), where("userId", "==", user.uid));
//     const querySnapshot = await getDocs(q);
//     const tasksData = querySnapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));
//     setTasks(tasksData);
//   };

//   const handleDeleteTask = async (id) => {
//     try {
//       await deleteDoc(doc(db, "tasks", id));
//       fetchTasks();
//     } catch (error) {
//       console.error("Error deleting task:", error);
//     }
//   };

//   useEffect(() => {
//     if (user) {
//       fetchTasks();
//     }
//   }, [user]);

//   const toggleComplete = async (taskId, currentStatus) =>{
//     const taskRef = doc(db, "tasks", taskId);
//     await updateDoc(taskRef, {
//       completed: !currentStatus,
//     });
//     fetchTasks()
//   };

//   return (
//     <div>
//       <h1>Tasks</h1>

//       <input 
//         type="text"
//         placeholder="search tasks"
//         className="search-bar"
//         value={search}
//         onChange={e.target.value}
//         />
//       <form onSubmit={handleAddTask}>
//         <input
//           type="text"
//           value={task}
//           onChange={(e) => setTask(e.target.value)}
//           placeholder="Enter a new task"
//         />
//         <button type="submit">Add Task</button>
//       </form>
//       <hr />
//       <h2>Task List</h2>
//       {tasks.map ((task) => (
//         <div key={task.id}>
//           <p>{task.title}</p>
//           <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
//            <button onClick={() => toggleComplete(task.id, task.completed)
//         }
//         >
//           {task.completed ? "Completed" : "Mark Complete"}
//         </button>
//         <h3
//         style={{textDecoration: task.completed?
//           "line-through" : "none"
//         }}
//         >
//           {task . task}
//         </h3>
//         </div>
       
//       ))}

//     </div>
//   );
// }


import { useEffect, useState } from "react";

import { collection,addDoc,getDocs,deleteDoc,doc,updateDoc,query,} from "firebase/firestore";

import { db } from "../firebase/firebase";
import { useAuth } from "../auth/AuthContext";

export default function Tasks() {
  const { user } = useAuth();
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const fetchTasks = async () => {
    const q = query(collection(db, "tasks"));
    const snap = await getDocs(q);
    const data = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const userTasks = data.filter(
      (t) => t.userEmail === user.email
    );
    setTasks(userTasks);
  };
  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();

    if (!task) return;
    await addDoc(collection(db, "tasks"), {
      task,
      completed: false,
      userEmail: user.email,
    });

    setTask("");

    fetchTasks();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "tasks", id));

    fetchTasks();
  };

  const toggleComplete = async (
    taskId,
    currentStatus
  ) => {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, {
      completed: !currentStatus,
    });
    fetchTasks();
  };

  return (
  <div className="container">
    <h1 style={{ marginBottom: "20px" }}>
    My Tasks
    </h1>

    <form onSubmit={handleAddTask}>
      <input
      type="text"
      placeholder="Enter a task..."
      value={task}
      onChange={(e) =>setTask(e.target.value)
      }
     />
       
     <button
      type="submit"
      className="primary-btn"
     >
          Add Task
        </button>
      </form>

      <input
        type="text"
        placeholder="Search tasks..."
        className="search-bar"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <div className="task-grid">
        {tasks
        .filter((task) =>task.task && task.task
              .toLowerCase()
              .includes(search.toLowerCase())
          )
      .map((task) => (
       <div
          className="task-card"
          key={task.id}
         >
         <h3
          style={{
         textDecoration:
         task.completed
         ? "line-through"
          : "none",
           }}
        >
          {task.task}
       </h3>

              <p>
                Status:{" "}
                {task.completed
                  ? "Completed ✅"
                  : "Pending ⏳"}
              </p>

              <button
                className="primary-btn"
                onClick={() =>
                  toggleComplete(
                    task.id,
                    task.completed
                  )
                }
              >
                {task.completed
                  ? "Undo"
                  : "Mark Complete"}
              </button>

              <button
                style={{
                  background: "crimson",
                  color: "white",
                  marginLeft: "10px",
                }}
                onClick={() =>
                  handleDelete(task.id)
                }
              >
                Delete
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}