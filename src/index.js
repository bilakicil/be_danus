import express from "express";
import dotenv from "dotenv";
import authRoute from "./routes/authRoute.js";
import resepRoute from "./routes/resepRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Inisialisasi Routes
app.use("/api/auth", authRoute);
app.use("/api", resepRoute);

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
