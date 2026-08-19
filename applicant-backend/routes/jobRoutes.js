const express = require("express");

const {
    getAllJobs,
    getJobById
} = require("../controllers/jobController");

const router = express.Router();

// Get all jobs
router.get("/", getAllJobs);

// Get single job
router.get("/:id", getJobById);

module.exports = router;