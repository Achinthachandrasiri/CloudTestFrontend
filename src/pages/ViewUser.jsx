import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const ViewUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/${id}`);
      setUser(res.data.data);
      setError(null);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else if (error.request) {
        setError("Cannot connect to server. Make sure backend is running.");
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/users/${id}`);
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete user");
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  if (loading) {
    return <div style={styles.center}>⏳ Loading user details...</div>;
  }

  if (error) {
    return (
      <div style={styles.errorBox}>
        ❌ {error}
        <div style={styles.errorActions}>
          <button style={styles.retryBtn} onClick={fetchUser}>
            Retry
          </button>
          <Link to="/" style={styles.backBtn}>
            ← Back to Users
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.heading}>👤 User Details</h2>
          <Link to="/" style={styles.backBtn}>
            ← Back
          </Link>
        </div>

        {/* Avatar */}
        <div style={styles.avatarBox}>
          <div style={styles.avatar}>
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* User Info */}
        <div style={styles.infoBox}>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>👤 Name</span>
            <span style={styles.infoValue}>{user.name}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>📧 Email</span>
            <span style={styles.infoValue}>{user.email}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>🎂 Age</span>
            <span style={styles.infoValue}>{user.age} years</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>📅 Created At</span>
            <span style={styles.infoValue}>
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>🔄 Updated At</span>
            <span style={styles.infoValue}>
              {new Date(user.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={styles.btnGroup}>
          <Link to={`/edit/${user._id}`} style={styles.editBtn}>
            ✏️ Edit User
          </Link>
          <button style={styles.deleteBtn} onClick={handleDelete}>
            🗑 Delete User
          </button>
        </div>

      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    marginTop: "30px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "35px",
    borderRadius: "10px",
    boxShadow: "0 2px 15px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "500px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },
  heading: {
    fontSize: "22px",
    color: "#2d3748",
    margin: 0,
  },
  backBtn: {
    backgroundColor: "#e2e8f0",
    color: "#4a5568",
    padding: "8px 16px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "14px",
  },
  avatarBox: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "25px",
  },
  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: "#4299e1",
    color: "#fff",
    fontSize: "36px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  infoBox: {
    backgroundColor: "#f7fafc",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "25px",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #e2e8f0",
  },
  infoLabel: {
    fontWeight: "bold",
    color: "#718096",
    fontSize: "14px",
  },
  infoValue: {
    color: "#2d3748",
    fontSize: "15px",
  },
  btnGroup: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
  },
  editBtn: {
    padding: "10px 20px",
    borderRadius: "6px",
    backgroundColor: "#ed8936",
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "15px",
  },
  deleteBtn: {
    padding: "10px 20px",
    borderRadius: "6px",
    backgroundColor: "#fc8181",
    color: "#fff",
    border: "none",
    fontWeight: "bold",
    fontSize: "15px",
    cursor: "pointer",
  },
  center: {
    textAlign: "center",
    marginTop: "50px",
    fontSize: "18px",
    color: "#718096",
  },
  errorBox: {
    backgroundColor: "#fff5f5",
    color: "#c53030",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #feb2b2",
  },
  errorActions: {
    display: "flex",
    gap: "12px",
    marginTop: "12px",
  },
  retryBtn: {
    backgroundColor: "#c53030",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default ViewUser;