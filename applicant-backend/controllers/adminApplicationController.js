const db = require("../config/db");

const getAllApplications = (req, res) => {
    const sql = `
        SELECT
            applications.id,
            applications.applicant_id,
            applications.job_id,
            applications.resume,
            applications.cover_letter,
            applications.status,
            applications.applied_at,
            applicants.name AS applicant_name,
            applicants.email AS applicant_email,
            applicants.phone AS applicant_phone,
            jobs.title AS job_title,
            jobs.company,
            jobs.location,
            jobs.job_type
        FROM applications
        INNER JOIN applicants
            ON applications.applicant_id = applicants.id
        INNER JOIN jobs
            ON applications.job_id = jobs.id
        ORDER BY applications.applied_at DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Failed to fetch applications"
            });
        }

        res.status(200).json({
            applications: results
        });
    });
};

const getApplicationById = (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT
            applications.id,
            applications.applicant_id,
            applications.job_id,
            applications.resume,
            applications.cover_letter,
            applications.status,
            applications.applied_at,
            applicants.name AS applicant_name,
            applicants.email AS applicant_email,
            applicants.phone AS applicant_phone,
            applicants.skills,
            applicants.education,
            applicants.resume AS applicant_resume,
            jobs.title AS job_title,
            jobs.company,
            jobs.location,
            jobs.salary,
            jobs.job_type,
            jobs.description,
            jobs.requirements
        FROM applications
        INNER JOIN applicants
            ON applications.applicant_id = applicants.id
        INNER JOIN jobs
            ON applications.job_id = jobs.id
        WHERE applications.id = ?
    `;

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Failed to fetch application"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.status(200).json({
            application: results[0]
        });
    });
};

const updateApplicationStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
        "Applied",
        "Under Review",
        "Shortlisted",
        "Rejected",
        "Selected"
    ];

    if (!status || !allowedStatuses.includes(status)) {
        return res.status(400).json({
            message: "Invalid application status"
        });
    }

    const sql = `
        UPDATE applications
        SET status = ?
        WHERE id = ?
    `;

    db.query(sql, [status, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Failed to update application status"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.status(200).json({
            message: "Application status updated successfully"
        });
    });
};

module.exports = {
    getAllApplications,
    getApplicationById,
    updateApplicationStatus
};