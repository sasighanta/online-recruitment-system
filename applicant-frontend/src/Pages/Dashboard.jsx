import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function Dashboard() {

    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    const applicant =
        JSON.parse(
            localStorage.getItem("applicant")
        );


    useEffect(() => {
        fetchDashboard();
    }, []);


    const fetchDashboard = async () => {

        const token =
            localStorage.getItem("token");


        if (!token) {

            navigate("/login");

            return;
        }


        try {

            const response = await fetch(
                "http://localhost:5000/api/applicant/dashboard",
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                if (response.status === 401) {

                    localStorage.removeItem(
                        "token"
                    );

                    localStorage.removeItem(
                        "applicant"
                    );

                    navigate("/login");

                    return;
                }


                throw new Error(
                    data.message ||
                    "Failed to load dashboard"
                );
            }


            setDashboard(data);


        } catch (error) {

            console.error(error);

            setError(
                "Unable to load dashboard"
            );


        } finally {

            setLoading(false);
        }
    };


    const getStatusClass = (status) => {

        switch (status) {

            case "Shortlisted":
                return "shortlisted";

            case "Under Review":
                return "review";

            case "Selected":
                return "selected";

            case "Rejected":
                return "rejected";

            default:
                return "applied";
        }
    };


    if (loading) {

        return (
            <div className="simple-page">
                <h1>
                    Loading dashboard...
                </h1>
            </div>
        );
    }


    if (error) {

        return (
            <div className="simple-page">
                <h1>{error}</h1>
            </div>
        );
    }


    return (
        <div className="app-layout">

            {/* Sidebar */}

            <aside className="sidebar">

                <div className="logo">

                    <div className="logo-icon">
                        C
                    </div>

                    <span>
                        CareerConnect
                    </span>

                </div>


                <nav className="sidebar-nav">

                    <Link to="/dashboard"
                        className="nav-item active"
                    >
                        <span>⌂</span>
                        Dashboard
                    </Link>


                    <Link
                        to="/jobs"
                        className="nav-item"
                    >
                        <span>▣</span>
                        Browse Jobs
                    </Link>


                    <Link
                        to="/applications"
                        className="nav-item"
                    >
                        <span>◉</span>
                        My Applications
                    </Link>


                    <Link
                        to="/profile"
                        className="nav-item"
                    >
                        <span>♙</span>
                        My Profile
                    </Link>

                </nav>


                <div className="sidebar-bottom">
                    <button
                        className="logout"
                        onClick={() => {

                            localStorage.removeItem(
                                "token"
                            );

                            localStorage.removeItem(
                                "applicant"
                            );

                            navigate("/login");

                        }}
                    >
                        <span>↪</span>
                        Logout
                    </button>

                </div>

            </aside>


            {/* Main */}

            <main className="main-content">

                {/* Header */}

                <header className="top-header">

                    <div>

                        <h1>
                            Good morning,{" "}
                            {applicant?.name || "Applicant"}! 
                        </h1>

                        <p>
                            Here's what's happening
                            with your job search.
                        </p>

                    </div>


                    <div className="header-right">



                        <div className="user-profile">

                            <div className="avatar">
                                {
                                    applicant?.name
                                        ?.charAt(0)
                                        ?.toUpperCase()
                                }
                            </div>


                            <div>

                                <strong>
                                    {applicant?.name}
                                </strong>

                                <small>
                                    Applicant
                                </small>

                            </div>

                        </div>

                    </div>

                </header>


                {/* Statistics */}

                <section className="stats-grid">

                    <div className="stat-card">

                        <div className="stat-icon purple">
                            ▤
                        </div>

                        <div>

                            <p>
                                Applications
                            </p>

                            <h2>
                                {
                                    dashboard
                                        ?.statistics
                                        ?.applications
                                }
                            </h2>

                            <small>
                                Total submitted
                            </small>

                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon green">
                            ✓
                        </div>

                        <div>

                            <p>
                                Shortlisted
                            </p>

                            <h2>
                                {
                                    dashboard
                                        ?.statistics
                                        ?.shortlisted
                                }
                            </h2>

                            <small>
                                Applications
                            </small>

                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon yellow">
                            ★
                        </div>

                        <div>

                            <p>
                                Selected
                            </p>

                            <h2>
                                {
                                    dashboard
                                        ?.statistics
                                        ?.selected
                                }
                            </h2>

                            <small>
                                Applications
                            </small>

                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon blue">
                            ⌕
                        </div>

                        <div>

                            <p>
                                Jobs Available
                            </p>

                            <h2>
                                {
                                    dashboard
                                        ?.statistics
                                        ?.jobsAvailable
                                }
                            </h2>

                            <small>
                                Currently available
                            </small>

                        </div>

                    </div>

                </section>


                {/* Dashboard grid */}

                <section className="dashboard-grid">

                    {/* Recent Applications */}

                    <div className="dashboard-card">

                        <div className="card-header">

                            <div>

                                <h2>
                                    Recent Applications
                                </h2>

                                <p>
                                    Track your latest
                                    applications
                                </p>

                            </div>


                            <Link to="/applications">
                                View All →
                            </Link>

                        </div>


                        <div className="application-list">

                            {
                                dashboard
                                    ?.recentApplications
                                    ?.length === 0 ? (

                                    <p className="empty-text">
                                        No applications yet.
                                    </p>

                                ) : (

                                    dashboard
                                        ?.recentApplications
                                        ?.map(
                                            (application) => (

                                                <div
                                                    className="application-item"
                                                    key={
                                                        application.id
                                                    }
                                                >

                                                    <div>

                                                        <h3>
                                                            {
                                                                application.title
                                                            }
                                                        </h3>

                                                        <p>
                                                            {
                                                                application.company
                                                            }
                                                            {" · Applied "}
                                                            {
                                                                new Date(
                                                                    application.applied_at
                                                                ).toLocaleDateString()
                                                            }
                                                        </p>

                                                    </div>


                                                    <span
                                                        className={
                                                            `status ${
                                                                getStatusClass(
                                                                    application.status
                                                                )
                                                            }`
                                                        }
                                                    >
                                                        {
                                                            application.status
                                                        }
                                                    </span>

                                                </div>

                                            )
                                        )

                                )
                            }

                        </div>

                    </div>


                    {/* Quick Actions */}

                    <div className="dashboard-card">

                        <div className="card-header">

                            <div>

                                <h2>
                                    Find Your Next Job
                                </h2>

                                <p>
                                    Explore available
                                    opportunities
                                </p>

                            </div>

                        </div>


                        <div className="quick-action">

                            <div className="quick-action-icon">
                                🔎
                            </div>

                            <h3>
                                Browse Jobs
                            </h3>

                            <p>
                                Discover jobs that
                                match your skills.
                            </p>

                            <Link
                                to="/jobs"
                                className="apply-btn"
                            >
                                Explore Jobs
                            </Link>

                        </div>


                        <div className="quick-action">

                            <div className="quick-action-icon">
                                👤
                            </div>

                            <h3>
                                Complete Profile
                            </h3>

                            <p>
                                Keep your applicant
                                information updated.
                            </p>

                            <Link
                                to="/profile"
                                className="apply-btn"
                            >
                                View Profile
                            </Link>

                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default Dashboard;