const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    //отримуємо токен з header
    const [type, token] = req.headers.authorization.split(" ");
    if (type === "Bearer" && token) {
      const decoded = jwt.verify(token, "pizza");
      req.user = decoded;
      next();
    }

    // розшифровуємо токен
    // передаємо інформацію з токена далі
  } catch (error) {
    res.status(401).json({
      code: 401,
      message: error.message,
    });
  }
};

//{
//   friends: [ 'Alla', 'Yura', 'Alex' ],
//   id: '64d738814764c14641f9c5a1',
//   iat: 1691829001,
//   exp: 1691847001
// }
