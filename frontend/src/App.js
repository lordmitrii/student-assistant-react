import Layout from "./components/Layout";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Home from "./components/Home";
import Courses from "./components/Courses";
import CoursesAdd from "./components/CoursesAdd";
import CoursesEdit from "./components/CoursesEdit";
import Grades from "./components/Grades";
import GradesAdd from "./components/GradesAdd";
import GradesEdit from "./components/GradesEdit";
import Assignments from "./components/Assignments";
import Account from "./components/Account";
import NotFound from "./components/NotFound";
import PrivateRoute from "./components/PrivateRoute"; 
import { useEffect, useState } from "react";
import { fetchUser } from "./services/api"; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser()
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        setUser(null); 
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <Router>
      <Routes>
        <Route element={<Layout user={user} />}>
          {/* Not Found */}
          <Route path="*" element={<NotFound />} />

          {/* Public Routes */}
          <Route path="/" element={<Home user={user} />} />
          <Route path="/login" element={<Login setUser={setUser}/>} />
          <Route path="/logout" element={<Logout setUser={setUser}/>} />

          {/* Private Routes */}
          <Route element={<PrivateRoute user={user} />}>
            <Route path="/account" element={<Account user={user}/>} />

            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/add" element={<CoursesAdd />} />
            <Route path="/courses/:courseSlug/edit" element={<CoursesEdit />} />

            <Route path="/courses/grades" element={<Grades />} />
            <Route path="/courses/grades/add" element={<GradesAdd />} />
            <Route path="/courses/:courseSlug/grades/add" element={<GradesAdd />} />
            <Route path="/courses/grades/:gradeId/edit" element={<GradesEdit />} />

            <Route path="/courses/:courseSlug/grades" element={<Grades />} />
            <Route path="/courses/assignments" element={<Assignments />} />
          </Route>

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
