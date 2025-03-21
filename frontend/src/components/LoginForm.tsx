import { useState } from "react";
import { loginUser } from "../api/auth";
import React from "react";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [token, setToken] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const token = await loginUser(email, password);
            setToken(token);
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="email-input"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-testid="password-input"
            />
            <button type="submit" data-testid="submit-button">Login</button>
            {error && <p data-testid="error-message">{error}</p>}
            {token && <p data-testid="success-message">Logged in successfully!</p>}
        </form>
    );
}

export default LoginForm;
