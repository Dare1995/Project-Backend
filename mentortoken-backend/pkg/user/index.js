const mongoose = require("mongoose");

const accountSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["company", "mentor"],
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
      default: "",
    },
    role: {
      type: String,
      required: function() {
        return this.type === "mentor";
      },
      default: function() {
          return this.type === "mentor" ? "" : undefined;
        }
    },
    skills: {
      type: [String],
      required: function() {
        return this.type === "mentor";
      },
      default: function() {
          return this.type === "mentor" ? [] : undefined;
        }
    },
    desc: {
      type: String,
      required: function() {
        return this.type === "mentor";
      },
      default: function() {
          return this.type === "mentor" ? "" : undefined;
        }
    },
    acceptedJobs: {
      type: [mongoose.SchemaTypes.ObjectId],
      required: function() {
        return this.type === "mentor";
      },
      default: function() {
          return this.type === "mentor" ? [] : undefined;
        }
    },
    representative: {
      type: String,
      required: function() {
        return this.type === "company";
      },
      default: function() {
          return this.type === "company" ? "" : undefined;
        }
    },
    address: {
      type: String,
      required: function() {
        return this.type === "company";
      },
      default: function() {
          return this.type === "company" ? "" : undefined;
        }
    },
    jobsPosted: {
      type: [mongoose.SchemaTypes.ObjectId],
      required: function() {
        return this.type === "company";
      },
      default: function() {
          return this.type === "company" ? [] : undefined;
        }
    },
  },
  { timestamps: true }
);

const AccountsModel = mongoose.model("Account", accountSchema, "accounts");

const createUser = async (account) => {
  const newAccount = new AccountsModel(account);
  return await newAccount.save();
};

const updateUser = async (_id, account) => {
  return await AccountsModel.updateOne({ _id }, account);
};

const deleteUser = async (_id) => {
  return await AccountsModel.deleteOne({ _id })
}

const getByEmail = async (email) => {
  return await AccountsModel.findOne({ email });
};

const getById = async (_id) => {
  return await AccountsModel.findOne({_id});
};

module.exports = {
  createUser,
  updateUser,
  getByEmail,
  getById,
  deleteUser,
};