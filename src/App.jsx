import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import { useAuth } from "./auth/AuthContext";
import { useState } from "react";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Tasks = lazy(() => import("./pages/Tasks"));
const Schedule = lazy(() => import("./pages/Schedule"));
const Timer = lazy(() => import("./pages/Timer"));
const AdminDashboard = lazy(() =>
  import("./pages/admin/AdminDashboard")
);

function App() {
  const { isAdmin } = useAuth();


  return (
    <>
      <Navbar />

    <Suspense fallback={<h2>Loading...</h2>}>
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={
        <ProtectedRoute>
        <Dashboard />
        </ProtectedRoute>
      }
      />

      <Route path="/tasks" element={
        <ProtectedRoute>
        <Tasks />
        </ProtectedRoute>
      }
      />

      <Route path="/schedule" element={
        <ProtectedRoute>
          <Schedule />
        </ProtectedRoute>
      }
      />

      <Route path="/timer" element={
        <ProtectedRoute>
          <Timer />
        </ProtectedRoute>
      }
      />

      <Route path="/admin" element={
        <ProtectedRoute>
          {isAdmin ? (<AdminDashboard />
      ) : (
        <h2>Access Denied</h2>
      )}
       </ProtectedRoute>
      }
      />
      </Routes>
      </Suspense>
      </>
  );
}

export default App;