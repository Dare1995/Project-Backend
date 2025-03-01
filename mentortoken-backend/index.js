require("dotenv").config();

const express = require("express");
const { expressjwt: jwt } = require("express-jwt");
const app = express();
const cors = require("cors");
const connectDB = require("./pkg/db/config");
connectDB();

const { getSection } = require("./pkg/config");

const {
    login,
    register,
    resetPasswordEmail,
    forgotPassword,
    resetUserPassword,
    checkEmail,
    update,
    getUser,
    getUserMentorName,
    getUserCompanyName,
    getAllCompanies,
    getAllMentors,
    getCompanyById,
    getMentorById,
} = require("./handlers/auth");

const {
    createJob,
    updateJob,
    deleteJob,
    listAllOpenJobs,
    listCompanyOpen,
    jobListByIds,
    findJob,
    listJobsByCompany,
} = require("./handlers/companyJobs");

const {
    createCompanyJobApplication,
    deleteCompanyJobApplication,
    updateCompanyJobApplication,
    listCompanyJobApplication,
    listPendingApplicationsByJob,
    listCompanyMentorApplication,
    findCompanyAppFromDate,
    findCompanyToMentor
} = require("./handlers/companyApplications");

const {
    deleteMentorJobApplication,
    listMentorJobApplication,
    findOneApplication,
    findAppFromDate,
    updateMentorJobApplication,
    findApplicationByMentorJob,
    createMentorJobApplication
} = require("./handlers/mentorApplication");


app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(
    "/api",
    jwt({
        secret: getSection("development").jwt_secret,
        algorithms: ["HS256"],
    }).unless({
        path: [
            "/api/auth/login",
            "/api/auth/register",
            "/api/auth/forgot-password",
            "/api/auth/checkEmail",
            { url: /\/api\/auth\/checkResetToken\/[^/]+$/, methods: ["GET"] },
            { url: /\/api\/auth\/reset-password\/[^/]+$/, methods: ["PUT"] },
        ],
    })
);

// auth
app.post("/api/auth/login", login);
app.post("/api/auth/register", register);
app.post("/api/auth/forgot-password", forgotPassword);
app.get("/api/auth/checkResetToken/:resetToken", resetPasswordEmail);
app.put("/api/auth/reset-password/:resetToken", resetUserPassword);
app.post("/api/auth/checkEmail", checkEmail);
app.put("/api/auth", update);
app.get("/api/auth", getUser);
app.get("/api/auth/mentor/:name", getUserMentorName);
app.get("/api/auth/company/:name", getUserCompanyName);
app.get("/api/auth/companies", getAllCompanies);
app.get("/api/auth/mentors", getAllMentors);
app.get("/api/auth/companyId/:_id", getCompanyById);
app.get("/api/auth/mentorId/:_id", getMentorById);

// job
app.post("/api/job", createJob);
app.put("/api/job/:jobId", updateJob);
app.delete("/api/job/:id", deleteJob);
app.get("/api/job/allCompanies", listAllOpenJobs);
app.get("/api/job/company/open", listCompanyOpen);
app.get("/api/job/ids/:ids", jobListByIds);
app.get("/api/job/one/:id", findJob);
app.get("/api/job/all/:companyId", listJobsByCompany);

// company
app.post("/api/company/application/:jobId/:mentorId", createCompanyJobApplication);
app.delete("/app/company/application/:id", deleteCompanyJobApplication);
app.put("/api/company/application/:id", updateCompanyJobApplication);
app.get("/api/company/application/:acceptedStatus", listCompanyJobApplication);
app.get("/api/company/job/pendingApps/:jobId", listPendingApplicationsByJob);
app.get("/api/company/mentorApplications/:mentorId/:acceptedStatus", listCompanyMentorApplication);
app.get("/api/company/dateApplications/:date", findCompanyAppFromDate);
app.get("/api/directApplications/:mentorId", findCompanyToMentor);

// mentor
app.post("/api/mentor/application/:jobId", createMentorJobApplication);
app.delete("/api/mentor/application", deleteMentorJobApplication);
app.put("/api/mentor/application/:_id", updateMentorJobApplication);
app.get("/api/mentor/application/:mentorId/:acceptedStatus", listMentorJobApplication);
app.get("/api/mentor/oneApplication/:id", findOneApplication);
app.get("/api/mentor/dateApplications/:mentorId/:date", findAppFromDate);
app.get("/api/mentor/jobApplication/:jobId", findApplicationByMentorJob);

app.listen(getSection("development").port, () =>
    console.log(`Server starter at port ${getSection("development").port}`)
);