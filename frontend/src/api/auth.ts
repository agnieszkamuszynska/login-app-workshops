//This function checks a user by sending their login details to a server and returning a token for login
export async function loginUser(email: string, password: string): Promise<string> {
    try {
        const response = await fetch("http://localhost:8000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.detail || "Login failed");
        }

        // Read the response
        const data = await response.json();
        return data.token;

    } catch (err: any) {
        // Handle fetch-level issues (network failure, CORS, etc.)
        if (err.name === "TypeError") {
            throw new Error("Oops! Something went wrong. Please try again later.");
        }

        throw err;
    }
}
