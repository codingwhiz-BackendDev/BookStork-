import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../endpoints/api";
import "../App.css";

const Register = () => {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState({text:"", type:""});
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleSignUp = async () => {

        // Password check
        if (password !== confirmPassword) {
            setMessage({text:"Password does not match...", type:"error"}) 
            setTimeout(() =>{
                setMessage({ text: "", type: "" });
            },1500)
            return;
        }

        try {

            const userData = {
                username,
                email,
                password,
            };

            const res = await register(userData);

            setMessage({text:"Creating account successful...", type:"success"}) 

            // Clear inputs
            setUsername("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");

            // Redirect to login
            navigate("/login");

        } catch (error) {

            setMessage({text:error, type:"error"}) 
            setIsLoading(false);

            setTimeout(() =>{
                setMessage({ text: "", type: "" });
            },1500)
        }
    };

    return (
        <div className="app">

            <div className="glass-card login-card">

                <h1 className="title">
                    Create Account
                </h1>

                <p className="subtitle">
                    Join us and get started
                </p>

                                
                {message.text && (
                    <div className={`message-banner ${message.type}`}>
                        {message.text}
                    </div>
                )}

                <div className="form-grid">

                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) =>
                            setUsername(e.target.value)
                        }
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(e.target.value)
                        }
                    />

                    <button
                        disabled={isLoading}
                        onClick={handleSignUp}
                        className="primary-btn"
                    > 
                        {isLoading ? "Registering..." : "Register"}
                    </button>

                </div>

                <p className="footer-text">
                    Already have an account?{" "}

                    <span>
                        <Link to="/login">
                            Login
                        </Link>
                    </span>

                </p>

            </div>

        </div>
    );
};

export default Register;