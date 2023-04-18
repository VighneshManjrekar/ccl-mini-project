const router = require("express").Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const { register, login, logout } = require("../controllers/user.controller");

router.post("/register", upload.single("profile"), register);
router.post("/login", login);
router.get("/logout", logout);

module.exports = router;
