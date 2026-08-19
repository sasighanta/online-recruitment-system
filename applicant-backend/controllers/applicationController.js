const db = require("../config/db");

// APPLY FOR JOB
const applyForJob = (req, res) => {

    const applicantId = req.applicant.id;

    const {
        job_id,
        cover_letter
    } = req.body;

    // Check job ID
    if (!job_id) {
        return res.status(400).json({
            message: "Job ID is required"
        });
    }

    // Check resume
    if (!req.file) {
        return res.status(400).json({
            message: "Resume PDF is required"
        });
    }

    const resumeFileName = req.file.filename;


    // Check whether job exists
    const checkJobSql = `
        SELECT id
        FROM jobs
        WHERE id = ?
    `;

    db.query(
        checkJobSql,
        [job_id],
        (err, jobResults) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Database error"
                });
            }


            if (jobResults.length === 0) {

                return res.status(404).json({
                    message: "Job not found"
                });

            }


            // Check duplicate application
            const checkApplicationSql = `
                SELECT id
                FROM applications
                WHERE applicant_id = ?
                AND job_id = ?
            `;

            db.query(
                checkApplicationSql,
                [applicantId, job_id],
                (err, applicationResults) => {

                    if (err) {
                        console.error(err);

                        return res.status(500).json({
                            message: "Database error"
                        });
                    }


                    if (applicationResults.length > 0) {

                        return res.status(409).json({
                            message:
                                "You have already applied for this job"
                        });

                    }


                    // Insert application
                    const insertSql = `
                        INSERT INTO applications
                        (
                            applicant_id,
                            job_id,
                            resume,
                            cover_letter
                        )
                        VALUES (?, ?, ?, ?)
                    `;

                    db.query(
                        insertSql,
                        [
                            applicantId,
                            job_id,
                            resumeFileName,
                            cover_letter || null
                        ],
                        (err, result) => {

                            if (err) {
                                console.error(err);

                                return res.status(500).json({
                                    message:
                                        "Failed to submit application"
                                });
                            }


                            res.status(201).json({
                                message:
                                    "Application submitted successfully",

                                applicationId:
                                    result.insertId,

                                resume:
                                    resumeFileName
                            });

                        }
                    );

                }
            );

        }
    );
};


// GET MY APPLICATIONS
const getMyApplications = (req, res) => {

    const applicantId = req.applicant.id;

    const sql = `
        SELECT
            applications.id,
            applications.job_id,
            applications.status,
            applications.resume,
            applications.cover_letter,
            applications.applied_at,
            jobs.title,
            jobs.company,
            jobs.location,
            jobs.salary,
            jobs.job_type
        FROM applications
        INNER JOIN jobs
            ON applications.job_id = jobs.id
        WHERE applications.applicant_id = ?
        ORDER BY applications.applied_at DESC
    `;

    db.query(
        sql,
        [applicantId],
        (err, results) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Failed to fetch applications"
                });
            }

            res.status(200).json({
                applications: results
            });
        }
    );
};


module.exports = {
    applyForJob,
    getMyApplications
};