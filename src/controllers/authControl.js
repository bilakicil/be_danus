import { dbPool } from "../config/db.js";

export const registerUser = async (req, res) => {
  const { email, password, nama_lengkap } = req.body;

  if (!email || !password || !nama_lengkap) {
    return res.status(400).json({
      success: false,
      message: "Email, password, dan nama lengkap wajib diisi!",
    });
  }

  let connection;
  try {
    // 1. Ambil koneksi khusus untuk Transaction
    connection = await dbPool.getConnection();
    await connection.beginTransaction();

    // 2. Cek email apakah sudah terdaftar
    const [existingUser] = await connection.query(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );

    if (existingUser.length > 0) {
      await connection.rollback();
      connection.release();
      return res.status(400).json({
        success: false,
        message: "Email sudah terdaftar!",
      });
    }

    // 3. Simpan ke tabel users
    const [userResult] = await connection.query(
      "INSERT INTO users (email, password_hash) VALUES (?, ?)",
      [email, password],
    );

    const newUserId = userResult.insertId;

    // 4. Simpan ke tabel profil (Menggunakan pengguna_id)
    await connection.query(
      "INSERT INTO profil (pengguna_id, nama_lengkap) VALUES (?, ?)",
      [newUserId, nama_lengkap],
    );

    // Jika dua-duanya sukses, commit perubahan ke database
    await connection.commit();
    connection.release();

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
    // Jika ada yang gagal, batalkan semua perubahan
    if (connection) {
      await connection.rollback();
      connection.release();
    }

    console.error("=== ERROR DETAIL REGISTRASI ===");
    console.error("Message:", error.message);
    console.error("SQL Message:", error.sqlMessage);
    console.error("=================================");

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat registrasi",
      error: error.message,
      sqlMessage: error.sqlMessage || null,
    });
  }
};
