import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState("");

  const fetchApplications = async () => {
    const token = localStorage.getItem("adminToken");

    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/applications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        setApplications(data.applications || []);
      } else {
        setApplications([]);
      }
    } catch (error) {
      setApplications([]);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("adminToken");

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/applications/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to update status");
        return;
      }

      setMessage(data.message);
      fetchApplications();
    } catch (error) {
      setMessage("Unable to connect to server");
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  const getStatusStyle = (status) => {
    if (status === "Selected") {
      return styles.selected;
    }

    if (status === "Shortlisted") {
      return styles.shortlisted;
    }

    if (status === "Rejected") {
      return styles.rejected;
    }

    if (status === "Under Review") {
      return styles.review;
    }

    return styles.applied;
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

            <Link to="/admin/jobs" style={styles.link}>
              Jobs
            </Link>

            <Link to="/admin/applications" style={styles.activeLink}>
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
            <h1 style={styles.heading}>Manage Applications</h1>
            <p style={styles.subtitle}>
              Review applications and update recruitment status
            </p>
          </div>
        </div>

        {message && <div style={styles.message}>{message}</div>}

        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <span>Applicant</span>
            <span>Job</span>
            <span>Company</span>
            <span>Applied On</span>
            <span>Status</span>
            <span>Update Status</span>
          </div>

          {applications.length === 0 ? (
            <div style={styles.empty}>No applications available</div>
          ) : (
            applications.map((application) => (
              <div style={styles.tableRow} key={application.id}>
                <div>
                  <strong>
                    {application.applicant_name || "Unknown Applicant"}
                  </strong>

                  <div style={styles.email}>
                    {application.applicant_email || ""}
                  </div>
                </div>

                <span>{application.job_title || "-"}</span>

                <span>{application.company || "-"}</span>

                <span>
                  {application.applied_at
                    ? new Date(application.applied_at).toLocaleDateString()
                    : "-"}
                </span>

                <span style={getStatusStyle(application.status)}>
                  {application.status || "Applied"}
                </span>

                <select
                  style={styles.select}
                  value={application.status || "Applied"}
                  onChange={(e) => updateStatus(application.id, e.target.value)}
                >
                  <option value="Applied">Applied</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Selected">Selected</option>
                </select>
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
    fontFamily: "Arial, sans-serif",
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
    justifyContent: "space-between",
  },
  logo: {
    fontSize: "21px",
    fontWeight: "700",
    marginBottom: "5px",
  },
  adminLabel: {
    fontSize: "11px",
    color: "#8b5cf6",
    letterSpacing: "1.5px",
    marginBottom: "35px",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  link: {
    color: "#a5a1b2",
    textDecoration: "none",
    padding: "12px 14px",
    borderRadius: "8px",
  },
  activeLink: {
    color: "#ffffff",
    textDecoration: "none",
    padding: "12px 14px",
    borderRadius: "8px",
    background: "#8b5cf6",
  },
  logout: {
    border: "1px solid #393341",
    background: "transparent",
    color: "#d6d2df",
    padding: "11px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  main: {
    flex: 1,
    padding: "40px",
    overflowY: "auto",
  },
  header: {
    marginBottom: "30px",
  },
  heading: {
    margin: 0,
    fontSize: "30px",
  },
  subtitle: {
    color: "#8f8a9d",
    marginTop: "8px",
  },
  message: {
    padding: "12px 16px",
    background: "#181522",
    border: "1px solid #342c43",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  tableCard: {
    background: "#111019",
    border: "1px solid #292533",
    borderRadius: "12px",
    overflow: "hidden",
  },
  tableHeader: {
    display: "grid",
    gridTemplateColumns: "1.4fr 1.3fr 1.1fr 1fr 1fr 1.4fr",
    gap: "15px",
    padding: "18px 20px",
    borderBottom: "1px solid #292533",
    color: "#9691a3",
    fontSize: "13px",
  },
  tableRow: {
    display: "grid",
    gridTemplateColumns: "1.4fr 1.3fr 1.1fr 1fr 1fr 1.4fr",
    gap: "15px",
    alignItems: "center",
    padding: "18px 20px",
    borderBottom: "1px solid #211e29",
    fontSize: "14px",
  },
  email: {
    color: "#777284",
    fontSize: "12px",
    marginTop: "5px",
  },
  select: {
    background: "#09080f",
    color: "#ffffff",
    border: "1px solid #393341",
    borderRadius: "7px",
    padding: "8px",
  },
  applied: {
    color: "#c4b5fd",
  },
  review: {
    color: "#fcd34d",
  },
  shortlisted: {
    color: "#67e8f9",
  },
  rejected: {
    color: "#fca5a5",
  },
  selected: {
    color: "#86efac",
  },
  empty: {
    padding: "50px",
    textAlign: "center",
    color: "#8f8a9d",
  },
};

export default AdminApplications;
