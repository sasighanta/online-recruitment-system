import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import "../App.css";

function ApplyJob() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [resume, setResume] = useState(null);
    const [coverLetter, setCoverLetter] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const handleResumeChange = (e) => {

        const file = e.target.files[0];

        if (!file) {
            setResume(null);
            return;
        }

        // Check PDF
        if (file.type !== "application/pdf") {

            setError("Only PDF resumes are allowed.");

            e.target.value = "";
            setResume(null);

            return;
        }

        // Check file size
        if (file.size > 5 * 1024 * 1024) {

            setError(
                "Resume size must be less than 5 MB."
            );

            e.target.value = "";
            setResume(null);

            return;
        }

        setError("");
        setResume(file);
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");


        if (!resume) {

            setError(
                "Please select your resume PDF."
            );

            return;
        }


        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }


        setLoading(true);


        try {

            const formData = new FormData();

            formData.append("job_id", id);
            formData.append("resume", resume);
            formData.append(
                "cover_letter",
                coverLetter
            );


            const response = await fetch(
                "http://localhost:5000/api/applications",
                {
                    method: "POST",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    },

                    body: formData
                }
            );


            const data = await response.json();


            if (!response.ok) {

                setError(
                    data.message ||
                    "Failed to submit application"
                );

                return;
            }


            alert(
                "Application submitted successfully!"
            );

            navigate("/applications");


        } catch (error) {

            console.error(error);

            setError(
                "Unable to connect to server"
            );

        } finally {

            setLoading(false);
        }
    };


    return (
        <div className="simple-page">

            <div className="page-header">

                <div>

                    <h1>
                        Apply for Job
                    </h1>

                    <p>
                        Complete the form to submit
                        your application.
                    </p>

                </div>


                <Link
                    to={`/jobs/${id}`}
                    className="back-btn"
                >
                    ← Back to Job
                </Link>

            </div>


            <div className="application-form-card">

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}


                <form onSubmit={handleSubmit}>

                    <label>
                        Resume *
                    </label>


                    <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handleResumeChange}
                    />


                    <small className="form-help">
                        PDF only. Maximum file size: 5 MB.
                    </small>


                    {resume && (
                        <div className="selected-file">
                            Selected: {resume.name}
                        </div>
                    )}


                    <label>
                        Cover Letter
                    </label>


                    <textarea
                        placeholder="Write a short cover letter..."
                        value={coverLetter}
                        onChange={(e) =>
                            setCoverLetter(
                                e.target.value
                            )
                        }
                    />


                    <button
                        type="submit"
                        className="apply-large-btn"
                        disabled={loading}
                    >

                        {loading
                            ? "Submitting..."
                            : "Submit Application"
                        }

                    </button>

                </form>

            </div>

        </div>
    );
}

export default ApplyJob;