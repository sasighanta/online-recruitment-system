const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER APPLICANT
const registerApplicant = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        // Check if email already exists
        const checkEmailSql =
            "SELECT id FROM applicants WHERE email = ?";

        db.query(checkEmailSql, [email], async (err, results) => {
            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Database error"
                });
            }

            if (results.length > 0) {
                return res.status(409).json({
                    message: "Email already registered"
                });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert applicant
            const insertSql = `
                INSERT INTO applicants
                (name, email, password, phone)
                VALUES (?, ?, ?, ?)
            `;

            db.query(
                insertSql,
                [name, email, hashedPassword, phone || null],
                (err, result) => {
                    if (err) {
                        console.error(err);

                        return res.status(500).json({
                            message: "Failed to register applicant"
                        });
                    }

                    res.status(201).json({
                        message: "Applicant registered successfully",
                        applicantId: result.insertId
                    });
                }
            );
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// LOGIN APPLICANT
const loginApplicant = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find applicant by email
        const sql = `
            SELECT id, name, email, password
            FROM applicants
            WHERE email = ?
        `;

        db.query(sql, [email], async (err, results) => {
            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Database error"
                });
            }

            // Applicant not found
            if (results.length === 0) {
                return res.status(401).json({
                    message: "Invalid email or password"
                });
            }

            const applicant = results[0];

            // Compare entered password with hashed password
            const passwordMatch = await bcrypt.compare(
                password,
                applicant.password
            );

            if (!passwordMatch) {
                return res.status(401).json({
                    message: "Invalid email or password"
                });
            }

            // Create JWT token
            const token = jwt.sign(
                {
                    id: applicant.id,
                    email: applicant.email
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1d"
                }
            );

            res.status(200).json({
                message: "Login successful",
                token: token,
                applicant: {
                    id: applicant.id,
                    name: applicant.name,
                    email: applicant.email
                }
            });
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};
module.exports = {
    registerApplicant,
    loginApplicant
};