import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function Applications() {

    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {

            const response = await fetch(
                "http://localhost:5000/api/applications/my",
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {

                if (response.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("applicant");
                    navigate("/login");
                    return;
                }

                throw new Error(
                    data.message ||
                    "Failed to fetch applications"
                );
            }

            setApplications(data.applications);

        } catch (error) {

            console.error(error);

            setError(
                "Unable to load your applications"
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

            case "Rejected":
                return "rejected";

            case "Selected":
                return "selected";

            case "Applied":
            default:
                return "applied";
        }
    };


    if (loading) {

        return (
            <div className="simple-page">
                <h1>Loading applications...</h1>
            </div>
        );
    }


    if (error) {

        return (
            <div className="simple-page">

                <h1>{error}</h1>

                <Link
                    to="/dashboard"
                    className="back-btn"
                >
                    ← Dashboard
                </Link>

            </div>
        );
    }


    return (
        <div className="simple-page">

            {/* Header */}

            <div className="page-header">

                <div>

                    <h1>
                        My Applications
                    </h1>

                    <p>
                        Track all your job applications.
                    </p>

                </div>

                <Link
                    to="/dashboard"
                    className="back-btn"
                >
                    ← Dashboard
                </Link>

            </div>


            {/* Application count */}

            <div className="application-summary">

                <div>
                    <span>Total Applications</span>
                    <strong>
                        {applications.length}
                    </strong>
                </div>

                <div>
                    <span>Shortlisted</span>
                    <strong>
                        {
                            applications.filter(
                                app =>
                                    app.status ===
                                    "Shortlisted"
                            ).length
                        }
                    </strong>
                </div>

                <div>
                    <span>Under Review</span>
                    <strong>
                        {
                            applications.filter(
                                app =>
                                    app.status ===
                                    "Under Review"
                            ).length
                        }
                    </strong>
                </div>

                <div>
                    <span>Selected</span>
                    <strong>
                        {
                            applications.filter(
                                app =>
                                    app.status ===
                                    "Selected"
                            ).length
                        }
                    </strong>
                </div>

            </div>


            {/* Applications */}

            {applications.length === 0 ? (

                <div className="empty-applications">

                    <div className="empty-icon">
                        
                    </div>

                    <h2>
                        No Applications Yet
                    </h2>

                    <p>
                        You haven't applied for any
                        jobs yet. Start exploring
                        available opportunities.
                    </p>

                    <Link
                        to="/jobs"
                        className="apply-large-btn"
                    >
                        Browse Jobs
                    </Link>

                </div>

            ) : (

                <div className="applications-container">

                    {applications.map((application) => (

                        <div
                            className="application-card"
                            key={application.id}
                        >

                            {/* Company */}

                            <div className="company-logo large">
                                {
                                    application.company
                                        .charAt(0)
                                }
                            </div>


                            {/* Job information */}

                            <div className="application-job-info">

                                <h2>
                                    {application.title}
                                </h2>

                                <p>
                                    {application.company}
                                    {" · "}
                                    {application.location}
                                </p>

                                <div className="application-meta">

                                    <span>
                                         {application.salary}
                                    </span>

                                    <span>
                                         {application.job_type}
                                    </span>

                                    <span>
                                         Applied{" "}
                                        {
                                            new Date(
                                                application.applied_at
                                            ).toLocaleDateString()
                                        }
                                    </span>

                                </div>

                            </div>


                            {/* Status */}

                            <div className="application-status">

                                <span
                                    className={`status ${getStatusClass(
                                        application.status
                                    )}`}
                                >
                                    {application.status}
                                </span>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default Applications;