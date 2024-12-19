const mongoose = require("mongoose")

const JobApplicationSchema = mongoose.Schema(
    {
        jobId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Job",
            required: true,
        },
        companyId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Account",
            required: true,
        },
        mentorId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Account",
            required: true,
            default: null,
        },
        applicationType: {
            type: String,
            enum: ["mentorToCompany", "companyToMentor"],
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "rejected", "assigned"],
            required: true,
            default: "pending",
        },
        acceptedStatus: {
            type: String,
            enum: ["done", "rejected", "in progress", "pending"],
            required: true,
            default: "pending"
        },
    },

    { timestamps: true }
);

const JobApplicationModel = mongoose.model("Application", JobApplicationSchema, "applications");

// This is for Company!
const createCompanyApplication = async (application) => {
    const newApplication = new JobApplicationModel(application);
    return await newApplication.save();
};

const updateCompanyApplication = async (_id, application) => {
    return await JobApplicationModel.updateOne({ _id }, application);
};

const deleteCompanyApplication = async (_id) => {
    return await JobApplicationModel.deleteOne({ _id });
};

const listApplication = async (application) => {
    return await JobApplicationModel.findOne(application);
};

const listCompanyApplication = async (companyId, acceptedStatus) => {
    console.log("This is what i got: ", { companyId, acceptedStatus });
    if (acceptedStatus) {
        return await JobApplicationModel.find({ companyId, acceptedStatus });
    } else {
        return await JobApplicationModel.find({ companyId });
    };
};

const listCompanyMentorApp = async (companyId, mentorId, acceptedStatus = false) => {
    if (acceptedStatus && mentorId !== "null") {
        return await JobApplicationModel.find({ companyId, mentorId, acceptedStatus });
    } else {
        return await JobApplicationModel.find({ companyId, mentorId });
    };
};

// This is for Mentor!
const createMentorApplication = async (job) => {
    const application = new JobApplicationModel(job);
    return await application.save();
};

const updateMentorApplication = async (_id, job) => {
    return await JobApplicationModel.updateOne({ _id }, job);
};

const deleteMentorApplication = async (_id) => {
    return await JobApplicationModel.deleteOne({ _id });
};

const listMentorApplication = async (mentorId, acceptedStatus = null) => {
    if (acceptedStatus) {
        return await JobApplicationModel.find({ mentorId, acceptedStatus });
    } else {
        return await JobApplicationModel.find({ mentorId });
    };
};

const findMentorApplicationByJobId = async (mentorId, jobId) => {
    return await JobApplicationModel.findOne({ mentorId, jobId });
};

const findApplication = async (_id) => {
    return await JobApplicationModel.findOne({ _id });
};

const findPendingApplicationJobId = async (jobId) => {
    return await Application.find({ jobId, acceptedStatus: "pending" });
};

const findDateApp = async (mentorId, date) => {
    if (date !== "null") {
        return await JobApplicationModel.find({
            mentorId, updatedAt: { $gte: date }
        });
    } else {
        return await JobApplicationModel.find({ mentorId });
    };
};

const findCompanyDateApp = async (companyId, date) => {
    return await JobApplicationModel.find({ companyId, updatedAt: { $gte: date } });
};

const findCompanyDirect = async (companyId, mentorId) => {
    return await JobApplicationModel.find({ companyId, mentorId, applicationType: "companyToMentor" });
};

module.exports = {
    createCompanyApplication,
    updateCompanyApplication,
    deleteCompanyApplication,
    listApplication,
    listCompanyApplication,
    listCompanyMentorApp,
    findDateApp,
    findCompanyDateApp,
    findCompanyDirect,
    createMentorApplication,
    updateMentorApplication,
    deleteMentorApplication,
    findApplication,
    listMentorApplication,
    findMentorApplicationByJobId,
    findPendingApplicationJobId,
};

