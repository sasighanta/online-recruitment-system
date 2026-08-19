const db = require("../config/db");

const getDashboardStats = (req, res) => {
    const queries = {
    applicants: "SELECT COUNT(*) AS count FROM applicants",
    jobs: "SELECT COUNT(*) AS count FROM jobs",
    applications: "SELECT COUNT(*) AS count FROM applications",
    applied: "SELECT COUNT(*) AS count FROM applications WHERE status = 'Applied'",
    underReview: "SELECT COUNT(*) AS count FROM applications WHERE status = 'Under Review'",
    shortlisted: "SELECT COUNT(*) AS count FROM applications WHERE status = 'Shortlisted'",
    rejected: "SELECT COUNT(*) AS count FROM applications WHERE status = 'Rejected'",
    selected: "SELECT COUNT(*) AS count FROM applications WHERE status = 'Selected'"
};

    const results = {};
    const keys = Object.keys(queries);
    let completed = 0;

    keys.forEach((key) => {
        db.query(queries[key], (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: "Failed to fetch dashboard statistics"
                });
            }

            results[key] = rows[0].count;
            completed++;

            if (completed === keys.length) {
                res.status(200).json({
                    statistics: results
                });
            }
        });
    });
};

module.exports = {
    getDashboardStats
};