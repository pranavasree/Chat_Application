import { Button } from "@/components/ui/button";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/auth/index.jsx";
import Profile from "./pages/profile/index.jsx";
import Chat from "./pages/chat/index.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth" />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
