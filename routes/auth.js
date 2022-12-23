const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const User = require("../modal/User");

const jwt = require("jsonwebtoken");

//@route post api/auth/register

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  //validate

  if (!username || !password) {
    console.log({ username }, { password });
    return res
      .status(400)
      .json({ success: false, message: "Missing username or password" });
  }
  try {
    const user = await User.findOne({ username });
    if (user)
      return res
        .status(400)
        .json({ success: false, message: "Username already" });

    const hashedPassword = await argon2.hash(password); // ma hao password
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    //token
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.json({
      success: true,
      message: "User created successfully",
      accessToken,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

//@route post api/auth/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({
      success: false,
      message: "Missing username or password",
    });
  try {
    const user = await User.findOne({ username });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Username invalid" });

    //uername found
    //checkpassword
    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid)
      return res
        .status(400)
        .json({ success: false, message: "password invalid" });


    //neu success
    const accessToken = jwt.sign(
        { userId: user._id },
        process.env.ACCESS_TOKEN_SECRET
      );
  
      res.json({
        success: true,
        message: "Login successfully",
        accessToken,
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
