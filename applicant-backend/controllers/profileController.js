const db = require("../config/db");

// GET APPLICANT PROFILE
const getProfile = (req, res) => {

    const applicantId = req.applicant.id;

    const sql = `
        SELECT
            id,
            name,
            email,
            phone
        FROM applicants
        WHERE id = ?
    `;

    db.query(sql, [applicantId], (err, results) => {

        if (err) {
            console.error("Profile fetch error:", err);

            return res.status(500).json({
                message: "Failed to fetch profile"
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


// UPDATE APPLICANT PROFILE
const updateProfile = (req, res) => {

    const applicantId = req.applicant.id;

    const {
        name,
        phone
    } = req.body;

    if (!name) {
        return res.status(400).json({
            message: "Name is required"
        });
    }

    const sql = `
        UPDATE applicants
        SET name = ?, phone = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            name,
            phone || null,
            applicantId
        ],
        (err, result) => {

            if (err) {
                console.error("Profile update error:", err);

                return res.status(500).json({
                    message: "Failed to update profile"
                });
            }

            res.status(200).json({
                message: "Profile updated successfully"
            });
        }
    );
};


module.exports = {
    getProfile,
    updateProfile
};