// const { updateOneJob, create, findOneJob, remove, jobListIds, openJobsList, listJobsByCompany } = require("../pkg/jobs");

// const createJob = async (req, res) => {
//     try {
//         const data = {
//             ...req.body,
//             owner: req.auth.id,
//         };
//         const newJob = await create(data);
//         return res.status(200).send(newJob);
//     } catch (err) {
//         console.error(err);
//         return res.status(500).send("Internal Server Error!");
//     };
// };

// const deleteJob = async (req, res) => {
//     try {
//         const jobId = req.params.id;
//         const deleteJob = await remove(jobId);
//         return res.status(200).send(deleteJob);
//     } catch (err) {
//         console.error(err);
//         return res.status(500).send("Internal Server Error!");
//     };
// };

// const findJob = async (req, res) => {
//     try {
//         const job = await findOneJob(req.params._id);
//         return res.status(200).send(job);
//     } catch (err) {
//         console.error(err);
//         return res.status(500).send("Internal Server Error!");
//     };
// };

// const updateJob = async (req, res) => {
//     try {
//         const jobUpdate = await updateOneJob(req.params.jobId, req.body);
//         return res.status(200).send(jobUpdate);
//     } catch (err) {
//         console.log(err);
//         return res.status(500).send("Internal Server Error");
//     };
// };

// const jobListById = async (req, res) => {
//     try {
//         const alljobs = await jobListIds(req.params.ids);
//         return res.status(200).send(alljobs);
//     } catch (err) {
//         console.log(err);
//         return res.status(500).send("Internal Server Error");
//     };
// };

// const jobListByCompany = async (req, res) => {
//     try {
//         const allJobs = await listJobsByCompany(req.param.companyId, "open");
//         return res.status(200).send(allJobs);
//     } catch (err) {
//         console.log(err);
//         return res.status(500).send("Internal Server Error");
//     };
// };

// const listCompanyOpen = async (req, res) => {
//     try {
//         const allJobs = await jobListByCompany(req.auth.id, "open");
//         return res.status(200).send(allJobs);
//     } catch (err) {
//         console.log(err);
//         return res.status(500).send("Internal Server Error");
//     };
// };

// const listAllOpenJobs = async (req, res) => {
//     try {
//         const allJobs = await openJobsList();
//         return res.status(200).send(allJobs);
//     } catch (err) {
//         console.log(err);
//         return res.status(500).send("Internal Server Error");
//     };
// };

// module.exports = {
//     createJob,
//     deleteJob,
//     findJob,
//     updateJob,
//     jobListById,
//     jobListByCompany,
//     listCompanyOpen,
//     listAllOpenJobs
// }

const {
    updateOneJob,
    create,
    findOneJob,
    remove,
    jobListIds,
    openJobsList,
    listJobsByCompany,
} = require("../pkg/jobs");

const handleError = (res, err, code = 500, message = "Internal Server Error") => {
    console.error(err);
    return res.status(code).send({ success: false, message, error: err.message || err });
};

const createJob = async (req, res) => {
    try {
        const data = {
            ...req.body,
            owner: req.auth.id,
        };
        const newJob = await create(data);
        return res.status(201).send({ success: true, data: newJob });
    } catch (err) {
        return handleError(res, err);
    }
};

const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const deletedJob = await remove(jobId);
        if (!deletedJob) {
            return res.status(404).send({ success: false, message: "Job not found" });
        }
        return res.status(200).send({ success: true, data: deletedJob });
    } catch (err) {
        return handleError(res, err);
    }
};

const findJob = async (req, res) => {
    try {
        const job = await findOneJob(req.params._id);
        if (!job) {
            return res.status(404).send({ success: false, message: "Job not found" });
        }
        return res.status(200).send({ success: true, data: job });
    } catch (err) {
        return handleError(res, err);
    }
};

const updateJob = async (req, res) => {
    try {
        const updatedJob = await updateOneJob(req.params.jobId, req.body);
        if (!updatedJob) {
            return res.status(404).send({ success: false, message: "Job not found" });
        }
        return res.status(200).send({ success: true, data: updatedJob });
    } catch (err) {
        return handleError(res, err);
    }
};

const jobListById = async (req, res) => {
    try {
        const allJobs = await jobListIds(req.params.ids);
        return res.status(200).send({ success: true, data: allJobs });
    } catch (err) {
        return handleError(res, err);
    }
};

const jobListByCompany = async (req, res) => {
    try {
        const allJobs = await listJobsByCompany(req.params.companyId, "open");
        return res.status(200).send({ success: true, data: allJobs });
    } catch (err) {
        return handleError(res, err);
    }
};

const listCompanyOpen = async (req, res) => {
    try {
        const allJobs = await listJobsByCompany(req.auth.id, "open");
        return res.status(200).send({ success: true, data: allJobs });
    } catch (err) {
        return handleError(res, err);
    }
};

const listAllOpenJobs = async (req, res) => {
    try {
        const allJobs = await openJobsList();
        return res.status(200).send({ success: true, data: allJobs });
    } catch (err) {
        return handleError(res, err);
    }
};

module.exports = {
    createJob,
    deleteJob,
    findJob,
    updateJob,
    jobListById,
    jobListByCompany,
    listCompanyOpen,
    listAllOpenJobs,
};
