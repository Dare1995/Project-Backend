const mongoose = require("mongoose")

const jobSchema = mongoose.Schema(
    {
        companyId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Account",
            required: true
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        skillsRequired: {
            type: [String],
            default: [],
        },
        status: {
            type: String,
            enum: ["direct", "open"],
            required: true,
            default: "open",
        },
        category: {
            type: String,
            enum: ["software", "science", "finance", "marketing", "other"],
            required: true,
            default: "other",
        },
    },
    { timestamps: true }
);

const JobModel = mongoose.model("Job", jobSchema, "jobs");

const create = async (job) => {
    const newJob = new JobModel(job);
    return await newJob.save();
};

const updateOneJob = async (_id, job) => {
    return await JobModel.updateOne({ _id }, job);
};

const remove = async (_id) => {
    return await JobModel.deleteOne({ _id });
};

const findOneJob = async (_id) => {
    return await JobModel.findOne({ _id });
};

// const jobListId = async (ids) => {
//     const idArray = ids.split(",").map(id => id.trim().toString());
//     return await JobModel.find({_id: { $in: idArray }});
// };
const jobListIds = async (ids) => {
    const idArray = ids.split(",").map(id => id.trim());
    return await JobModel.find({ _id: { $in: idArray } });
};

const listJobsByCompany = async (companyId, status = "open") => {
    return await JobModel.find({ companyId, status });
};

const openJobsList = async (status = "open") => {
    return await JobModel.find({ status });
};

module.exports = {
    create,
    updateOneJob,
    remove,
    findOneJob,
    jobListIds,
    listJobsByCompany,
    openJobsList,
};
