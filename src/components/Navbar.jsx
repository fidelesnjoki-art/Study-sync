import {Link} from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
    const { user, logout, isAdmin } = useAuth();

    return (
        <nav style={{padding: 20, display: "flex", gap: 10, borderBottom: "1px solid #2269f7"}}>
            <Link to="/">Home</Link> |{" "}
            <Link to="/register">Register</Link> |{" "}
            <Link to="/login">Login</Link> |{" "}
            <Link to="/dashboard">Dashboard</Link> |{" "}
            <Link to="/schedule">Schedule</Link> |{" "}
            <Link to="/tasks">Tasks</Link>
            {isAdmin && <Link to="/admin">Admin</Link>}
            <button className="primary-btn"
            onClick={logout}
            >Logout</button>
        </nav>
    );
}