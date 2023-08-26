const express = require("express");

const sendEmail = require("./services/sendEmail");

const { engine } = require("express-handlebars");

const path = require("path");
const errorHandler = require("./middlewares/errorHandler");
const configPath = path.join(__dirname, "..", "config", ".env");
require("colors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserModel = require("./models/userModel");
const RolesModel = require("./models/rolesModel");
require("dotenv").config({ path: configPath });
const authMiddleware = require("./middlewares/authMiddleware");

const connectDB = require("../config/connectDB");
const asyncHandler = require("express-async-handler");
// console.log("Hello".yellow.underline);
// console.log("Hello".red.bold);

const app = express();
app.use(express.static('public'));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "backend/views");

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use("/api/v1", require("./routes/carsRoutes"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.post("/sended", async (req, res) => {
  try {
    res.render("sended", {
      msg: "Contact form sent success",
      user: req.body.userName,
      email: req.body.userEmail,
    });

    await sendEmail(req.body);
  } catch (error) {
    console.log(error.message);
  }

  // res.send(req.body)
});

app.get("/register", (req, res) => {
  res.render("register");
});

// реєстрація - збереження юзера у БД
app.post(
  "/register",
  asyncHandler(async (req, res) => {
    //отримуємо і валідуємо дані від користувача
    const { password, email } = req.body;
    if (!password || !email) {
      res.status(400);
      throw new Error("Provide all required fields");
    }

    // шукаємо користувача в базі даних
    const candidate = await UserModel.findOne({ email });

    //якщо є то робим меседж чи помилку
    if (candidate) {
      res.status(400);
      throw new Error("User already exists");
    }
    //якщо не знайшли, то хешуємо пароль
    const hashPassword = bcrypt.hashSync(password, 5);

    const roles = await RolesModel.findOne({ value: "USER" });

    //збереження користувача в базі
    const user = await UserModel.create({
      ...req.body,
      password: hashPassword,
      roles: [roles.value],
    });
    res.render('registrationSuccess');

    // res.status(201).json({
    //   code: 201,
    //   data: { email: user.email },
    //   message: "Sucsess",
    // });
  })
);

app.get("/login", (req, res) => {
  res.render("login");
});

// автентифікація - порівняння наданих користувачем даних зі збереженими у БД
app.post(
  "/login",
  asyncHandler(async (req, res) => {
    //отримуємо і валідуємо дані від користувача
    const { password, email } = req.body;
    if (!password || !email) {
      res.status(400);
      throw new Error("Provide all required fields");
    }
    // шукаємо користувача в базі і розшифровуємо пароль
    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(400);
      throw new Error("Invalid login or password");
    }
    const isValidPassword = bcrypt.compareSync(password, user.password);
    // якщо не знайшли або не розшифрували, то "Invalid login or password"
    if (!isValidPassword) {
      res.status(400);
      throw new Error("Invalid login or password");
    }

    //якщо все ок, то видаємо токен
    const token = generateToken({
      friends: ["Alla", "Yura", "Alex"],
      id: user._id,
      roles: user.roles,
    });

    //зберігаємо в базі
    user.token = token;
    await user.save();

res.render("loginSuccess");

    // res.status(200).json({
    //   code: 200,
    //   data: { email: user.email, token: user.token },
    //   message: "Sucsess",
    // });
  })
);

function generateToken(data) {
  const payload = { ...data };
  return jwt.sign(payload, "pizza", { expiresIn: "5h" });
}
// авторизація - автентифікація + перевірка прав доступу

// логаут - вихід користувача з додатку
app.get(
  "/logout",
  authMiddleware,
  asyncHandler(async (req, res) => {
    console.log(req.user.id);

    const user = await UserModel.findById(req.user.id);
    user.token = null;
    await user.save();
    res.status(200).json({
      code: 200,

      message: "Logout success",
    });
  })
);

app.use(errorHandler);

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server on port: ${process.env.PORT}`.bold.green.italic);
});
