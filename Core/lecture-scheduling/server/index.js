const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
require("dotenv").config();


app.use(cors());
app.use(express.json());


app.use(
  cors({
    origin: [
      "http://localhost:3000",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);


const mongoURI = process.env.MONGODB_URI || "mongodb+srv://demisemyth:G53KOYiNvy8FRCJn@cluster0.r6hlo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection Successful");
  })
  .catch((err) => {
    console.error("DB Connection Error:", err);
    process.exit(1);
  });


app.use("/api/auth", authRoutes);


app.get("/", (req, res) => {
  res.json({
    message: "Server is running; you are seeing this on the deployed server",
  });
});


const port = process.env.PORT || 9090;
const host = process.env.HOST || "0.0.0.0";

app.listen(port, host, () => {
  console.log(`Server started on port ${port}`);
});
