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
    return <div style={styles.center}>⏳ Loading users...</div>;
  }

  if (error) {
    return (
      <div style={styles.errorBox}>
        ❌ {error}
        <button style={styles.retryBtn} onClick={fetchUsers}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 style={styles.heading}>All Users</h2>

      {users.length === 0 ? (
        <div style={styles.emptyBox}>
          <p>No users found.</p>
          <Link to="/create" style={styles.createBtn}>
            + Create First User
          </Link>
        </div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHead}>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Age</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id} style={styles.tr}>
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}>{user.name}</td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>{user.age}</td>
                <td style={styles.td}>
                  <div style={styles.actions}>
                    <Link to={`/view/${user._id}`} style={styles.viewBtn}>
                      👁 View
                    </Link>
                    <Link to={`/edit/${user._id}`} style={styles.editBtn}>
                      ✏️ Edit
                    </Link>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => handleDelete(user._id)}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles = {
  heading: {
    marginBottom: "20px",
    fontSize: "24px",
    color: "#2d3748",
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
    display: "flex",
    alignItems: "center",
    gap: "15px",
    border: "1px solid #feb2b2",
  },
  retryBtn: {
    backgroundColor: "#c53030",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  emptyBox: {
    textAlign: "center",
    padding: "50px",
    backgroundColor: "#f7fafc",
    borderRadius: "8px",
    color: "#718096",
  },
  createBtn: {
    backgroundColor: "#4299e1",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "bold",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  tableHead: {
    backgroundColor: "#2d3748",
    color: "#fff",
  },
  th: {
    padding: "14px 16px",
    textAlign: "left",
    fontWeight: "bold",
  },
  tr: {
    borderBottom: "1px solid #e2e8f0",
  },
  td: {
    padding: "12px 16px",
    color: "#4a5568",
  },
  actions: {
    display: "flex",
    gap: "8px",
  },
  viewBtn: {
    backgroundColor: "#48bb78",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: "5px",
    textDecoration: "none",
    fontSize: "13px",
  },
  editBtn: {
    backgroundColor: "#ed8936",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: "5px",
    textDecoration: "none",
    fontSize: "13px",
  },
  deleteBtn: {
    backgroundColor: "#fc8181",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontSize: "13px",
  },
};

export default UserList;