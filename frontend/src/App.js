import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/accounts/register';
import Login from './pages/accounts/login';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        {/* Add more routes here if needed */}
      </Routes>
    </Router>
  );
}

export default App;
