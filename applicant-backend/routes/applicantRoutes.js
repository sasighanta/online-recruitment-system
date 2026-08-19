const express = require("express");

const {
    registerApplicant,
    loginApplicant
} = require("../controllers/applicantController");

const router = express.Router();

// Register
router.post("/register", registerApplicant);

// Login
router.post("/login", loginApplicant);

module.exports = router;