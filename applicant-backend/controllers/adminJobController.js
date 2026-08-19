const db = require("../config/db");

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
            console.error(err);
            return res.status(500).json({
                message: "Failed to fetch jobs"
            });
        }

        res.status(200).json({
            jobs: results
        });
    });
};

const createJob = (req, res) => {
    const {
        title,
        company,
        location,
        salary,
        job_type,
        description,
        requirements
    } = req.body;

    if (!title || !company) {
        return res.status(400).json({
            message: "Title and company are required"
        });
    }

    const sql = `
        INSERT INTO jobs
        (title, company, location, salary, job_type, description, requirements)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            title,
            company,
            location || null,
            salary || null,
            job_type || null,
            description || null,
            requirements || null
        ],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: "Failed to create job"
                });
            }

            res.status(201).json({
                message: "Job created successfully",
                jobId: result.insertId
            });
        }
    );
};

const updateJob = (req, res) => {
    const { id } = req.params;

    const {
        title,
        company,
        location,
        salary,
        job_type,
        description,
        requirements
    } = req.body;

    if (!title || !company) {
        return res.status(400).json({
            message: "Title and company are required"
        });
    }

    const sql = `
        UPDATE jobs
        SET
            title = ?,
            company = ?,
            location = ?,
            salary = ?,
            job_type = ?,
            description = ?,
            requirements = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            title,
            company,
            location || null,
            salary || null,
            job_type || null,
            description || null,
            requirements || null,
            id
        ],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: "Failed to update job"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Job not found"
                });
            }

            res.status(200).json({
                message: "Job updated successfully"
            });
        }
    );
};

const deleteJob = (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM jobs WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err);

            if (err.code === "ER_ROW_IS_REFERENCED_2") {
                return res.status(409).json({
                    message: "Cannot delete job because applications exist for this job"
                });
            }

            return res.status(500).json({
                message: "Failed to delete job"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.status(200).json({
            message: "Job deleted successfully"
        });
    });
};

module.exports = {
    getAllJobs,
    createJob,
    updateJob,
    deleteJob
};