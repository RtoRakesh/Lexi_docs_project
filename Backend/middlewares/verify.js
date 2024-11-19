const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const auth = async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    //console.log(token);

    //decoding the token for userid
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ _id: decoded.user.id });

    if (!user) {
      throw new Error("User not found");
    }
    // Attach user and token to request object for further processing
    req.user = user;
    req.token = token;

    next();
  } catch (err) {
    console.log(err);

    res.status(401).json({ error: "Please authenticate" });
  }
};

module.exports = auth;
