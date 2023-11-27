const isAdmin = (req, res, next) => {
    console.log('req.user:', req.user);
    // Check if the user is authenticated and has the admin role
    if(req.user && req.user.role === 'admin') {
        // User is an admin, allow them to proceed
        return next();
    }
    // User is not an admin, deny access
    return res.status(403).json({error: 'You are not authorized to perform this action.'});
}


module.exports = isAdmin