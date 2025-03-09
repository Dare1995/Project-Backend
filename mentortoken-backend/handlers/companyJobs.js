const { updateOneJob, create, findOneJob, remove, jobListIds, openJobsList, jobListByCompany } = require("../pkg/jobs");
const { validateJob, NewJobValidate } = require("../pkg/jobs/validateJob");

const createJob = async (req, res) => {
    try {
        await validateJob(req.body, NewJobValidate);
        if (req.auth.type !== "company") {
            return res.status(403).send({ message: "Access is only allowed for Companies!" });
        }
        const createNewJob = await create({ ...req.body, companyId: req.auth.id });
        return res.status(201).send(createNewJob);
    } catch (err) {
        if (err.code === 400) {
            return res.status(400).send(err);
        }
        console.error(err);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};

const deleteJob = async (req, res) => {
   try {
    await remove(req.params.id);
    return res.status(200).send({message: `Job with id: ${req.params.id} was succesfully removed!`});
    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error!");
    };
};

const findJob = async (req, res) => {
    try {
        const job = await findOneJob(req.params._id);
        return res.status(200).send(job);
    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error!");
    };
};

const updateJob = async (req, res) => {
    try {
        const jobUpdate = await updateOneJob(req.params.jobId, req.body);
        return res.status(200).send(jobUpdate);
    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
    };
};

const jobListByIds = async (req, res) => {
    try {
        const alljobs = await jobListIds(req.params.ids);
        return res.status(200).send(alljobs);
    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
    };
};

const listJobsByCompany = async (req, res) => {
    try {
        const allJobs = await jobListByCompany(req.params.companyId, "open");
        return res.status(200).send(allJobs);
    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
    };
};

const listCompanyOpen = async (req, res) => {
    try {
        const allJobs = await jobListByCompany(req.auth.id, "open");
        return res.status(200).send(allJobs);
    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
    };
};

const listAllOpenJobs = async (req, res) => {
    try {
        const allJobs = await openJobsList();
        return res.status(200).send(allJobs);
    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
    };
};

module.exports = {
    createJob,
    deleteJob,
    findJob,
    updateJob,
    jobListByIds,
    listJobsByCompany,
    listCompanyOpen,
    listAllOpenJobs
};
