import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
// import Courses from './pages/Courses';
// import Tasks from './pages/Tasks';
// import Files from './pages/Files';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/courses" element={<Courses />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/files" element={<Files />} /> */}
        <Route path="/" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;