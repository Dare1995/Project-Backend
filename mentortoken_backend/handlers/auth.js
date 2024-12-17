const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendMail = require("../pkg/helper/sendMail");

const { getByEmail, getById, createUser, updateUser, setNewPassword } = require("../pkg/user");
const {
  validateAccount,
  AccoutLogin,
  AccoutRegister,
  AccountPassword,
  AccountUpdate,
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
    return res.status(500).send("Internal Server Error!");
  }
};

const register = async (req, res) => {
  try {
    await validateAccount(req.body, AccoutRegister);
    // const { username, email, password, confirmPassword } = req.body;
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
    return res.status(500).send({ error: "Internal Server Error" });
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
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const existsEmail = await getByEmail(email);
    // Check if there is a user registered with this email
    if (existsEmail) {
      const objectData = {
        id: existsEmail._id,
        exp: new Date().getTime() / 1000 + 15 * 60
      };

      // Create a token using JWT
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
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

const resetPasswordEmail = async (req, res) => {
  try {
    // Validate the presence of resetToken
    const resetToken = req.params.resetToken;
    if (!resetToken) {
      return res.status(400).json({ error: "Missing reset token" });
    }

    // Decode and verify the JWT token
    const decodedToken = jwt.verify(
      resetToken,
      getSection("development").jwt_secret
    );

    // Validate that the token contains the required claims
    if (!decodedToken.id || !decodedToken.exp) {
      return res.status(400).json({ error: "Invalid reset token" });
    }

    // Fetch the user by ID
    const user = await getById(decodedToken.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Respond with the user's email and token expiration
    return res.status(200).json({
      email: user.email,
      expiration: decodedToken.exp,
    });
  } catch (err) {
    // Handle JWT-specific errors
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Reset token expired" });
    }
    if (err.name === "JsonWebTokenError" || err.name === "NotBeforeError") {
      return res.status(400).json({ error: "Invalid reset token" });
    }

    // Log unexpected errors and respond with a generic error
    console.error("Unexpected error during reset token validation:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const resetUserPassword = async (req, res) => {
  try {
    // Validate the input
    await validateAccount(req.body, AccountPassword);
    const { newPassword, confirmNewPassword } = req.body;

    // Verify and decode the JWT token
    const decodedToken = jwt.verify(req.params.resetToken, getSection("development").jwt_secret);
    const decodedParsed = decodedToken; // No need for JSON.parse()

    // Check if the token is expired
    if (decodedParsed.exp < Math.floor(Date.now() / 1000)) {
      return res.status(400).send({
        status: false,
        message: "Reset token is invalid or has expired.",
      });
    }

    // Check if passwords match
    if (newPassword !== confirmNewPassword) {
      return res.status(422).send({
        status: false,
        message: "The passwords you entered do not match. Please try again.",
      });
    }

    // Fetch the user by ID
    const user = await getById(decodedParsed.id);

    // Check if the new password matches the old password
    if (bcrypt.compareSync(newPassword, user.password)) {
      return res.status(422).send({
        status: false,
        message: "New password cannot be the same as the old password! Try again!",
      });
    }

    // Hash the new password
    const newPasswordReset = bcrypt.hashSync(newPassword);

    // Update the user's password in the database
    await updateUser(decodedParsed.id, { password: newPasswordReset });

    // Respond with success
    return res.status(200).send({
      status: true,
      message: "Password has been updated, please login!",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};


const checkEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const existsEmail = await getByEmail(email);
    // check if there is user registered with this email
    if (existsEmail) {
      return res.status(200).send(true);
    } else {
      return res.status(200).send(false);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

module.exports = {
  login,
  register,
  update,
  forgotPassword,
  resetPasswordEmail,
  resetUserPassword,
  checkEmail,
};
