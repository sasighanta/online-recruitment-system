const express = require("express");

const {
    getDashboardStats
} = require("../controllers/adminDashboardController");

const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

const router = express.Router();

router.get("/", adminAuthMiddleware, getDashboardStats);

module.exports = router;