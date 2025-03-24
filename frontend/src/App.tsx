import LoginForm from "./components/LoginForm";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomeDashboard from "./components/WelcomeDashboard";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/dashboard" element={<WelcomeDashboard />} />
            </Routes>
        </Router>
    );
}

export default App;
