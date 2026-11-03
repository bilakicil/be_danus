import { dbPool } from "../config/db.js";

export const register = async (req, res) => {
  const { email, password, nama_lengkap } = req.body;

  // Validasi input sederhana
  if (!email || !password || !nama_lengkap) {
    return res.status(400).json({
      success: false,
      message: "Email, password, dan nama lengkap wajib diisi!",
    });
  }

  try {
    // 1. Cek apakah email sudah terdaftar
    const [existingUser] = await dbPool.query(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email sudah terdaftar!",
      });
    }

    // 2. Insert ke tabel users
    const [userResult] = await dbPool.query(
      "INSERT INTO users (email, password_hash) VALUES (?, ?)",
      [email, password],
    );

    const newUserId = userResult.insertId;

    // 3. Insert ke tabel profil
    await dbPool.query(
      "INSERT INTO profil (pengguna_id, nama_lengkap) VALUES (?, ?)",
      [newUserId, nama_lengkap],
    );

    return res.status(201).json({
      success: true,
      message: "Registrasi berhasil!",
      data: {
        user_id: newUserId,
        email,
        nama_lengkap,
      },
    });
  } catch (error) {
    // CONSOLE ERROR UNTUK VERCEL LOGS
    console.error("=== ERROR DETAIL REGISTRASI ===");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("SQL Message:", error.sqlMessage);
    console.error("Stack:", error.stack);
    console.error("=================================");

    // KIRIM DETAL ERROR KE POSTMAN
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat registrasi",
      error: error.message,
      sqlMessage: error.sqlMessage || null,
      code: error.code || null,
    });
  }
};
