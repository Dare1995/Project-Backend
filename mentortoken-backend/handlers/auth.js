const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendMail = require("../pkg/helper/sendEmail");
const sendMessage = require("../pkg/helper/sendEmail")

const { getByEmail,
  getById,
  createUser,
  updateUser,
  getCompanies,
  getMentors,
  getMentorByName,
  getCompanyByName,
  getCompanyId,
  getMentorId
} = require("../pkg/user");

const {
  validateAccount,
  AccoutLogin,
  AccoutRegister,
  AccountPassword,
  AccountUpdate,
  AccountContactMessage,
} = require("../pkg/user/validate");
const { getSection } = require("../pkg/config");

const login = async (req, res) => {
  try {
    await validateAccount(req.body, AccoutLogin);
    const { email, password } = req.body;

    const account = await getByEmail(email);

    if (!account) {
      return res.status(400).send("Account not found!");
    }

    const passwordMatch = await bcrypt.compare(password, account.password);
    if (!passwordMatch) {
      return res.status(400).send("Wrong password!");
    }

    const payload = {
      username: account.username,
      email: account.email,
      id: account._id,
      type: account.type,
    };

    const token = jwt.sign(payload, getSection("development").jwt_secret, {
      expiresIn: "7d",
    });

    return res.status(200).send({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error!!");
  }
};

const register = async (req, res) => {
  try {
    await validateAccount(req.body, AccoutRegister);
    const {
      name,
      email,
      password,
      confirmPassword,
      type,
      phone,
      image,
      skills = undefined,
      desc = undefined,
      acceptedJobs = undefined,
      representative = undefined,
      address = undefined,
      jobsPosted = undefined
    } = req.body;

    const existsEmail = await getByEmail(email);
    if (existsEmail) {
      return res.status(400).send({ message: "Account with this email already exists!" });
    }
    if (password !== confirmPassword) {
      return res
        .status(400)
        .send({ message: "Confirm password is not the same as password!" });
    }
    req.body.password = bcrypt.hashSync(password);
    const account = await createUser(req.body);
    return res.status(201).send(account);

  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Internal Server Error!" });
  };
};

const update = async (req, res) => {
  try {
    await validateAccount(req.body, AccountUpdate);
    let updatedUser = await getById(req.auth.id);
    if (updatedUser) {
      await updateUser(req.auth.id, req.body);
      updatedUser = await getById(req.auth.id);
      return res.status(200).send(updatedUser);
    } else {
      return res.status(400).send("Account not found!");
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Internal Server Error!" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const existsEmail = await getByEmail(email);
    if (existsEmail) {
      const objectData = {
        id: existsEmail._id,
        exp: new Date().getTime() / 1000 + 15 * 60
      };

      const token = jwt.sign(objectData, getSection("development").jwt_secret);

      const emailSendResponse = await sendMail(
        email,
        "Mentor Token Password Reset",
        "resetPasswordEmail",
        token
      );

      return res.status(200).send(emailSendResponse);
    } else {
      return res.status(200).send(false);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Internal Server Error!" });
  }
};

const resetPasswordEmail = async (req, res) => {
  try {
    const resetToken = req.params.resetToken;
    if (!resetToken) {
      return res.status(400).json({ error: "Missing reset token" });
    }

    const decodedToken = jwt.verify(
      resetToken,
      getSection("development").jwt_secret
    );

    if (!decodedToken.id || !decodedToken.exp) {
      return res.status(400).json({ error: "Invalid reset token" });
    }

   const user = await getById(decodedToken.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      email: user.email,
      expiration: decodedToken.exp,
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Reset token expired" });
    }
    if (err.name === "JsonWebTokenError" || err.name === "NotBeforeError") {
      return res.status(400).json({ error: "Invalid reset token" });
    }

    console.error("Unexpected error during reset token validation:", err.message);
    return res.status(500).json({ error: "Internal Server Error!" });
  }
};

const resetUserPassword = async (req, res) => {
  try {

    await validateAccount(req.body, AccountPassword);
    const { newPassword, confirmNewPassword } = req.body;

    const decodedToken = jwt.verify(req.params.resetToken, getSection("development").jwt_secret);
    const decodedParsed = decodedToken;

    if (decodedParsed.exp < Math.floor(Date.now() / 1000)) {
      return res.status(400).send({
        status: false,
        message: "Reset token is invalid or has expired.",
      });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(422).send({
        status: false,
        message: "The passwords you entered do not match. Please try again.",
      });
    }

    const user = await getById(decodedParsed.id);

    if (bcrypt.compareSync(newPassword, user.password)) {
      return res.status(422).send({
        status: false,
        message: "New password cannot be the same as the old password! Try again!",
      });
    }

    const newPasswordReset = bcrypt.hashSync(newPassword);

    await updateUser(decodedParsed.id, { password: newPasswordReset });

    return res.status(200).send({
      status: true,
      message: "Password has been updated, please login!",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Internal Server Error!" });
  }
};


const checkEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const existsEmail = await getByEmail(email);
    if (existsEmail) {
      return res.status(200).send(true);
    } else {
      return res.status(200).send(false);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Internal Server Error!" });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await getById(req.auth.id);
    if (user) {
      return res.status(200).send(user)
    } else {
      return res.status(400).send("Account not found!");
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Internal Server Error!" })
  };
};

const getAllCompanies = async (req, res) => {
  try {
    const companies = await getCompanies(req.query);
    return res.status(200).send(companies);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Internal Server Error!" })
  }
}

const getAllMentors = async (req, res) => {
  try {
    const mentors = await getMentors();
    return res.status(200).send(mentors);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Internal Server Error!" })
  };
};

const getUserMentorName = async (req, res) => {
  try {
    const user = await getMentorByName(req.params.name);
    return res.status(200).send(user);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Internal Server Error!" })
  };
};

const getUserCompanyName = async (req, res) => {
  try {
    const user = await getCompanyByName(req.params.name);
    return res.status(200).send(user);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Internal Server Error!" })
  };
};

const getCompanyById = async (req, res) => {
  try {
    const company = await getCompanyId(req.params._id);
    return res.status(200).send(company);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Internal Server Error!" })
  };
};

const getMentorById = async (req, res) => {
  try {
    const mentor = await getMentorId(req.params._id);
    return res.status(200).send(mentor);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Internal Server Error!" })
  };
};

const contactMessage = async (req, res) => {
  try {
    await validateAccount(req.body, AccountContactMessage);
    const emailSendResponse = await sendMessage(
      "kiprijanovski.darko95@gmail.com",
      "Mentor Token contact message",
      "contactMessage",
      data = {
        ...req.body
      }
    );
    return res.status(200).send(emailSendResponse);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Internal Server Error!" })
  };
};

module.exports = {
  login,
  register,
  update,
  forgotPassword,
  resetPasswordEmail,
  resetUserPassword,
  checkEmail,
  getUser,
  getAllCompanies,
  getAllMentors,
  getUserCompanyName,
  getUserMentorName,
  getCompanyById,
  getMentorById,
  contactMessage,
};
