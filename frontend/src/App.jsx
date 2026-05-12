import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

import Login from './routes/login'
import Home from './routes/home'
import Register  from './routes/register'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  )
}

export default App
