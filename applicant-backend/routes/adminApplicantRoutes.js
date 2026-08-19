const express = require("express");

const {
    getAllApplicants,
    getApplicantById
} = require("../controllers/adminApplicantController");

const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

const router = express.Router();

router.get("/", adminAuthMiddleware, getAllApplicants);
router.get("/:id", adminAuthMiddleware, getApplicantById);

module.exports = router;