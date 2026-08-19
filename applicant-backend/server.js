const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const dashboardRoutes =require("./routes/dashboardRoutes");
const adminRoutes = require("./routes/adminRoutes");
const db = require("./config/db");
const applicantRoutes = require("./routes/applicantRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes =require("./routes/applicationRoutes");
const profileRoutes =require("./routes/profileRoutes");
const adminJobRoutes = require("./routes/adminJobRoutes");
const adminApplicationRoutes = require("./routes/adminApplicationRoutes");
const adminApplicantRoutes = require("./routes/adminApplicantRoutes");
const adminDashboardRoutes = require("./routes/adminDashboardRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/applicant/dashboard",dashboardRoutes);
app.use("/uploads",express.static(path.join(__dirname, "uploads")));
app.use("/api/applicant", applicantRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications",applicationRoutes);
app.use("/api/applicant/profile",profileRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/jobs", adminJobRoutes);
app.use("/api/admin/applications", adminApplicationRoutes);
app.use("/api/admin/applicants", adminApplicantRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Applicant Backend is running!"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});