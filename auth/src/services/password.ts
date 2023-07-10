import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

//scrypt is call back based. make it promise based
const scryptAsync = promisify(scrypt);

export class Password {
  //fn to hash plain text password
  static async toHash(password: string) {
    const salt = randomBytes(8).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${buf.toString("hex")}.${salt}`;
  }

  static async compare(storedPassword: string, suppliedPassWord: string) {
    const [hashedPassword, salt] = storedPassword.split(".");
    const buf = (await scryptAsync(storedPassword, salt, 64)) as Buffer;

    return buf.toString("hex") === hashedPassword;
  }
}
