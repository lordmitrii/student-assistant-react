import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/Login';
import Home from './components/Home';
import Courses from './components/Courses';
import Grades from './components/Grades';
import Assignments from './components/Assignments';
import { getCSRF } from './services/api';



function App() {

    const [user, setUser] = useState(null);
    

    return (
        <Router>
          <Routes>
            <Route element={<Layout user={user} />}>
              <Route path="/login" element={<Login setUser={setUser} />} />
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