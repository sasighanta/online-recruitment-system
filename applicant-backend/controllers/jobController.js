const db = require("../config/db");

// GET ALL JOBS
const getAllJobs = (req, res) => {
    const sql = `
        SELECT
            id,
            title,
            company,
            location,
            salary,
            job_type,
            description,
            requirements,
            created_at
        FROM jobs
        ORDER BY created_at DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching jobs:", err);

            return res.status(500).json({
                message: "Failed to fetch jobs"
            });
        }

        res.status(200).json({
            jobs: results
        });
    });
};


// GET SINGLE JOB
const getJobById = (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT
            id,
            title,
            company,
            location,
            salary,
            job_type,
            description,
            requirements,
            created_at
        FROM jobs
        WHERE id = ?
    `;

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error("Error fetching job:", err);

            return res.status(500).json({
                message: "Failed to fetch job"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.status(200).json({
            job: results[0]
        });
    });
};


module.exports = {
    getAllJobs,
    getJobById
};