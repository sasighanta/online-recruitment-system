import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/applicant/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      setMessage(data.message);

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.error(error);
      setError("Unable to connect to server");
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="logo login-logo">
          <div className="logo-icon">C</div>
          <span>CareerConnect</span>
        </div>

        <h1>Create Account</h1>

        <p>
          Create your applicant account to find your next opportunity.
        </p>

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>

          <label>Full Name</label>

          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Email Address</label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Phone Number</label>

          <input
            type="text"
            name="phone"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
          />

          <label>Password</label>

          <input
            type="password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="login-btn"
          >
            Create Account
          </button>

        </form>

        <p className="register-text">
          Already have an account?
          <Link to="/login">
            <span> Login</span>
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Register;