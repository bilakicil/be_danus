import { dbPool } from "../../config/db.js";
// 1. Controller LOGIN
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email dan password wajib diisi!",
    });
  }

  try {
    const [rows] = await dbPool.query(
      "SELECT id, email, password_hash FROM users WHERE email = ? AND password_hash = ?",
      [email, password],
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login berhasil!",
      data: rows[0],
    });
  } catch (error) {
    console.error("Error Login:", error.message);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
};

// 2. Controller REGISTER
export const registerUser = async (req, res) => {
  const { email, password, nama_lengkap } = req.body;

  if (!email || !password || !nama_lengkap) {
    return res.status(400).json({
      success: false,
      message: "Email, password, dan nama lengkap wajib diisi!",
    });
  }

  try {
    // Cek email apakah sudah terdaftar
    const [existing] = await dbPool.query(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email sudah terdaftar!",
      });
    }

    // Insert ke tabel users
    const [userResult] = await dbPool.query(
      "INSERT INTO users (email, password_hash) VALUES (?, ?)",
      [email, password],
    );

    const newUserId = userResult.insertId;

    // Insert ke tabel profil (menggunakan pengguna_id)
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
    console.error("Error Register:", error.message);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat registrasi",
      error: error.message,
    });
  }
};
