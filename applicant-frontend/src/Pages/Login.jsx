import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/applicant/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // Save JWT token
      localStorage.setItem("token", data.token);

      // Save applicant information
      localStorage.setItem(
        "applicant",
        JSON.stringify(data.applicant)
      );

      // Go to dashboard
      navigate("/dashboard");

    } catch (error) {
      console.error(error);

      setError("Unable to connect to server");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="logo login-logo">
          <div className="logo-icon">C</div>
          <span>CareerConnect</span>
        </div>

        <h1>Welcome Back</h1>

        <p>
          Login to continue your job search.
        </p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>

          <label>Email Address</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="register-text">
          Don't have an account?

          <Link to="/register">
            <span> Register</span>
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;