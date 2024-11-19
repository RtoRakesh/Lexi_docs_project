const express = require("express");
const connectToDB = require("./config/db");
const cors = require("cors");
const userRouter = require("./routes/userRoutes");
const documentRoutes = require("./routes/documentRoutes");
const auth = require("./middlewares/verify");
const projectRouter = require("./routes/projectRoutes");

require("dotenv").config();

const PORT = process.env.PORT || 5000;
const MONGODB_URL = process.env.MONGODB_URL;
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("This is home Route");
});

app.use("/api/auth", userRouter);
app.use("/api/documents", auth, documentRoutes);
app.use("/projects", auth, projectRouter);

app.listen(PORT, () => {
  try {
    console.log(`Server running on port http://localhost:${PORT}`);
    connectToDB(MONGODB_URL);
  } catch (err) {
    console.log("error while connecting to server");
  }
});
