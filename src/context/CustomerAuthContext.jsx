import { createContext, useContext, useState, useEffect } from "react";

const CustomerAuthContext = createContext();
const BACKEND_URL = "";

export function CustomerAuthProvider({ children }) {
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const savedCustomer = localStorage.getItem("customerData");
    if (savedCustomer) {
      setCustomer(JSON.parse(savedCustomer));
    }
  }, []);

  async function signup(name, email, phone, password) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("customerData", JSON.stringify(data.customer));
        setCustomer(data.customer);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error("Signup error:", err);
      return { success: false, message: "Unable to connect to the server. Please try again later." };
    }
  }

  async function login(email, password) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("customerData", JSON.stringify(data.customer));
        setCustomer(data.customer);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, message: "Unable to connect to the server. Please try again later." };
    }
  }

  function logout() {
    localStorage.removeItem("customerData");
    setCustomer(null);
  }

  return (
    <CustomerAuthContext.Provider value={{ customer, signup, login, logout }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  return useContext(CustomerAuthContext);
}