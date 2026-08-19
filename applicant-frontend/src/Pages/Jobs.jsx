import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";

function Jobs() {
    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("All Locations");

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {

        try {

            const response = await fetch(
                "http://localhost:5000/api/jobs"
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch jobs");
            }

            setJobs(data.jobs);

        } catch (error) {

            console.error(error);

            setError("Unable to load jobs");

        } finally {

            setLoading(false);

        }
    };
    const filteredJobs = jobs.filter((job) => {

        const search = searchTerm.toLowerCase().trim();

        const matchesSearch =
            job.title.toLowerCase().includes(search) ||
            job.company.toLowerCase().includes(search) ||
            job.description.toLowerCase().includes(search) ||
            job.requirements.toLowerCase().includes(search);

        const matchesLocation =
            selectedLocation === "All Locations" ||
            job.location === selectedLocation;

        return matchesSearch && matchesLocation;
    });


    if (loading) {
        return (
            <div className="simple-page">
                <h1>Loading jobs...</h1>
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
        <div className="simple-page">

            <div className="page-header">

                <div>
                    <h1>Browse Jobs</h1>
                    <p>Find your next opportunity.</p>
                </div>

                <Link
                    to="/dashboard"
                    className="back-btn"
                >
                    ← Dashboard
                </Link>

            </div>


            {/* Search */}
            <div className="search-box">

                <input
                    type="text"
                    placeholder="Search jobs, companies or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select
                    value={selectedLocation}
                    onChange={(e) =>
                        setSelectedLocation(e.target.value)
                    }
                >
                    <option value="All Locations">
                        All Locations
                    </option>

                    <option value="Bangalore">
                        Bangalore
                    </option>

                    <option value="Pune">
                        Pune
                    </option>

                    <option value="Hyderabad">
                        Hyderabad
                    </option>

                    <option value="Noida">
                        Noida
                    </option>

                    <option value="Mumbai">
                        Mumbai
                    </option>
                </select>

                <button
                    type="button"
                    onClick={() => {
                        // Filtering happens automatically
                    }}
                >
                    Search
                </button>

            </div>


            {/* Jobs */}

            <div className="all-jobs">

                {filteredJobs.length === 0 ? (

                    <div className="dashboard-card">
                        <h2>No jobs found</h2>
                        <p>Try a different search or location.</p>
                    </div>

                ) : (

                    filteredJobs.map((job) => (

                        <div
                            className="job-card"
                            key={job.id}
                        >

                            <div className="company-logo large">
                                {job.company.charAt(0)}
                            </div>


                            <div className="job-card-content">

                                <h2>
                                    {job.title}
                                </h2>

                                <p>
                                    {job.company} · {job.location}
                                </p>

                                <span className="salary">
                                    {job.salary}
                                </span>


                                <div className="job-tags">

                                    <span>
                                        {job.job_type}
                                    </span>

                                    <span>
                                        React
                                    </span>

                                    <span>
                                        JavaScript
                                    </span>

                                </div>

                            </div>

                            <button
                                className="apply-btn"
                                onClick={() => {
                                    navigate(`/jobs/${job.id}`);
                                }}
                            >
                                View & Apply
                            </button>

                        </div>

                    ))

                )}

            </div>

        </div>
    );
}

export default Jobs;