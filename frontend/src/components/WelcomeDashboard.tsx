import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

type DecodedToken = {
    user_id: number;
    user_name: string;
    exp: number;
    iat: number;
};

function WelcomeDashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const [token, setToken] = useState("");
    const [userId, setUserId] = useState<number | null>(null);
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        const tokenFromState = location.state?.token;
        if (!tokenFromState) {
            navigate("/"); // redirect if token missing
            return;
        }

        setToken(tokenFromState);

        try {
            const decoded: DecodedToken = jwtDecode(tokenFromState);
            setUserId(decoded.user_id);
            setUserName(decoded.user_name);
        } catch (err) {
            console.error("Invalid token");
            navigate("/");
        }
    }, [location, navigate]);

    const handleLogout = () => {
        setToken("");
        setUserId(null);
        setUserName(null);
        navigate("/");
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.heading}>Welcome, {userName} 🎉</h1>
                <p style={styles.info}>🆔 User ID: <strong>{userId}</strong></p>
                <p style={styles.info}>👤 Username: <strong>{userName}</strong></p>
                <p style={styles.token}>🔐 Token: <code>{token.substring(0, 12)}...</code></p>
                <p style={styles.success}>✅ You are logged in!</p>
                <button onClick={handleLogout} style={styles.button}>
                    Logout
                </button>
            </div>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f3f4f6",
    },
    card: {
        backgroundColor: "#fff",
        padding: "2rem",
        borderRadius: "8px",
        boxShadow: "0 0 12px rgba(0,0,0,0.1)",
        textAlign: "center",
        width: "360px",
    },
    heading: {
        fontSize: "1.8rem",
        marginBottom: "1rem",
    },
    info: {
        fontSize: "1rem",
        marginBottom: "0.5rem",
    },
    token: {
        fontSize: "0.85rem",
        margin: "0.5rem 0",
        color: "#666",
    },
    success: {
        color: "green",
        marginTop: "1rem",
        fontWeight: "bold",
    },
    button: {
        marginTop: "1.5rem",
        padding: "0.5rem 1rem",
        fontSize: "1rem",
        borderRadius: "4px",
        border: "none",
        backgroundColor: "#dc3545",
        color: "#fff",
        cursor: "pointer",
    },
};

export default WelcomeDashboard;
