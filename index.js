import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { dataBaseConnection } from "./db.js";
import router from "./routes/api.js";

// This is main file and runs first

// configure the environment variables
dotenv.config();

// express is assigned to app variable and port number
const app = express();
const PORT = process.env.PORT || 7050;

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api", router);

// sanity check server
app.get("/", (req, res) => {
  res.send("Assiging Mentor Task");
});

// connecting to the database
dataBaseConnection();

// server connection
app.listen(PORT, () => console.log(`Server running on PORT => ${PORT}`));
