const express = require("express");

const {
    getAllJobs,
    createJob,
    updateJob,
    deleteJob
} = require("../controllers/adminJobController");

const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

const router = express.Router();

router.get("/", adminAuthMiddleware, getAllJobs);
router.post("/", adminAuthMiddleware, createJob);
router.put("/:id", adminAuthMiddleware, updateJob);
router.delete("/:id", adminAuthMiddleware, deleteJob);

module.exports = router;