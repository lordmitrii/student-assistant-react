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
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            {/* Not Found */}
            <Route path="*" element={<NotFound />} />

            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />

            {/* Private Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/account" element={<Account />} />

              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/add" element={<CoursesAdd />} />
              <Route path="/courses/:courseSlug/edit" element={<CoursesEdit />} />

              <Route path="/courses/grades" element={<Grades />} />
              <Route path="/courses/:courseSlug/grades" element={<Grades />} />
              <Route path="/courses/grades/add" element={<GradesAdd />} />
              <Route path="/courses/:courseSlug/grades/add" element={<GradesAdd />} />
              <Route path="/courses/grades/:gradeId/edit" element={<GradesEdit />} />

              <Route path="/courses/assignments" element={<Assignments />} />
              <Route path="/courses/:courseSlug/assignments" element={<Assignments />} />
            </Route>

          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
