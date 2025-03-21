import { useState } from "react";
import { loginUser } from "../api/auth";

type FormErrors = {
    email?: string;
    password?: string;
};

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [loginError, setLoginError] = useState("");
    const [token, setToken] = useState("");

    const validateForm = () => {
        const errors: FormErrors = {};

        if (!email) {
            errors.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            errors.email = "Enter a valid email address";
        }

        if (!password) {
            errors.password = "Password is required";
        } else if (password.length < 6) {
            errors.password = "Password must be at least 6 characters";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError("");
        setToken("");

        if (!validateForm()) return;

        try {
            const token = await loginUser(email, password);
            setToken(token);
        } catch (err: any) {
            setLoginError(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <div>
                <input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    data-testid="email-input"
                />
                {formErrors.email && (
                    <p data-testid="email-error" style={{ color: "red" }}>{formErrors.email}</p>
                )}
            </div>

            <div>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    data-testid="password-input"
                />
                {formErrors.password && (
                    <p data-testid="password-error" style={{ color: "red" }}>{formErrors.password}</p>
                )}
            </div>

            <button type="submit" data-testid="submit-button">Login</button>

            {loginError && <p data-testid="error-message" style={{ color: "red" }}>{loginError}</p>}
            {token && <p data-testid="success-message">Logged in successfully!</p>}
        </form>
    );
}

export default LoginForm;
