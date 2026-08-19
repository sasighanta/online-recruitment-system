const express = require("express");

const {
    getAllApplications,
    getApplicationById,
    updateApplicationStatus
} = require("../controllers/adminApplicationController");

const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

const router = express.Router();

router.get("/", adminAuthMiddleware, getAllApplications);
router.get("/:id", adminAuthMiddleware, getApplicationById);
router.put("/:id/status", adminAuthMiddleware, updateApplicationStatus);

module.exports = router;