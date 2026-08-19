const db = require("../config/db");

const getDashboardData = (req, res) => {

    const applicantId = req.applicant.id;

    // Total applications
    const totalApplicationsSql = `
        SELECT COUNT(*) AS total
        FROM applications
        WHERE applicant_id = ?
    `;

    // Shortlisted applications
    const shortlistedSql = `
        SELECT COUNT(*) AS total
        FROM applications
        WHERE applicant_id = ?
        AND status = 'Shortlisted'
    `;

    // Selected applications
    const selectedSql = `
        SELECT COUNT(*) AS total
        FROM applications
        WHERE applicant_id = ?
        AND status = 'Selected'
    `;

    // Available jobs
    const availableJobsSql = `
        SELECT COUNT(*) AS total
        FROM jobs
    `;

    // Recent applications
    const recentApplicationsSql = `
        SELECT
            applications.id,
            applications.status,
            applications.applied_at,
            jobs.title,
            jobs.company
        FROM applications
        INNER JOIN jobs
            ON applications.job_id = jobs.id
        WHERE applications.applicant_id = ?
        ORDER BY applications.applied_at DESC
        LIMIT 5
    `;

    db.query(
        totalApplicationsSql,
        [applicantId],
        (err, totalResults) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Failed to load dashboard"
                });
            }

            db.query(
                shortlistedSql,
                [applicantId],
                (err, shortlistedResults) => {

                    if (err) {
                        console.error(err);

                        return res.status(500).json({
                            message: "Failed to load dashboard"
                        });
                    }

                    db.query(
                        selectedSql,
                        [applicantId],
                        (err, selectedResults) => {

                            if (err) {
                                console.error(err);

                                return res.status(500).json({
                                    message: "Failed to load dashboard"
                                });
                            }

                            db.query(
                                availableJobsSql,
                                (err, jobsResults) => {

                                    if (err) {
                                        console.error(err);

                                        return res.status(500).json({
                                            message: "Failed to load dashboard"
                                        });
                                    }

                                    db.query(
                                        recentApplicationsSql,
                                        [applicantId],
                                        (err, recentResults) => {

                                            if (err) {
                                                console.error(err);

                                                return res.status(500).json({
                                                    message: "Failed to load dashboard"
                                                });
                                            }

                                            res.status(200).json({

                                                statistics: {
                                                    applications:
                                                        totalResults[0].total,

                                                    shortlisted:
                                                        shortlistedResults[0].total,

                                                    selected:
                                                        selectedResults[0].total,

                                                    jobsAvailable:
                                                        jobsResults[0].total
                                                },

                                                recentApplications:
                                                    recentResults

                                            });

                                        }
                                    );

                                }
                            );

                        }
                    );

                }
            );

        }
    );
};

module.exports = {
    getDashboardData
};