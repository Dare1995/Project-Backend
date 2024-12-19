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
} = require("./handlers/auth");

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

app.post("/api/auth/login", login);
app.post("/api/auth/register", register);
app.post("/api/auth/forgot-password", forgotPassword);
app.get("/api/auth/checkResetToken/:resetToken", resetPasswordEmail);
app.put("/api/auth/reset-password/:resetToken", resetUserPassword);
app.post("/api/auth/checkEmail", checkEmail);

app.listen(getSection("development").port, () =>
    console.log(`Server starter at port ${getSection("development").port}`)
);