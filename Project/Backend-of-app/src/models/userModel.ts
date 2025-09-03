import pool from '../config/db';
import {User} from '../types/index'

class UserModel {
    constructor(private db: any) {}


    static async getAll(): Promise<User[]> {
    const result = await pool.query("SELECT * FROM users");
    return result.rows;
  }
    static async create(user: User): Promise<User> {
    const result = await pool.query(
      "INSERT INTO users (name, age, address, contact) VALUES ($1, $2, $3, $4) RETURNING *",
      [user.name, user.age, user.address, user.contact]
    );
    return result.rows[0] ;
  }

    static async getById(id: number): Promise<User | null> {
    const result = await pool.query("SELECT * FROM users WHERE id=$1", [id]);
    return result.rows[0] || null;
  }

    static async update(id: number, user: User): Promise<User | null> {
    const result = await pool.query(
      "UPDATE users SET name=$1, age=$2, address=$3, contact=$4 WHERE id=$5 RETURNING *",
      [user.name, user.age, user.address, user.contact, id]
    );
    return result.rows[0] || null;
  }

    static async delete(id: number): Promise<boolean> {
    const result = await pool.query("DELETE FROM users WHERE id=$1", [id]);
    return result.rowCount > 0;
  }
  static async getUserWithDetails(id: number) {
    const result = await pool.query(
      `SELECT u.id as user_id, u.name, u.age, u.address, u.contact,
              d.id as detail_id, d.symptoms, d.treatment, d.image
       FROM users u
       LEFT JOIN details d ON u.id = d.user_id
       WHERE u.id = $1`,
      [id]
    );
    return result.rows;
  }
}

export default UserModel;