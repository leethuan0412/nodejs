require("dotenv").config();

const express = require("express");
const app = express();
const mongooose = require("mongoose");
const authRouter = require("./routes/auth");
const postRouter =require('./routes/post')

const connectDB = async () => {
  try {
    await mongooose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_USERNAME}@cluster0.6rd0gxv.mongodb.net/?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

connectDB();
app.get("/", (req, res) => res.send("hello world"));
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);

const port = 3000;
app.listen(port, () => console.log(`Server port ${port}`));
