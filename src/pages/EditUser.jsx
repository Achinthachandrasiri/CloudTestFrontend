import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [serverError, setServerError] = useState(null);

  const fetchUser = useCallback(async () => {
    setLoading(true);

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/users/${id}`
      );

      const { name, email, age } = res.data.data;
      setFormData({ name, email, age });
      setServerError(null);
    } catch (error) {
      setServerError(
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);

      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/users/${id}`,
        formData
      );

      navigate("/");
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          "Cannot connect to server"
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div style={styles.center}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Edit User</h2>

        {serverError && (
          <div style={styles.error}>
            {serverError}
            <button onClick={fetchUser}>Retry</button>
          </div>
        )}

        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="age"
          value={formData.age}
          onChange={handleChange}
          style={styles.input}
        />

        <div style={styles.btnRow}>
          <Link to="/" style={styles.cancel}>Cancel</Link>

          <button onClick={handleSubmit} style={styles.save}>
            {updating ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUser;

/* ✅ STYLES (THIS WAS MISSING BEFORE) */
const styles = {
  container: { display: "flex", justifyContent: "center", marginTop: 30 },
  card: {
    width: 400,
    padding: 20,
    background: "#fff",
    borderRadius: 10,
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  input: {
    width: "100%",
    padding: 10,
    margin: "10px 0",
  },
  btnRow: {
    display: "flex",
    justifyContent: "space-between",
  },
  cancel: {
    padding: 10,
    background: "#ccc",
    textDecoration: "none",
  },
  save: {
    padding: 10,
    background: "orange",
    border: "none",
    color: "#fff",
  },
  error: {
    background: "#ffe5e5",
    padding: 10,
    marginBottom: 10,
  },
  center: {
    textAlign: "center",
  },
};