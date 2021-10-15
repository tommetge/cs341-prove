exports.auth = async (req, res, next) => {
    if (!req.user) {
        return res.redirect('/login');
    }

    next();
}

exports.permit = function (...permittedRoles) {
    return (req, res, next) => {
        const user = req.user;
        if (user && permittedRoles.includes(user.role.name)) {
            return next();
        }

        req.flash('error', 'You do not have sufficient permissions to view that page');
        res.redirect('/');
    }
}