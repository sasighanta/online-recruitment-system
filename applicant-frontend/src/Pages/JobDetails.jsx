import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "../App.css";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/jobs/${id}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch job");
      }

      setJob(data.job);
    } catch (error) {
      console.error(error);
      setError("Unable to load job details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="simple-page">
        <h1>Loading job details...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="simple-page">
        <h1>{error}</h1>

        <Link to="/jobs" className="back-btn">
          ← Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="simple-page">

      <div className="page-header">
        <div>
          <h1>Job Details</h1>
          <p>Review the opportunity before applying.</p>
        </div>

        <Link to="/jobs" className="back-btn">
          ← Back to Jobs
        </Link>
      </div>

      <div className="job-details-card">

        <div className="job-details-top">

          <div className="company-logo job-detail-logo">
            {job.company.charAt(0)}
          </div>

          <div>
            <h1>{job.title}</h1>
            <p>
              {job.company} · {job.location}
            </p>
          </div>

        </div>

        <div className="job-detail-info">

          <div>
            <span>Salary</span>
            <strong>{job.salary}</strong>
          </div>

          <div>
            <span>Job Type</span>
            <strong>{job.job_type}</strong>
          </div>

          <div>
            <span>Location</span>
            <strong>{job.location}</strong>
          </div>

        </div>

        <div className="job-description">

          <h2>Job Description</h2>

          <p>
            {job.description}
          </p>

        </div>

        <div className="job-description">

          <h2>Requirements</h2>

          <p>
            {job.requirements}
          </p>

        </div>

        <button
          className="apply-large-btn"
          onClick={() => navigate(`/apply/${job.id}`)}
        >
          Apply Now
        </button>

      </div>

    </div>
  );
}

export default JobDetails;