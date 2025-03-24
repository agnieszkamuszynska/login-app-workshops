import { useState } from "react";
import { loginUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

type FormErrors = {
    email?: string;
    password?: string;
};

function LoginForm() {
    const navigate = useNavigate();
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
            navigate("/dashboard", { state: { token } });
        } catch (err: any) {
            setLoginError(err.message);
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} noValidate style={styles.form}>
                <h1>Log In</h1>
                <p>Enter your email and password</p>

                <div style={styles.field}>
                    <input
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                        data-testid="email-input"
                    />
                    {formErrors.email && (
                        <p data-testid="email-error" style={styles.error}>{formErrors.email}</p>
                    )}
                </div>

                <div style={styles.field}>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        data-testid="password-input"
                    />
                    {formErrors.password && (
                        <p data-testid="password-error" style={styles.error}>{formErrors.password}</p>
                    )}
                </div>

                <button type="submit" style={styles.button} data-testid="submit-button">Login</button>

                {loginError && <p data-testid="error-message" style={styles.error}>{loginError}</p>}
                {token && <p data-testid="success-message" style={styles.success}>Logged in successfully!</p>}
            </form>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f8f9fa",
    },
    form: {
        backgroundColor: "#fff",
        padding: "2rem",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        width: "300px",
        textAlign: "center",
    },
    field: {
        marginBottom: "1rem",
        textAlign: "left",
    },
    input: {
        width: "100%",
        padding: "0.5rem",
        fontSize: "1rem",
        borderRadius: "4px",
        border: "1px solid #ccc",
    },
    button: {
        padding: "0.5rem 1rem",
        fontSize: "1rem",
        borderRadius: "4px",
        border: "none",
        backgroundColor: "#007bff",
        color: "#fff",
        cursor: "pointer",
        marginTop: "0.5rem",
        width: "100%",
    },
    error: {
        color: "red",
        fontSize: "0.9rem",
        marginTop: "0.25rem",
    },
    success: {
        color: "green",
        marginTop: "1rem",
    },
};

export default LoginForm;
