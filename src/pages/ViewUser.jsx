import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const ViewUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ FIXED: stable function
  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/users/${id}`
      );

      setUser(res.data.data);
      setError(null);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Cannot connect to server. Make sure backend is running."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/users/${id}`
      );

      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete user");
    }
  };

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
        <div style={styles.header}>
          <h2>👤 User Details</h2>

          <Link to="/" style={styles.backBtn}>
            ← Back
          </Link>
        </div>

        <div style={styles.infoBox}>
          <p><b>Name:</b> {user.name}</p>
          <p><b>Email:</b> {user.email}</p>
          <p><b>Age:</b> {user.age}</p>
        </div>

        <div style={styles.btnGroup}>
          <Link to={`/edit/${user._id}`} style={styles.editBtn}>
            ✏️ Edit
          </Link>

          <button onClick={handleDelete} style={styles.deleteBtn}>
            🗑 Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewUser;