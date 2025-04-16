import Layout from "./components/Layout";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Register from "./components/Register";
import About from "./components/About";
import Calculator from "./components/Calculator";
import Home from "./components/Home";
import Courses from "./components/Courses";
import CoursesAdd from "./components/CoursesAdd";
import Grades from "./components/Grades";
import GradesAdd from "./components/GradesAdd";
import Assignments from "./components/Assignments";
import AssignmentsAdd from "./components/AssignmentsAdd";
import Account from "./components/Account";
import NotFound from "./components/NotFound";
import PrivateRoute from "./components/PrivateRoute"; 
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            {/* Not Found */}
            <Route path="*" element={<NotFound />} />

            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/calculator" element={<Calculator />} />

            {/* Private Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/account" element={<Account />} />

              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/add" element={<CoursesAdd />} />
              <Route path="/courses/:courseSlug/edit" element={<CoursesAdd edit={true} />} />

              <Route path="/courses/grades" element={<Grades />} />
              <Route path="/courses/:courseSlug/grades" element={<Grades />} />
              <Route path="/courses/grades/add" element={<GradesAdd />} />
              <Route path="/courses/:courseSlug/grades/add" element={<GradesAdd />} />
              <Route path="/courses/grades/:gradeId/edit" element={<GradesAdd edit={true} />} />

              <Route path="/courses/assignments" element={<Assignments />} />
              <Route path="/courses/:courseSlug/assignments" element={<Assignments />} />
              <Route path="/courses/assignments/add" element={<AssignmentsAdd />} />
              <Route path="/courses/:courseSlug/assignments/add" element={<AssignmentsAdd />} />
              <Route path="/courses/assignments/:assignmentId/edit" element={<AssignmentsAdd edit={true} />} />
            </Route>

          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
