const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const dashboardRoutes =require("./routes/dashboardRoutes");
const db = require("./config/db");
const applicantRoutes = require("./routes/applicantRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes =require("./routes/applicationRoutes");
const profileRoutes =require("./routes/profileRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/applicant/dashboard",dashboardRoutes);
app.use("/uploads",express.static(path.join(__dirname, "uploads")));
app.use("/api/applicant", applicantRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications",applicationRoutes);
app.use("/api/applicant/profile",profileRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Applicant Backend is running!"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});