import { dbPool } from "../../config/db.js";

export const registerUser = async (request, response) => {
  try {
    const { email, password, nama_lengkap } = request.body;

    // 1. Insert ke tabel users (tanpa menyertakan id)
    const [userResult] = await dbPool.query(
      "INSERT INTO users (email, password_hash) VALUES (?, ?)",
      [email, password],
    );

    // 2. Ambil ID otomatis (auto-increment) yang baru saja terbuat
    const newUserId = userResult.insertId;

    // 3. Insert ke tabel profil menggunakan ID dari user tersebut
    await dbPool.query("INSERT INTO profil (id, nama_lengkap) VALUES (?, ?)", [
      newUserId,
      nama_lengkap,
    ]);

    return response.status(201).json({
      success: true,
      message: "Berhasil registrasi!",
    });
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json({ message: "Terjadi kesalahan pada server" });
  }
};

export const loginUser = async (request, response) => {
  try {
    const { email, password } = request.body;
    const [rows] = await dbPool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0 || rows[0].password_hash !== password) {
      return response
        .status(401)
        .json({ success: false, message: "Email atau password salah" });
    }

    return response.status(200).json({
      success: true,
      message: "Berhasil login!",
      data: rows[0],
    });
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json({ message: "Terjadi kesalahan pada server" });
  }
};
