import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCustomerAuth } from "../context/CustomerAuthContext";
import "./CustomerSignup.css";

function CustomerLogin() {
  const { login } = useCustomerAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate("/");
    } else {
      setError(result.message);
    }
  }

  return (
    <div className="customer-auth-page">
      <form className="customer-auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <label>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>Password</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />

        {error && <p className="auth-error">{error}</p>}

        <button type="submit">Login</button>

        <p className="auth-switch-link">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </form>
    </div>
  );
}

export default CustomerLogin;