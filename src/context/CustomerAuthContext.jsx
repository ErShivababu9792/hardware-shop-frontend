import { createContext, useContext, useState, useEffect } from "react";

const CustomerAuthContext = createContext();

export function CustomerAuthProvider({ children }) {
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const savedCustomer = localStorage.getItem("customerData");
    if (savedCustomer) {
      setCustomer(JSON.parse(savedCustomer));
    }
  }, []);

  function signup(name, email, phone, password) {
    const existingCustomers = JSON.parse(localStorage.getItem("allCustomers")) || [];

    const alreadyExists = existingCustomers.find((c) => c.email === email);
    if (alreadyExists) {
      return { success: false, message: "Is email se pehle se account bana hua hai" };
    }

    const newCustomer = { name, email, phone, password };
    existingCustomers.push(newCustomer);
    localStorage.setItem("allCustomers", JSON.stringify(existingCustomers));

    const customerToStore = { name, email, phone };
    localStorage.setItem("customerData", JSON.stringify(customerToStore));
    setCustomer(customerToStore);

    return { success: true };
  }

  function login(email, password) {
    const existingCustomers = JSON.parse(localStorage.getItem("allCustomers")) || [];
    const found = existingCustomers.find((c) => c.email === email && c.password === password);

    if (!found) {
      return { success: false, message: "Email ya password galat hai" };
    }

    const customerToStore = { name: found.name, email: found.email, phone: found.phone };
    localStorage.setItem("customerData", JSON.stringify(customerToStore));
    setCustomer(customerToStore);

    return { success: true };
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