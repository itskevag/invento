import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { removeToken } from "../utils/auth";
import "./AppLayout.css";

export default function AppLayout() {
  const navigate = useNavigate();

  function handleLogout() {
    removeToken();
    navigate("/login");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-icon">I</div>
          <div>
            <h2>Invento</h2>
            <p>Simple Inventory Management</p>
          </div>
        </div>

        <nav className="nav-menu">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/inventory">Inventory</NavLink>
          <NavLink to="/stock-history">Stock History</NavLink>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}