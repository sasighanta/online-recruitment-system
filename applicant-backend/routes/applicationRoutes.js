const express = require("express");

const {
    applyForJob,
    getMyApplications
} = require("../controllers/applicationController");

const authMiddleware = require("../middleware/authMiddleware");
const uploadResume = require("../middleware/uploadMiddleware");

const router = express.Router();


// Apply for a job with resume
router.post(
    "/",
    authMiddleware,
    uploadResume.single("resume"),
    applyForJob
);


// Get logged-in applicant's applications
router.get(
    "/my",
    authMiddleware,
    getMyApplications
);


module.exports = router;