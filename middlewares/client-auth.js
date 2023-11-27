const isClient = (req, res, next) => {
    // Check if the user is authenticated and has the Client role
    if (req.user && req.user.role === 'client') {

    // User is a client, allow them to proceed
    next()
}else {
    // User is not a client, deny access
res.status(404).json({error: 'You are not authorized to perform this action.'})
}
}
module.exports= isClient;