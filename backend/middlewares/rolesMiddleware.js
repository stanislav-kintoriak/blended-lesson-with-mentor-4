const jwt = require("jsonwebtoken");

module.exports = (rolesArr) => {
  return (req, res, next) => {
    try {
      const decoded = req.user;
      const { roles } = decoded;
      let hasRole = false;
      roles.forEach((role) => {
        if (rolesArr.includes(role)) {
          hasRole = true;
        }
      });
      if (!hasRole) {
        res.status(403);
        throw new Error("Forbidden");
      }

      next();
    } catch (error) {
      res.status(403).json({
        code: 403,
        message: error.message,
      });
    }
  };
};
