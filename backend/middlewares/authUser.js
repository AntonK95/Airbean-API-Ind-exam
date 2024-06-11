import jwt from 'jsonwebtoken';
import { database } from '../server.js';

const authUser = async (req, res, next) => {

    const { username, password } = req.body;

    const user = await database.findOne({ username, password });

    if(!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId: user.userId, role: user.role }, '123456789', { expiresIn: '24h' });

    req.token = token;

    next();
};

export default authUser;