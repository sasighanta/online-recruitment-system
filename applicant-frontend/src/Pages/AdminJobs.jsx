import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminJobs() {
  const navigate = useNavigate();

  const emptyForm = {
    title: "",
    company: "",
    location: "",
    salary: "",
    job_type: "",
    description: "",
    requirements: ""
  };

  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  const fetchJobs = async () => {
    const token = localStorage.getItem("adminToken");

    try {
      const response = await fetch("http://localhost:5000/api/admin/jobs", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setJobs(data.jobs || []);
      }
    } catch (error) {
      setMessage("Unable to load jobs");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("adminToken");

    const url = editingId
      ? `http://localhost:5000/api/admin/jobs/${editingId}`
      : "http://localhost:5000/api/admin/jobs";

    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Operation failed");
        return;
      }

      setMessage(data.message);
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      fetchJobs();
    } catch (error) {
      setMessage("Unable to connect to server");
    }
  };

  const handleEdit = (job) => {
    setForm({
      title: job.title || "",
      company: job.company || "",
      location: job.location || "",
      salary: job.salary || "",
      job_type: job.job_type || "",
      description: job.description || "",
      requirements: job.requirements || ""
    });

    setEditingId(job.id);
    setShowForm(true);
    setMessage("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this job?");

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem("adminToken");

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/jobs/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      setMessage(data.message);

      if (response.ok) {
        fetchJobs();
      }
    } catch (error) {
      setMessage("Unable to connect to server");
    }
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setMessage("");
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div>
          <div style={styles.logo}>CareerConnect</div>
          <div style={styles.adminLabel}>ADMIN PANEL</div>

          <nav style={styles.nav}>
            <Link to="/admin/dashboard" style={styles.link}>
              Dashboard
            </Link>
            <Link to="/admin/jobs" style={styles.activeLink}>
              Jobs
            </Link>
            <Link to="/admin/applications" style={styles.link}>
              Applications
            </Link>
            <Link to="/admin/applicants" style={styles.link}>
              Applicants
            </Link>
          </nav>
        </div>

        <button onClick={logout} style={styles.logout}>
          Logout
        </button>
      </aside>

      <main style={styles.main}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.heading}>Manage Jobs</h1>
            <p style={styles.subtitle}>
              Create and manage available job opportunities
            </p>
          </div>

          <button
            style={styles.addButton}
            onClick={() => {
              setForm(emptyForm);
              setEditingId(null);
              setShowForm(true);
              setMessage("");
            }}
          >
            + Add Job
          </button>
        </div>

        {message && <div style={styles.message}>{message}</div>}

        {showForm && (
          <div style={styles.formCard}>
            <h2 style={styles.formTitle}>
              {editingId ? "Edit Job" : "Add New Job"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={styles.formGrid}>
                <input
                  style={styles.input}
                  name="title"
                  placeholder="Job Title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />

                <input
                  style={styles.input}
                  name="company"
                  placeholder="Company"
                  value={form.company}
                  onChange={handleChange}
                  required
                />

                <input
                  style={styles.input}
                  name="location"
                  placeholder="Location"
                  value={form.location}
                  onChange={handleChange}
                />

                <input
                  style={styles.input}
                  name="salary"
                  placeholder="Salary"
                  value={form.salary}
                  onChange={handleChange}
                />

                <input
                  style={styles.input}
                  name="job_type"
                  placeholder="Job Type"
                  value={form.job_type}
                  onChange={handleChange}
                />
              </div>

              <textarea
                style={styles.textarea}
                name="description"
                placeholder="Job Description"
                value={form.description}
                onChange={handleChange}
              />

              <textarea
                style={styles.textarea}
                name="requirements"
                placeholder="Requirements"
                value={form.requirements}
                onChange={handleChange}
              />

              <div style={styles.formActions}>
                <button type="submit" style={styles.saveButton}>
                  {editingId ? "Update Job" : "Create Job"}
                </button>

                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <span>Job</span>
            <span>Company</span>
            <span>Location</span>
            <span>Type</span>
            <span>Salary</span>
            <span>Actions</span>
          </div>

          {jobs.length === 0 ? (
            <div style={styles.empty}>
              No jobs available
            </div>
          ) : (
            jobs.map((job) => (
              <div style={styles.tableRow} key={job.id}>
                <span>{job.title}</span>
                <span>{job.company}</span>
                <span>{job.location || "-"}</span>
                <span>{job.job_type || "-"}</span>
                <span>{job.salary || "-"}</span>

                <div style={styles.actions}>
                  <button
                    style={styles.editButton}
                    onClick={() => handleEdit(job)}
                  >
                    Edit
                  </button>

                  <button
                    style={styles.deleteButton}
                    onClick={() => handleDelete(job.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    background: "#09080f",
    color: "#ffffff",
    fontFamily: "Arial, sans-serif"
  },
  sidebar: {
    width: "230px",
    minHeight: "100vh",
    boxSizing: "border-box",
    padding: "28px 20px",
    background: "#111019",
    borderRight: "1px solid #292533",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },
  logo: {
    fontSize: "21px",
    fontWeight: "700",
    marginBottom: "5px"
  },
  adminLabel: {
    fontSize: "11px",
    color: "#8b5cf6",
    letterSpacing: "1.5px",
    marginBottom: "35px"
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  link: {
    color: "#a5a1b2",
    textDecoration: "none",
    padding: "12px 14px",
    borderRadius: "8px"
  },
  activeLink: {
    color: "#ffffff",
    textDecoration: "none",
    padding: "12px 14px",
    borderRadius: "8px",
    background: "#8b5cf6"
  },
  logout: {
    border: "1px solid #393341",
    background: "transparent",
    color: "#d6d2df",
    padding: "11px",
    borderRadius: "8px",
    cursor: "pointer"
  },
  main: {
    flex: 1,
    padding: "40px",
    overflowY: "auto"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px"
  },
  heading: {
    margin: 0,
    fontSize: "30px"
  },
  subtitle: {
    color: "#8f8a9d",
    marginTop: "8px"
  },
  addButton: {
    background: "#8b5cf6",
    color: "#ffffff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px"
  },
  message: {
    padding: "12px 16px",
    background: "#181522",
    border: "1px solid #342c43",
    borderRadius: "8px",
    marginBottom: "20px"
  },
  formCard: {
    background: "#111019",
    border: "1px solid #292533",
    borderRadius: "12px",
    padding: "25px",
    marginBottom: "25px"
  },
  formTitle: {
    marginTop: 0,
    marginBottom: "20px"
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "15px"
  },
  input: {
    boxSizing: "border-box",
    width: "100%",
    padding: "12px",
    background: "#09080f",
    color: "#ffffff",
    border: "1px solid #302b3a",
    borderRadius: "7px"
  },
  textarea: {
    boxSizing: "border-box",
    width: "100%",
    minHeight: "100px",
    marginTop: "15px",
    padding: "12px",
    background: "#09080f",
    color: "#ffffff",
    border: "1px solid #302b3a",
    borderRadius: "7px",
    resize: "vertical"
  },
  formActions: {
    display: "flex",
    gap: "12px",
    marginTop: "18px"
  },
  saveButton: {
    background: "#8b5cf6",
    color: "#ffffff",
    border: "none",
    padding: "11px 20px",
    borderRadius: "7px",
    cursor: "pointer"
  },
  cancelButton: {
    background: "transparent",
    color: "#ffffff",
    border: "1px solid #393341",
    padding: "11px 20px",
    borderRadius: "7px",
    cursor: "pointer"
  },
  tableCard: {
    background: "#111019",
    border: "1px solid #292533",
    borderRadius: "12px",
    overflow: "hidden"
  },
  tableHeader: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1.2fr 1fr 1fr 1fr 1.2fr",
    gap: "15px",
    padding: "18px 20px",
    borderBottom: "1px solid #292533",
    color: "#9691a3",
    fontSize: "13px"
  },
  tableRow: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1.2fr 1fr 1fr 1fr 1.2fr",
    gap: "15px",
    alignItems: "center",
    padding: "18px 20px",
    borderBottom: "1px solid #211e29",
    fontSize: "14px"
  },
  actions: {
    display: "flex",
    gap: "8px"
  },
  editButton: {
    background: "#27213a",
    color: "#c4b5fd",
    border: "1px solid #493b68",
    padding: "7px 10px",
    borderRadius: "6px",
    cursor: "pointer"
  },
  deleteButton: {
    background: "#301b24",
    color: "#fca5a5",
    border: "1px solid #5a2935",
    padding: "7px 10px",
    borderRadius: "6px",
    cursor: "pointer"
  },
  empty: {
    padding: "50px",
    textAlign: "center",
    color: "#8f8a9d"
  }
};

export default AdminJobs;