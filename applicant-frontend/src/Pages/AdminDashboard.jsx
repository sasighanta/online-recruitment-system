import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    applicants: 0,
    jobs: 0,
    applications: 0,
    applied: 0,
    underReview: 0,
    shortlisted: 0,
    rejected: 0,
    selected: 0
  });

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    fetch("http://localhost:5000/api/admin/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.statistics) {
          setStats(data.statistics);
        }
      })
      .catch(() => {});
  }, [navigate]);

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
            <Link to="/admin/dashboard" style={styles.activeLink}>
              Dashboard
            </Link>

            <Link to="/admin/jobs" style={styles.link}>
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
            <h1 style={styles.heading}>Admin Dashboard</h1>

            <p style={styles.subtitle}>
              Manage recruitment activities from one place
            </p>
          </div>
        </div>

        <div style={styles.cards}>
          <div style={styles.card}>
            <span style={styles.cardLabel}>Total Jobs</span>
            <strong style={styles.cardValue}>{stats.jobs}</strong>
          </div>

          <div style={styles.card}>
            <span style={styles.cardLabel}>Applicants</span>
            <strong style={styles.cardValue}>{stats.applicants}</strong>
          </div>

          <div style={styles.card}>
            <span style={styles.cardLabel}>Applications</span>
            <strong style={styles.cardValue}>{stats.applications}</strong>
          </div>

          <div style={styles.card}>
            <span style={styles.cardLabel}>Shortlisted</span>
            <strong style={styles.cardValue}>{stats.shortlisted}</strong>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Application Status</h2>

          <div style={styles.statusGrid}>
            <div style={styles.statusCard}>
              <span>Applied</span>
              <strong>{stats.applied}</strong>
            </div>

            <div style={styles.statusCard}>
              <span>Under Review</span>
              <strong>{stats.underReview}</strong>
            </div>

            <div style={styles.statusCard}>
              <span>Shortlisted</span>
              <strong>{stats.shortlisted}</strong>
            </div>

            <div style={styles.statusCard}>
              <span>Rejected</span>
              <strong>{stats.rejected}</strong>
            </div>

            <div style={styles.statusCard}>
              <span>Selected</span>
              <strong>{stats.selected}</strong>
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Quick Actions</h2>

          <div style={styles.actions}>
            <Link to="/admin/jobs" style={styles.action}>
              Manage Jobs
            </Link>

            <Link to="/admin/applications" style={styles.action}>
              Review Applications
            </Link>

            <Link to="/admin/applicants" style={styles.action}>
              View Applicants
            </Link>
          </div>
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
    marginBottom: "32px"
  },

  heading: {
    margin: 0,
    fontSize: "30px"
  },

  subtitle: {
    color: "#8f8a9d",
    marginTop: "8px"
  },

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "18px"
  },

  card: {
    background: "#111019",
    border: "1px solid #292533",
    borderRadius: "12px",
    padding: "24px"
  },

  cardLabel: {
    display: "block",
    color: "#9691a3",
    fontSize: "14px",
    marginBottom: "15px"
  },

  cardValue: {
    fontSize: "30px"
  },

  section: {
    marginTop: "35px"
  },

  sectionTitle: {
    fontSize: "20px",
    marginBottom: "18px"
  },

  statusGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "14px"
  },

  statusCard: {
    background: "#111019",
    border: "1px solid #292533",
    borderRadius: "10px",
    padding: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  actions: {
    display: "flex",
    gap: "15px"
  },

  action: {
    background: "#181522",
    border: "1px solid #342c43",
    color: "#ffffff",
    textDecoration: "none",
    padding: "15px 20px",
    borderRadius: "9px"
  }
};

export default AdminDashboard;