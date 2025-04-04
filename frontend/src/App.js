import { useState, useEffect } from 'react';
import { getCSRF, fetchUser } from './services/api';
import Layout from './components/Layout';
import Login from './components/Login';
import Logout from './components/Logout';
import Home from './components/Home';
import Courses from './components/Courses';
import Grades from './components/Grades';
import Assignments from './components/Assignments';
import Account from './components/Account';
import PrivateRoute  from './components/PrivateRoute';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';



function App() {
    const [user, setUser] = useState(null);
    useEffect(() => {
      getCSRF();
      fetchUser().then(res => {
        if (res.data.isAuthenticated) {
          setUser(res.data.user);
        }
      });
    }, []);
    
    
    return (
        <Router>
          <Routes>
            <Route element={<Layout user={user} />}>
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/logout" element={<Logout setUser={setUser} />} />
              <Route path="/account" element={<Account user={user} />} />
              <Route path='/' element={<Home />} />
              <Route path='/courses' element={<Courses />} />
              <Route path='/grades' element={<Grades />} />
              <Route path='/assignments' element={<Assignments />} />
              </Route>
          </Routes>
        </Router>
    );
}

export default App;