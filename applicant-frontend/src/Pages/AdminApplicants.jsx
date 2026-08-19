import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminApplicants() {
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [message, setMessage] = useState("");

  const fetchApplicants = async () => {
    const token = localStorage.getItem("adminToken");

    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/applicants",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setApplicants([]);
        return;
      }

      setApplicants(data.applicants || []);
    } catch (error) {
      setApplicants([]);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

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

            <Link to="/admin/jobs" style={styles.link}>
              Jobs
            </Link>

            <Link to="/admin/applications" style={styles.link}>
              Applications
            </Link>

            <Link to="/admin/applicants" style={styles.activeLink}>
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
            <h1 style={styles.heading}>Manage Applicants</h1>
            <p style={styles.subtitle}>
              View and manage registered applicants
            </p>
          </div>
        </div>

        {message && <div style={styles.message}>{message}</div>}

        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <span>Applicant</span>
            <span>Email</span>
            <span>Phone</span>
            <span>Skills</span>
            <span>Education</span>
            <span>Registered</span>
          </div>

          {applicants.length === 0 ? (
            <div style={styles.empty}>
              No applicants available
            </div>
          ) : (
            applicants.map((applicant) => (
              <div style={styles.tableRow} key={applicant.id}>
                <div>
                  <strong>{applicant.name}</strong>
                  <div style={styles.id}>
                    ID: {applicant.id}
                  </div>
                </div>

                <span>{applicant.email}</span>

                <span>{applicant.phone || "-"}</span>

                <span>{applicant.skills || "-"}</span>

                <span>{applicant.education || "-"}</span>

                <span>
                  {applicant.created_at
                    ? new Date(
                        applicant.created_at
                      ).toLocaleDateString()
                    : "-"}
                </span>
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
  message: {
    padding: "12px 16px",
    background: "#181522",
    border: "1px solid #342c43",
    borderRadius: "8px",
    marginBottom: "20px"
  },
  tableCard: {
    background: "#111019",
    border: "1px solid #292533",
    borderRadius: "12px",
    overflow: "hidden"
  },
  tableHeader: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1.5fr 1fr 1.3fr 1.3fr 1fr",
    gap: "15px",
    padding: "18px 20px",
    borderBottom: "1px solid #292533",
    color: "#9691a3",
    fontSize: "13px"
  },
  tableRow: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1.5fr 1fr 1.3fr 1.3fr 1fr",
    gap: "15px",
    alignItems: "center",
    padding: "18px 20px",
    borderBottom: "1px solid #211e29",
    fontSize: "14px"
  },
  id: {
    color: "#777284",
    fontSize: "12px",
    marginTop: "5px"
  },
  empty: {
    padding: "50px",
    textAlign: "center",
    color: "#8f8a9d"
  }
};

export default AdminApplicants;