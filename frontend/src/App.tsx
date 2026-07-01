import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";
import { LandingPage } from "./pages/LandingPage";
import { AdminEntry } from "./pages/admin/AdminEntry";
import { SubmissionsPage } from "./pages/admin/SubmissionsPage";
import "./styles/global.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/login" element={<Navigate to="/admin" replace />} />
        <Route path="/admin" element={<AdminEntry />} />
        <Route
          path="/admin/submissions"
          element={
            <ProtectedRoute>
              <SubmissionsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
