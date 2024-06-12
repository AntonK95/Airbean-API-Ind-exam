
const checkAdmin = (req, res, next) => {
    // Kontrollera om användaren har rollen admin
    if (req.user.role !== 'admin') {
      // Om användaren inte är admin, returnera ett felmeddelande
      return res.status(403).json({ message: 'Access denied. User is not an admin' });
    }
  
    // Om användaren är admin, fortsätt till nästa middleware
    next();
  };

  export default checkAdmin;