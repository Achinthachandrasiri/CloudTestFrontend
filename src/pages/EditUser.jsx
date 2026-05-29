import { useState, useEffect } from "react";
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

  // Fetch existing user data
  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/${id}`);
      const { name, email, age } = res.data.data;
      setFormData({ name, email, age });
      setServerError(null);
    } catch (error) {
      if (error.response) {
        setServerError(error.response.data.message);
      } else if (error.request) {
        setServerError("Cannot connect to server. Make sure backend is running.");
      } else {
        setServerError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.age) {
      newErrors.age = "Age is required";
    } else if (formData.age < 1 || formData.age > 120) {
      newErrors.age = "Age must be between 1 and 120";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setUpdating(true);
      await axios.put(`${process.env.REACT_APP_BASE_URL}/users/${id}`, formData);
      navigate("/");
    } catch (error) {
      if (error.response) {
        setServerError(error.response.data.message);
      } else if (error.request) {
        setServerError("Cannot connect to server. Make sure backend is running.");
      } else {
        setServerError(error.message);
      }
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  if (loading) {
    return <div style={styles.center}>⏳ Loading user data...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>✏️ Edit User</h2>

        {serverError && (
          <div style={styles.serverError}>
            ❌ {serverError}
            <button style={styles.retryBtn} onClick={fetchUser}>
              Retry
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              style={{
                ...styles.input,
                borderColor: errors.name ? "#fc8181" : "#e2e8f0",
              }}
            />
            {errors.name && <p style={styles.errorText}>{errors.name}</p>}
          </div>

          {/* Email */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              style={{
                ...styles.input,
                borderColor: errors.email ? "#fc8181" : "#e2e8f0",
              }}
            />
            {errors.email && <p style={styles.errorText}>{errors.email}</p>}
          </div>

          {/* Age */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter age"
              style={{
                ...styles.input,
                borderColor: errors.age ? "#fc8181" : "#e2e8f0",
              }}
            />
            {errors.age && <p style={styles.errorText}>{errors.age}</p>}
          </div>

          {/* Buttons */}
          <div style={styles.btnGroup}>
            <Link to="/" style={styles.cancelBtn}>
              Cancel
            </Link>
            <button type="submit" style={styles.submitBtn} disabled={updating}>
              {updating ? "Updating..." : "Update User"}
            </button>
          </div>
        </form>
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
  heading: {
    marginBottom: "25px",
    fontSize: "22px",
    color: "#2d3748",
  },
  serverError: {
    backgroundColor: "#fff5f5",
    color: "#c53030",
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "20px",
    border: "1px solid #feb2b2",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  retryBtn: {
    backgroundColor: "#c53030",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  center: {
    textAlign: "center",
    marginTop: "50px",
    fontSize: "18px",
    color: "#718096",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontWeight: "bold",
    color: "#4a5568",
    fontSize: "14px",
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "6px",
    border: "1px solid #e2e8f0",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
  },
  errorText: {
    color: "#e53e3e",
    fontSize: "13px",
    marginTop: "5px",
  },
  btnGroup: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "25px",
  },
  cancelBtn: {
    padding: "10px 20px",
    borderRadius: "6px",
    backgroundColor: "#e2e8f0",
    color: "#4a5568",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "15px",
  },
  submitBtn: {
    padding: "10px 24px",
    borderRadius: "6px",
    backgroundColor: "#ed8936",
    color: "#fff",
    border: "none",
    fontWeight: "bold",
    fontSize: "15px",
    cursor: "pointer",
  },
};

export default EditUser;