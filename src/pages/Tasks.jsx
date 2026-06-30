import React, { useEffect, useState } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../auth/AuthContext";
import { useToast } from "../components/Toast";

export default function Tasks() {
  const { user } = useAuth();
  const toast = useToast();

  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("General");
  const [dueDate, setDueDate] = useState("");
  
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortBy, setSortBy] = useState("dueDate"); // "dueDate" or "priority"
  const [newSubtaskText, setNewSubtaskText] = useState({}); // taskID -> subtask text input

  const fetchTasks = async () => {
    if (!user?.email) return;
    try {
      // Optimized query: filter directly by userEmail in Firestore
      const q = query(collection(db, "tasks"), where("userEmail", "==", user.email));
      const snap = await getDocs(q);
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        subtasks: doc.data().subtasks || [] // Default to empty array if none exist
      }));
      setTasks(data);
    } catch (e) {
      console.error("Error fetching tasks: ", e);
      toast.error("Fetch Error", "Could not load tasks.");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskName.trim()) return;

    try {
      await addDoc(collection(db, "tasks"), {
        task: taskName,
        completed: false,
        priority: priority,
        category: category,
        dueDate: dueDate || new Date().toISOString().split("T")[0],
        userEmail: user.email,
        subtasks: []
      });

      setTaskName("");
      setDueDate("");
      toast.success("Task Created", `"${taskName}" has been successfully planned.`);
      fetchTasks();
    } catch (err) {
      toast.error("Create Task Failed", err.message);
    }
  };

  const handleDelete = async (id, name) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
      toast.success("Task Deleted", `"${name}" removed from agenda.`);
      fetchTasks();
    } catch (err) {
      toast.error("Delete Failed", err.message);
    }
  };

  const toggleComplete = async (taskId, currentStatus, name) => {
    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, {
        completed: !currentStatus,
      });

      if (!currentStatus) {
        toast.success("Task Completed!", `Great job on finishing "${name}"!`);
      } else {
        toast.info("Task Active Again", `"${name}" set back to active status.`);
      }

      fetchTasks();
    } catch (err) {
      toast.error("Status Update Failed", err.message);
    }
  };

  // Subtask management
  const handleAddSubtask = async (taskId) => {
    const text = newSubtaskText[taskId]?.trim();
    if (!text) return;

    const targetTask = tasks.find((t) => t.id === taskId);
    if (!targetTask) return;

    const newSubtask = {
      id: Date.now() + Math.random().toString(36).substring(2, 7),
      text: text,
      completed: false
    };

    const updatedSubtasks = [...targetTask.subtasks, newSubtask];

    try {
      await updateDoc(doc(db, "tasks", taskId), {
        subtasks: updatedSubtasks
      });
      setNewSubtaskText({ ...newSubtaskText, [taskId]: "" });
      fetchTasks();
    } catch (err) {
      toast.error("Add Subtask Failed", err.message);
    }
  };

  const toggleSubtask = async (taskId, subtaskId) => {
    const targetTask = tasks.find((t) => t.id === taskId);
    if (!targetTask) return;

    const updatedSubtasks = targetTask.subtasks.map((sub) => {
      if (sub.id === subtaskId) {
        return { ...sub, completed: !sub.completed };
      }
      return sub;
    });

    try {
      await updateDoc(doc(db, "tasks", taskId), {
        subtasks: updatedSubtasks
      });
      fetchTasks();
    } catch (err) {
      toast.error("Toggle Subtask Failed", err.message);
    }
  };

  // Sorting and Filtering logic
  const priorityWeights = { high: 3, medium: 2, low: 1 };

  const filteredTasks = tasks
    .filter((t) => {
      const matchesSearch = t.task && t.task.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = filterCategory === "All" || t.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "dueDate") {
        return new Date(a.dueDate) - new Date(b.dueDate);
      } else if (sortBy === "priority") {
        const weightA = priorityWeights[a.priority] || 0;
        const weightB = priorityWeights[b.priority] || 0;
        return weightB - weightA; // High priority first
      }
      return 0;
    });

  // Extract unique categories from user's current tasks
  const availableCategories = ["All", "General", "Math", "Science", "Coding", "Reading", "Exams"];

  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <div>
          <h1>📚 My Study Agenda</h1>
          <p>Plan your assignments, set priorities, and stay on track.</p>
        </div>
      </div>

      {/* Task Creation Panel */}
      <div className="task-form-panel">
        <form className="task-form" onSubmit={handleAddTask}>
          <input
            type="text"
            placeholder="What is your study task?"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            required
          />

          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="General">General</option>
            <option value="Math">Mathematics</option>
            <option value="Science">Sciences</option>
            <option value="Coding">Computer Coding</option>
            <option value="Reading">Reading/Writing</option>
            <option value="Exams">Exam Prep</option>
          </select>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            placeholder="Due Date"
          />

          <button type="submit" className="primary-btn">
            Add Task
          </button>
        </form>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="task-toolbar">
        <div className="search-bar-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search tasks..."
            className="search-bar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="task-filters">
          <label style={{ fontSize: "13px", color: "#9ca3af" }}>Category:</label>
          <select
            className="filter-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            {availableCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <label style={{ fontSize: "13px", color: "#9ca3af", marginLeft: "10px" }}>Sort By:</label>
          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>

      {/* Task Metrics Dashboard Bar */}
      <div className="task-stats">
        <div className="mini-card">
          <h3>Total Tasks</h3>
          <p>{tasks.length}</p>
        </div>
        <div className="mini-card">
          <h3>Completed</h3>
          <p>{tasks.filter((t) => t.completed).length}</p>
        </div>
        <div className="mini-card">
          <h3>Active Pending</h3>
          <p>{tasks.filter((t) => !t.completed).length}</p>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="task-grid">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((t) => {
            const completedSubs = t.subtasks.filter((s) => s.completed).length;
            const totalSubs = t.subtasks.length;
            const progressPercent = totalSubs === 0 ? 0 : Math.round((completedSubs / totalSubs) * 100);

            return (
              <div className={`task-card priority-${t.priority}`} key={t.id}>
                <div className="task-top">
                  <div className="task-meta">
                    <span className={`task-badge badge-priority-${t.priority}`}>{t.priority}</span>
                    <span className="task-badge badge-tag">{t.category}</span>
                  </div>
                  <h3 className={t.completed ? "completed-task" : ""}>{t.task}</h3>
                  <div className="task-due-date">
                    📅 Due: {t.dueDate}
                  </div>
                </div>

                {/* Subtask Section */}
                <div className="card-subtasks">
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#9ca3af", marginBottom: "4px" }}>
                    <span>Subtasks</span>
                    <span>{completedSubs}/{totalSubs} ({progressPercent}%)</span>
                  </div>
                  <div className="subtask-progress-bar">
                    <div className="subtask-progress-fill" style={{ width: `${progressPercent}%` }}></div>
                  </div>

                  {t.subtasks.map((sub) => (
                    <label key={sub.id} className="subtask-item">
                      <input
                        type="checkbox"
                        checked={sub.completed}
                        onChange={() => toggleSubtask(t.id, sub.id)}
                      />
                      <span className={`subtask-text ${sub.completed ? "completed" : ""}`}>{sub.text}</span>
                    </label>
                  ))}

                  {/* Add Subtask Box */}
                  <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
                    <input
                      type="text"
                      placeholder="New subtask..."
                      style={{ fontSize: "12px", padding: "6px 8px", background: "rgba(0,0,0,0.15)", borderRadius: "6px", border: "1px solid var(--border-glass)", flexGrow: 1, color: "white" }}
                      value={newSubtaskText[t.id] || ""}
                      onChange={(e) => setNewSubtaskText({ ...newSubtaskText, [t.id]: e.target.value })}
                      onKeyDown={(e) => e.key === "Enter" && handleAddSubtask(t.id)}
                    />
                    <button
                      type="button"
                      style={{ padding: "4px 8px", background: "var(--accent-primary)", borderRadius: "6px", color: "white", fontSize: "12px", fontWeight: "bold" }}
                      onClick={() => handleAddSubtask(t.id)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="task-actions">
                  <button
                    className={`complete-btn ${t.completed ? "undo" : ""}`}
                    onClick={() => toggleComplete(t.id, t.completed, t.task)}
                  >
                    {t.completed ? "Undo" : "Complete"}
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(t.id, t.task)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-state" style={{ gridColumn: "1/-1" }}>
            <h2>No tasks found</h2>
            <p>Modify your search criteria or add a new study task above to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}