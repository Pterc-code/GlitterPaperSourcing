import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/accounts/register';
import Login from './pages/accounts/login';
import Dashboard from './pages/dashboard/dashboard';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        {/* Add more routes here if needed */}
      </Routes>
    </Router>
  );
}

export default App;
