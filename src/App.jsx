import { BrowserRouter, Routes, Route, Navigate } from "react-router"
import Login from "./pages/Login/Login"
import Register from "./pages/Register/Register"
import './App.css'

function App() {

  return (
    <>
      <BrowserRouter basename="/final-project">
        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="*" element={<Navigate to="/login"/>}/>
        
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
