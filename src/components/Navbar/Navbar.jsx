import { useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const NavBar = () => {
  const { cartList } = useSelector((state) => state.cart);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [expand, setExpand] = useState(false);
  const [isFixed, setIsFixed] = useState(false);

  window.addEventListener("scroll", () => {
    if (window.scrollY >= 100) setIsFixed(true);
    else if (window.scrollY <= 50) setIsFixed(false);
  });

  const handleLogout = async () => {
    try {
      await fetch("http://127.0.0.1:8000/api/auth/logout/", {
        method: "POST",
        headers: { Authorization: `Token ${user.token}` },
      });
    } catch {}
    logout();
    toast.success("Logged out successfully.");
    navigate("/");
  };

  return (
    <Navbar fixed="top" expand="md" className={isFixed ? "navbar fixed" : "navbar"}>
      <Container className="navbar-container">
        <Navbar.Brand to="/">
          <ion-icon name="bag"></ion-icon>
          <h1 className="logo">Multimart</h1>
        </Navbar.Brand>
        <div className="d-flex align-items-center gap-2">
          <div className="media-cart">
            <Link aria-label="Cart" to="/cart" className="cart" data-num={cartList.length}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" className="nav-icon">
                <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
              </svg>
            </Link>
          </div>
          <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpand(expand ? false : "expanded")}>
            <span></span><span></span><span></span>
          </Navbar.Toggle>
        </div>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="justify-content-end flex-grow-1 pe-3">
            <Nav.Item><Link className="navbar-link" to="/" onClick={() => setExpand(false)}><span className="nav-link-label">Home</span></Link></Nav.Item>
            <Nav.Item><Link className="navbar-link" to="/shop" onClick={() => setExpand(false)}><span className="nav-link-label">Shop</span></Link></Nav.Item>
            <Nav.Item><Link className="navbar-link" to="/cart" onClick={() => setExpand(false)}><span className="nav-link-label">Cart ({cartList.length})</span></Link></Nav.Item>
            {user ? (
              <>
                <Nav.Item><Link className="navbar-link" to="/addresses" onClick={() => setExpand(false)}><span className="nav-link-label">Address</span></Link></Nav.Item>
                <Nav.Item><span className="navbar-link nav-user"><span className="nav-link-label">Hi, {user.username}</span></span></Nav.Item>
                <Nav.Item><button className="navbar-link nav-logout-btn" onClick={handleLogout}><span className="nav-link-label">Logout</span></button></Nav.Item>
              </>
            ) : (
              <>
                <Nav.Item><Link className="navbar-link" to="/login" onClick={() => setExpand(false)}><span className="nav-link-label">Login</span></Link></Nav.Item>
                <Nav.Item><Link className="navbar-link nav-register" to="/register" onClick={() => setExpand(false)}><span className="nav-link-label">Register</span></Link></Nav.Item>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
