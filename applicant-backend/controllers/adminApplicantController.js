const db = require("../config/db");

const getAllApplicants = (req, res) => {
    const sql = `
        SELECT
            id,
            name,
            email,
            phone,
            skills,
            education,
            resume,
            created_at
        FROM applicants
        ORDER BY created_at DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Failed to fetch applicants"
            });
        }

        res.status(200).json({
            applicants: results
        });
    });
};

const getApplicantById = (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT
            id,
            name,
            email,
            phone,
            skills,
            education,
            resume,
            created_at
        FROM applicants
        WHERE id = ?
    `;

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Failed to fetch applicant"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Applicant not found"
            });
        }

        res.status(200).json({
            applicant: results[0]
        });
    });
};

module.exports = {
    getAllApplicants,
    getApplicantById
};