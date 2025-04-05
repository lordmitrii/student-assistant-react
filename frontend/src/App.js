import { useState, useEffect } from "react";
import { getCSRF, fetchUser } from "./services/api";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Home from "./components/Home";
import Courses from "./components/Courses";
import Grades from "./components/Grades";
import Assignments from "./components/Assignments";
import Account from "./components/Account";
import NotFound from "./components/NotFound";
import PrivateRoute from "./components/PrivateRoute"; 
import useAuth from "./hooks/useAuth";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route element={<Layout user={user} />}>
          {/* Not Found */}
          <Route path="*" element={<NotFound />} />

          {/* Public Routes */}
          <Route path="/" element={<Home user={user} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />

          {/* Private Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/account" element={<Account user={user}/>} />

            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/grades" element={<Grades />} />
            <Route path="/courses/assignments" element={<Assignments />} />
          </Route>

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
