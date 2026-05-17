import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";

export default function Register() {
  const { register, googleLogin } = useAuth();

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await register(email, password);

      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin ();

      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
      <h1>Create Account</h1>
       <input type="email" placeholder="Enter email" value={email}
       onChange={(e) => setEmail(e.target.value) }
    />
      <input type="password" placeholder="Enter password" value={password}
       onChange={(e) => setPassword(e.target.value) }
    />
      <button type="submit">Register </button>
      
      <button type="button" onClick={handleGoogleLogin} className="google-btn"
    >Continue with Google</button>
      </form>
    </div>
  );
}