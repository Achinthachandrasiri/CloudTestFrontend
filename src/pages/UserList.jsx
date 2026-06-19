import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/users`);
      setUsers(res.data.data);
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/users/${id}`);
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingWrapper}>
        <div style={styles.spinner} />
        <p style={styles.loadingText}>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorBox}>
        <div style={styles.errorIcon}>!</div>
        <div style={styles.errorContent}>
          <p style={styles.errorTitle}>Something went wrong</p>
          <p style={styles.errorMessage}>{error}</p>
        </div>
        <button style={styles.retryBtn} onClick={fetchUsers}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.heading}>Hello Mother Achintha BRO</h2>
          <p style={styles.subheading}>{users.length} user{users.length !== 1 ? "s" : ""} registered</p>
        </div>
        <Link to="/create" style={styles.createBtn}>
          + New User
        </Link>
      </div>

      {users.length === 0 ? (
        <div style={styles.emptyBox}>
          <div style={styles.emptyIcon}>👤</div>
          <p style={styles.emptyTitle}>No users yet</p>
          <p style={styles.emptySubtitle}>Get started by creating your first user.</p>
          <Link to="/create" style={styles.createBtn}>
            + Create First User
          </Link>
        </div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.th, width: "48px" }}>#</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={{ ...styles.th, width: "80px" }}>Age</th>
                <th style={{ ...styles.th, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id} style={styles.tr}>
                  <td style={{ ...styles.td, color: "#a0aec0", fontVariantNumeric: "tabular-nums" }}>
                    {String(index + 1).padStart(2, "0")}
                  </td>
                  <td style={styles.td}>
                    <div style={styles.nameCell}>
                      <div style={{ ...styles.avatar, background: avatarColor(user.name) }}>
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <span style={styles.nameText}>{user.name}</span>
                    </div>
                  </td>
                  <td style={{ ...styles.td, color: "#718096" }}>{user.email}</td>
                  <td style={styles.td}>
                    <span style={styles.ageBadge}>{user.age}</span>
                  </td>
                  <td style={{ ...styles.td, textAlign: "right" }}>
                    <div style={styles.actions}>
                      <Link to={`/view/${user._id}`} style={styles.viewBtn} title="View">
                        👁 View
                      </Link>
                      <Link to={`/edit/${user._id}`} style={styles.editBtn} title="Edit">
                        ✏️ Edit
                      </Link>
                      <button
                        style={styles.deleteBtn}
                        onClick={() => handleDelete(user._id)}
                        title="Delete"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const avatarColors = ["#667eea", "#48bb78", "#ed8936", "#f687b3", "#4299e1", "#9f7aea", "#38b2ac"];
const avatarColor = (name = "") => avatarColors[name.charCodeAt(0) % avatarColors.length];

const styles = {
  wrapper: {
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  headerRow: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: "24px",
  },
  heading: {
    margin: "0 0 4px",
    fontSize: "22px",
    fontWeight: "700",
    color: "#1a202c",
    letterSpacing: "-0.3px",
  },
  subheading: {
    margin: 0,
    fontSize: "13px",
    color: "#a0aec0",
    fontWeight: "400",
  },
  loadingWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "80px 0",
    gap: "16px",
  },
  spinner: {
    width: "32px",
    height: "32px",
    border: "3px solid #e2e8f0",
    borderTop: "3px solid #4299e1",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: {
    margin: 0,
    fontSize: "14px",
    color: "#a0aec0",
  },
  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    backgroundColor: "#fff5f5",
    border: "1px solid #fed7d7",
    borderRadius: "12px",
    padding: "20px 24px",
  },
  errorIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "#fc8181",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "18px",
    flexShrink: 0,
  },
  errorContent: {
    flex: 1,
  },
  errorTitle: {
    margin: "0 0 2px",
    fontWeight: "600",
    fontSize: "14px",
    color: "#c53030",
  },
  errorMessage: {
    margin: 0,
    fontSize: "13px",
    color: "#e53e3e",
  },
  retryBtn: {
    backgroundColor: "#c53030",
    color: "#fff",
    border: "none",
    padding: "8px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    flexShrink: 0,
  },
  emptyBox: {
    textAlign: "center",
    padding: "64px 32px",
    backgroundColor: "#f7fafc",
    borderRadius: "16px",
    border: "1.5px dashed #e2e8f0",
  },
  emptyIcon: {
    fontSize: "40px",
    marginBottom: "12px",
  },
  emptyTitle: {
    margin: "0 0 6px",
    fontSize: "17px",
    fontWeight: "600",
    color: "#2d3748",
  },
  emptySubtitle: {
    margin: "0 0 24px",
    fontSize: "14px",
    color: "#a0aec0",
  },
  createBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    backgroundColor: "#4299e1",
    color: "#fff",
    padding: "9px 18px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "14px",
    transition: "background 0.15s",
  },
  tableWrapper: {
    borderRadius: "14px",
    overflow: "hidden",
    border: "1px solid #e8edf2",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
  },
  th: {
    padding: "13px 18px",
    textAlign: "left",
    fontSize: "11px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    color: "#a0aec0",
    backgroundColor: "#f8fafc",
    borderBottom: "1px solid #e8edf2",
  },
  tr: {
    borderBottom: "1px solid #f0f4f8",
    transition: "background 0.1s",
  },
  td: {
    padding: "14px 18px",
    fontSize: "14px",
    color: "#2d3748",
    verticalAlign: "middle",
  },
  nameCell: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: "700",
    flexShrink: 0,
  },
  nameText: {
    fontWeight: "500",
    color: "#1a202c",
  },
  ageBadge: {
    display: "inline-block",
    backgroundColor: "#ebf8ff",
    color: "#2b6cb0",
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },
  actions: {
    display: "flex",
    gap: "6px",
    justifyContent: "flex-end",
  },
  viewBtn: {
    backgroundColor: "#f0fff4",
    color: "#276749",
    padding: "6px 13px",
    borderRadius: "7px",
    textDecoration: "none",
    fontSize: "12px",
    fontWeight: "600",
    border: "1px solid #c6f6d5",
  },
  editBtn: {
    backgroundColor: "#fffaf0",
    color: "#975a16",
    padding: "6px 13px",
    borderRadius: "7px",
    textDecoration: "none",
    fontSize: "12px",
    fontWeight: "600",
    border: "1px solid #feebc8",
  },
  deleteBtn: {
    backgroundColor: "#fff5f5",
    color: "#c53030",
    padding: "6px 13px",
    borderRadius: "7px",
    border: "1px solid #fed7d7",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
  },
};

export default UserList;