import { useState } from "react"; 
import { login } from "../endpoints/api";
import { useNavigate, Link } from "react-router-dom"
import "../App.css";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState({text:"", type:""});
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate(); 

    const handleLogin = async () => {

        setIsLoading(true);
        setMessage({ text: "", type: "" });
        
        try {
            await login(username, password); 

            setMessage({text:"Login successful! Redirecting...", type:"success"}) 

            setTimeout(()=>{
                navigate("/home");
            }, 1500)
            

        } catch (error) {

            setMessage({text:"Invalid username or password...", type:"error"})
            setIsLoading(false);

            setTimeout(() =>{
                setMessage({ text: "", type: "" });
            },1500)
        }
    };

    return (
        <div className="app">
            <div className="glass-card login-card">
                <h1 className="title">Welcome Back</h1>
                <p className="subtitle">Login to continue</p>

                
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
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button disabled={isLoading} onClick={handleLogin} className="primary-btn">
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                </div>

                <p className="footer-text">
                    Don’t have an account? <span><Link to="/register">Sign Up</Link> </span>

                </p>
            </div>
        </div>
    );
};

export default Login;