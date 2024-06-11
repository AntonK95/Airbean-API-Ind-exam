import jwt from 'jsonwebtoken';

const verifyToken = async (req, res, next) => {

    const authHeader = req.headers.authorization;
    console.log(req.headers.authorization);

    if(!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Ta bort Bearer och välj bara tokenet

    jwt.verify(token, '123456789', (error, decoded) => {
        if(error) {
            console.log(token);
            console.log(error);
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }

        req.user = decoded;
        next();
    })
}

export default verifyToken;