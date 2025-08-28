import pool from '../config/db';
import {Detail} from '../types/index'
class DetailModel {
    static async getAll(): Promise<Detail[]> {
        const result = await pool.query("SELECT * FROM details");
        return result.rows;
    }

    static async getById(id: number): Promise<Detail | null> {
        const result = await pool.query("SELECT * FROM details WHERE id=$1", [id]);
        return result.rows[0] || null;
    }
    static async create(detail: Detail): Promise<Detail> {
    const result = await pool.query(
      "INSERT INTO details (user_id, symptoms, treatment, image) VALUES ($1, $2, $3, $4) RETURNING *",
      [detail.user_id, detail.symptoms, detail.treatment, detail.image]
    );
    return result.rows[0];
  }
    static async update(id: number, detail: Detail): Promise<Detail | null> {
        const result = await pool.query(
        "UPDATE details SET user_id=$1, symptoms=$2, treatment=$3, image=$4 WHERE id=$5 RETURNING *",
        [detail.user_id, detail.symptoms, detail.treatment, detail.image, id]
        );
        return result.rows[0] || null;
    }
    static async delete(id: number): Promise<boolean> {
        const result = await pool.query("DELETE FROM details WHERE id=$1", [id]);
        return result.rowCount > 0;
    }

}

export default DetailModel;