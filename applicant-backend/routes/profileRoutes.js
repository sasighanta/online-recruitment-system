const express = require("express");

const {
    getProfile,
    updateProfile
} = require("../controllers/profileController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get profile
router.get(
    "/",
    authMiddleware,
    getProfile
);

// Update profile
router.put(
    "/",
    authMiddleware,
    updateProfile
);

module.exports = router;