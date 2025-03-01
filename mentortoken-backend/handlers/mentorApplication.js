// const { findOneJob } = require("../pkg/jobs");
// const { findMentorApplicationByJobId, createMentorApplication, findApplication, updateMentorApplication, deleteMentorApplication, findDateApp, listMentorApplication } = require("../pkg/jobsapplication")

// const createMentorJobApplication = async (req, res) => {
//     try {
//         const applicationExist = await findMentorApplicationByJobId(req.auth.id, req.params.jobId);
//         if (applicationExist) {
//             return res.status(200).send({ message: "Application for this jobs already exists!" });
//         } else {
//             const job = await findOneJob(req.params.jobId);
//             await createMentorApplication({
//                 jobId: job._id,
//                 mentorId: req.auth.id,
//                 companyId: job.companyId,
//                 status: "pending",
//                 applicationType: "mentorToCompany",
//                 acceptedStatus: "pending",
//             });
//             return res.status(200).send({ message: "Application created!" });
//         }
//     } catch (err) {
//         console.error(err);
//         return res.status(500).send("Internal Server Error!");
//     };
// };

// const deleteMentorJobApplication = async (req, res) => {
//     try {
//         await deleteMentorApplication(req.query);
//         return res.status(200).send(`The application with id: ${req.query} was deleted!`)
//     } catch (err) {
//         console.error(err);
//         return res.status(500).send("Internal Server Error");
//     };
// };

// const updateMentorJobApplication = async (req, res) => {
//     try {
//         const updateApp = await findApplication(req.params._id);
//         await updateMentorApplication(req.params._id, req.body);
//         updateApp = await findApplication(req.params._id);
//         return res.status(200).send(updateApp);
//     } catch (err) {
//         console.error(err);
//         return res.status(500).send("Internal Server Error!");
//     };
// };

// const findOneApplication = async (req, res) => {
//     try {
//         const oneApplication = await findApplication(req.params._id);
//         return res.status(200).send(oneApplication);
//     } catch (err) {
//         console.error(err);
//         return res.status(500).send("Internal Server Error!");
//     };
// };

// const findApplicationByMentorJob = async (req, res) => {
//     try {
//         const oneApplication = await findMentorApplicationByJobId(req.auth.id, req.params.jobId);
//         if(oneApplication) {
//             return res.status(200).send(true);
//         } else {
//             return res.status(200).send(false);
//         };
//     } catch (err) {
//         console.error(err);
//         return res.status(500).send("Internal Server Error!");
//     };
// };

// const findAppFromDate = async (req, res) => {
//     try {
//         const applications = [];
//         req.params.mentorId === "null" ?
//         applications = await findDateApp(req.auth.id, req.params.date) :
//         applications = await findDateApp(req.params.mentorId, req.params.date)
//         return res.status(200).send(applications);
//     } catch (err) {
//         console.error(err);
//         return res.status(500).send("Internal Server Error!");
//     };
// };

// const listMentorJobApplication = async (req, res) => {
//     const filter = req.params.acceptedStatus === "all" ? null : req.params.acceptedStatus;
//     try {
//         const allJobs = [];
//         if(req.params.mentorId === "null") {
//             allJobs = await listMentorApplication(req.auth.id, filter);
//         } else if(req.params.mentorId !== "null") {
//             allJobs = await listMentorApplication(req.params.mentorId, filter);
//         }
//         return res.status(200).send(allJob);
//     } catch (err) {
//         console.error(err);
//         return res.status(500).send("Internal Server Error!");
//     };
// };

// module.exports = {
//     createMentorJobApplication,
//     deleteMentorJobApplication,
//     updateMentorJobApplication,
//     findOneApplication,
//     findApplicationByMentorJob,
//     findAppFromDate,
//     listMentorJobApplication,
// };

const { findOneJob } = require("../pkg/jobs");
const {
    findMentorApplicationByJobId,
    createMentorApplication,
    findApplication,
    updateMentorApplication,
    deleteMentorApplication,
    findDateApp,
    listMentorApplication,
} = require("../pkg/jobsapplication");

const createMentorJobApplication = async (req, res) => {
    try {
        const applicationExist = await findMentorApplicationByJobId(req.auth.id, req.params.jobId);
        if (applicationExist) {
            return res.status(409).send({ message: "Application for this job already exists!" });
        }

        const job = await findOneJob(req.params.jobId);
        if (!job) {
            return res.status(404).send({ message: "Job not found!" });
        }

        await createMentorApplication({
            jobId: job._id,
            mentorId: req.auth.id,
            companyId: job.companyId,
            status: "pending",
            applicationType: "mentorToCompany",
            acceptedStatus: "pending",
        });

        return res.status(201).send({ message: "Application created!" });
    } catch (err) {
        console.error("Error in createMentorJobApplication:", err);
        return res.status(500).send("Internal Server Error!");
    }
};

const deleteMentorJobApplication = async (req, res) => {
    try {
        const result = await deleteMentorApplication(req.query);
        if (!result) {
            return res.status(404).send({ message: "Application not found!" });
        }
        return res.status(200).send({ message: `The application with id: ${req.query} was deleted!` });
    } catch (err) {
        console.error("Error in deleteMentorJobApplication:", err);
        return res.status(500).send("Internal Server Error!");
    }
};

const updateMentorJobApplication = async (req, res) => {
    try {
        let application = await findApplication(req.params._id);
        if (!application) {
            return res.status(404).send({ message: "Application not found!" });
        }

        application = await updateMentorApplication(req.params._id, req.body);
        return res.status(200).send(application);
    } catch (err) {
        console.error("Error in updateMentorJobApplication:", err);
        return res.status(500).send("Internal Server Error!");
    }
};

const findOneApplication = async (req, res) => {
    try {
        const application = await findApplication(req.params._id);
        if (!application) {
            return res.status(404).send({ message: "Application not found!" });
        }
        return res.status(200).send(application);
    } catch (err) {
        console.error("Error in findOneApplication:", err);
        return res.status(500).send("Internal Server Error!");
    }
};

const findApplicationByMentorJob = async (req, res) => {
    try {
        const application = await findMentorApplicationByJobId(req.auth.id, req.params.jobId);
        return res.status(200).send(Boolean(application));
    } catch (err) {
        console.error("Error in findApplicationByMentorJob:", err);
        return res.status(500).send("Internal Server Error!");
    }
};

const findAppFromDate = async (req, res) => {
    try {
        const applications = await findDateApp(
            req.params.mentorId === "null" ? req.auth.id : req.params.mentorId,
            req.params.date
        );
        return res.status(200).send(applications);
    } catch (err) {
        console.error("Error in findAppFromDate:", err);
        return res.status(500).send("Internal Server Error!");
    }
};

const listMentorJobApplication = async (req, res) => {
    try {
        const filter = req.params.acceptedStatus === "all" ? null : req.params.acceptedStatus;
        const allJobs = await listMentorApplication(
            req.params.mentorId === "null" ? req.auth.id : req.params.mentorId,
            filter
        );
        return res.status(200).send(allJobs);
    } catch (err) {
        console.error("Error in listMentorJobApplication:", err);
        return res.status(500).send("Internal Server Error!");
    }
};

module.exports = {
    createMentorJobApplication,
    deleteMentorJobApplication,
    updateMentorJobApplication,
    findOneApplication,
    findApplicationByMentorJob,
    findAppFromDate,
    listMentorJobApplication,
};
