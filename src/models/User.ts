import db from '../config/database';
import { hashPassword, comparePassword } from '../utils/passwordUtils';

export interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
}

export class UserModel {
  static async create(user: User): Promise<User> {
    const hashedPassword = await hashPassword(user.password);
    
    const query = `
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, username, email
    `;
    
    return db.one(query, [
      user.username, 
      user.email, 
      hashedPassword
    ]);
  }

  static async findByEmail(email: string): Promise<User | null> {
    try {
      const query = 'SELECT * FROM users WHERE email = $1';
      return await db.oneOrNone(query, [email]);
    } catch {
      return null;
    }
  }

  static async validatePassword(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    
    if (!user) return null;

    const isValid = await comparePassword(password, user.password);
    
    return isValid ? user : null;
  }
}