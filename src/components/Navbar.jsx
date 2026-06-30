import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useToast } from "./Toast";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const toast = useToast();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Successfully Logged Out", "See you again soon for your next study session!");
    } catch (error) {
      toast.error("Logout Failed", error.message);
    }
  };

  return (
    <nav className="navbar">
      {/* LOGO */}
      <div className="nav-logo">
        <Link to="/">
          <span>⚡ StudySync</span>
        </Link>
      </div>

      {/* LINKS */}
      <div className="nav-links">
        <Link
          className={isActive("/") ? "active" : ""}
          to="/"
        >
          Home
        </Link>

        {!user && (
          <>
            <Link
              className={isActive("/register") ? "active" : ""}
              to="/register"
            >
              Register
            </Link>

            <Link
              className={isActive("/login") ? "active" : ""}
              to="/login"
            >
              Login
            </Link>
          </>
        )}

        {user && (
          <>
            <Link
              className={isActive("/dashboard") ? "active" : ""}
              to="/dashboard"
            >
              Dashboard
            </Link>

            <Link
              className={isActive("/schedule") ? "active" : ""}
              to="/schedule"
            >
              Schedule
            </Link>

            <Link
              className={isActive("/tasks") ? "active" : ""}
              to="/tasks"
            >
              Tasks
            </Link>

            <Link
              className={isActive("/timer") ? "active" : ""}
              to="/timer"
            >
              Pomodoro
            </Link>

            {isAdmin && (
              <Link
                className={isActive("/admin") ? "active" : ""}
                to="/admin"
              >
                Admin
              </Link>
            )}

            {/* Profile chip */}
            <div className="user-profile-chip" title={user.email}>
              <span className="user-avatar-dot"></span>
              <span>{user.email.split("@")[0]}</span>
            </div>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}