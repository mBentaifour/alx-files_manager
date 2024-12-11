import sha1 from 'sha1';
import dbClient from '../utils/db';

/**
 * Controller handling User related operations
 */
class UsersController {
  /**
   * Creates a new user in the database
   * @param {Request} req Express request object
   * @param {Response} res Express response object
   */
  static async postNew(req, res) {
    // Extract email and password from request body
    const { email, password } = req.body;

    // Check if email is provided
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    // Check if password is provided
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    // Check if user already exists
    const existingUser = await dbClient.db.collection('users')
      .findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({ error: 'Already exist' });
    }

    // Hash password and create new user
    const hashedPassword = sha1(password);
    const result = await dbClient.db.collection('users')
      .insertOne({
        email,
        password: hashedPassword,
      });

    // Return new user data
    return res.status(201).json({
      id: result.insertedId,
      email,
    });
  }
}

export default UsersController;

