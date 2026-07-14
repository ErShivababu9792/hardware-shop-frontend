import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

// Temporary password — backend banne ke baad ye hata denge, tab real secure login hoga
const ADMIN_PASSWORD = "shop123";

function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();
    const trimmedPassword = password.trim();

    if (trimmedPassword === ADMIN_PASSWORD) {
      localStorage.setItem("isAdminLoggedIn", "true");
      navigate("/admin");
    } else {
      setError("Wrong password. Try again.");
    }
  }

  return (
    <div className="admin-login">
      <form className="admin-login-form" onSubmit={handleLogin}>
        <h2>Admin Login</h2>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) setError("");
          }}
          placeholder="Enter admin password"
          autoComplete="current-password"
          required
        />
        {error && <p className="login-error">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default AdminLogin;