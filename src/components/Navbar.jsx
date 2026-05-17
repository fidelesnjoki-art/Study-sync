import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {

  const { user, logout, isAdmin } = useAuth();

  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path;

  return (
    <nav className="navbar">

      {/* LOGO */}
      <div className="nav-logo">
        <Link to="/">StudySync</Link>
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

            {isAdmin && (
              <Link
                className={isActive("/admin") ? "active" : ""}
                to="/admin"
              >
                Admin
              </Link>
            )}

            <button
              className="logout-btn"
              onClick={logout}
            >
              Logout
            </button>
          </>
        )}
      </div>

    </nav>
  );
}