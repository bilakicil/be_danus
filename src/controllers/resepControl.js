import { dbPool } from "../../config/db.js";

// Use Case: Eksplorasi Katalog Resep Nusantara
export const getAllResep = async (request, response) => {
  try {
    const [rows] = await dbPool.query("SELECT * FROM resep");
    return response.status(200).json({ success: true, data: rows });
  } catch (error) {
    return response.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Use Case: Lihat Detail & Langkah Memasak
export const getResepById = async (request, response) => {
  try {
    const { id } = request.params;
    const [rows] = await dbPool.query("SELECT * FROM resep WHERE id = ?", [id]);
    return response.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    return response.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Use Case: Buat Resep Baru
export const createResep = async (request, response) => {
  try {
    const {
      pengguna_id,
      judul_resep,
      deskripsi,
      waktu_masak,
      porsi,
      foto_utama,
      bahan,
      langkah,
    } = request.body;

    // Insert tanpa kolom 'id' karena sudah di-handle auto-increment dari database
    const [result] = await dbPool.query(
      "INSERT INTO resep (pengguna_id, judul_resep, deskripsi, waktu_masak, porsi, foto_utama, bahan, langkah) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        pengguna_id,
        judul_resep,
        deskripsi,
        waktu_masak,
        porsi,
        foto_utama,
        JSON.stringify(bahan),
        JSON.stringify(langkah),
      ],
    );

    return response.status(201).json({
      success: true,
      message: "Resep berhasil dibuat",
      data_id: result.insertId, // Mengembalikan ID resep yang baru dibuat sebagai info tambahan
    });
  } catch (error) {
    return response
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

// Use Case: Edit Resep
export const updateResep = async (request, response) => {
  try {
    const { id } = request.params;
    const { judul_resep, deskripsi, waktu_masak, porsi } = request.body;

    await dbPool.query(
      "UPDATE resep SET judul_resep = ?, deskripsi = ?, waktu_masak = ?, porsi = ? WHERE id = ?",
      [judul_resep, deskripsi, waktu_masak, porsi, id],
    );

    return response
      .status(200)
      .json({ success: true, message: "Resep berhasil diupdate" });
  } catch (error) {
    return response.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Use Case: Hapus Resep
export const deleteResep = async (request, response) => {
  try {
    const { id } = request.params;
    await dbPool.query("DELETE FROM resep WHERE id = ?", [id]);
    return response
      .status(200)
      .json({ success: true, message: "Resep berhasil dihapus" });
  } catch (error) {
    return response.status(500).json({ message: "Terjadi kesalahan server" });
  }
};
