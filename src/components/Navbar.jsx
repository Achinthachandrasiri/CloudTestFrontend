import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        <Link to="/" style={styles.brandLink}>
          👥 User Manager
        </Link>
      </div>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>
          All Users
        </Link>
        <Link to="/create" style={styles.createBtn}>
          + Create User
        </Link>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2d3748",
    padding: "15px 30px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
  },
  brand: {
    fontSize: "20px",
    fontWeight: "bold",
  },
  brandLink: {
    color: "#fff",
    textDecoration: "none",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  link: {
    color: "#cbd5e0",
    textDecoration: "none",
    fontSize: "15px",
  },
  createBtn: {
    backgroundColor: "#4299e1",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: "6px",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "bold",
  },
};

export default Navbar;