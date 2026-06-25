import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, User, LogOut, Boxes } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <nav className="navbar">
      <NavLink to="/dashboard" className="navbar-brand">
        <span className="logo-mark"><Boxes size={16} /></span>
        Inventaris
      </NavLink>

      <div className="navbar-menu">
        <NavLink to="/dashboard" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={16} /> <span className="nav-label">Dashboard</span>
        </NavLink>
        <NavLink to="/products" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <Package size={16} /> <span className="nav-label">Produk</span>
        </NavLink>
        <NavLink to="/profile" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <User size={16} /> <span className="nav-label">Profil</span>
        </NavLink>

        <div className="nav-divider" />

        <div className="nav-user">
          <div className="avatar">{initials}</div>
          <span style={{fontSize:'0.85rem'}}>{user?.name?.split(' ')[0]}</span>
        </div>

        <button className="btn-logout" onClick={handleLogout}>
          <LogOut size={14} /> Keluar
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
