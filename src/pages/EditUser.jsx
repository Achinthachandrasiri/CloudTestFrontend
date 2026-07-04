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

  // ✅ FIXED: stable function
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

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)
    ) {
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

      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/users/${id}`,
        formData
      );

      navigate("/");
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          "Cannot connect to server. Make sure backend is running."
      );
    } finally {
      setUpdating(false);
    }
  };

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
          <div style={styles.formGroup}>
            <label style={styles.label}>Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.name && <p style={styles.errorText}>{errors.name}</p>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.email && <p style={styles.errorText}>{errors.email}</p>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Age</label>
            <input
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.age && <p style={styles.errorText}>{errors.age}</p>}
          </div>

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

export default EditUser;