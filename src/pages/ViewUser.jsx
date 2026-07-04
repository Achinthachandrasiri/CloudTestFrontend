import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const ViewUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          "Cannot connect to server"
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleDelete = async () => {
    if (!window.confirm("Delete user?")) return;

    try {
      await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/users/${id}`
      );
      navigate("/");
    } catch (error) {
      alert("Failed to delete");
    }
  };

  if (loading) return <div style={styles.center}>Loading...</div>;

  if (error)
    return (
      <div style={styles.error}>
        {error}
        <button onClick={fetchUser}>Retry</button>
      </div>
    );

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <p>{user.age}</p>

        <div style={styles.btnRow}>
          <Link to={`/edit/${user._id}`} style={styles.edit}>
            Edit
          </Link>

          <button onClick={handleDelete} style={styles.delete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewUser;

/* ✅ STYLES FIXED */
const styles = {
  container: { display: "flex", justifyContent: "center", marginTop: 30 },
  card: {
    width: 400,
    padding: 20,
    background: "#fff",
    borderRadius: 10,
  },
  btnRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 10,
  },
  edit: {
    background: "orange",
    padding: 10,
    color: "#fff",
    textDecoration: "none",
  },
  delete: {
    background: "red",
    padding: 10,
    color: "#fff",
    border: "none",
  },
  error: {
    padding: 20,
    background: "#ffe5e5",
  },
  center: {
    textAlign: "center",
  },
};