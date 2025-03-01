const { createCompanyApplication, updateCompanyApplication, deleteCompanyApplication, findCompanyDirect, listCompanyApplication, listCompanyMentorApp, findPendingApplicationJobId, findCompanyDateApp }
    = require("../pkg/jobsapplication");

// const createCompanyJobApplication = async (req, res) => {
//     try {
//         const application = await createCompanyApplication({
//             jobId: req.params.jobId,
//             mentorId: req.params.mentorId,
//             companyId: req.auth.id,
//             applicationType: "companyToMentor",
//             status: "pending",
//             acceptedStatus: "pending",
//         });
//         return res.status(200).send(application);
//     } catch (err) {
//         console.error(err);
//         return res.status(500).send("Internal Server Error!");
//     }
// };
const createCompanyJobApplication = async (req, res) => {
    try {
        // Validate params
        if (!req.params.jobId || !req.params.mentorId) {
            return res.status(400).send({ success: false, message: "Missing required parameters." });
        }

        // Create application
        const application = await createCompanyApplication({
            jobId: req.params.jobId,
            mentorId: req.params.mentorId,
            companyId: req.auth.id,
            applicationType: "companyToMentor",
            status: "pending",
            acceptedStatus: "pending",
        });

        // Success response
        return res.status(201).send({ success: true, data: application, message: "Application created successfully." });
    } catch (err) {
        console.error({ error: err.message, stack: err.stack });
        return res.status(500).send({ success: false, message: "Internal Server Error!" });
    }
};

const updateCompanyJobApplication = async (req, res) => {
    try {
        const updated = await updateCompanyApplication(req.params.id, req.body);
        return res.status(200).send(updated);
    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error!");
    };
};

const deleteCompanyJobApplication = async (req, res) => {
    try {
        await deleteCompanyApplication(req.params.id);
        return res.status(200).send({ message: `The application with id: ${req.params._id} was removed` });
    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error!");
    };
};

const findCompanyToMentor = async (req, res) => {
    try {
        const findApplication = await findCompanyDirect(req.auth._id, req.params.mentorId);
        return res.status(200).send(findApplication);
    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error!");
    };
};

const findCompanyAppFromDate = async (req, res) => {
    try {
        const findApplicationDate = await findCompanyDateApp(req.auth.id, req.params.date);
        return res.status(200).send(findApplicationDate);
    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error!");
    };
};

const listCompanyJobApplication = async (req, res) => {
    const filter = req.params.acceptedStatus === "all" ? null : req.params.acceptedStatus;
    try {
        const listAllJobs = await listCompanyApplication(req.auth.id, filter);
        return res.status(200).send(listAllJobs);
    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error!");
    };
};

const listCompanyMentorApplication = async (req, res) => {
    const filter = req.params.acceptedStatus === "all" ? null : req.params.acceptedStatus;
    try {
        const allApplications = await listCompanyMentorApp(req.auth.id, req.params.mentorId, filter);
        return res.status(200).send(allApplications);
    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error!");
    };
};

const listPendingApplicationsByJob = async (req, res) => {
    try {
        const pendingApplication = await findPendingApplicationJobId(req.params.jobId);
        return res.status(200).send(pendingApplication);
    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error!");
    };
};


module.exports = {
    createCompanyJobApplication,
    updateCompanyJobApplication,
    deleteCompanyJobApplication,
    findCompanyAppFromDate,
    findCompanyToMentor,
    listCompanyJobApplication,
    listCompanyMentorApplication,
    listPendingApplicationsByJob,
};