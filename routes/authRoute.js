const express = require("express");
const passport = require("../middleware/passport");
const { forwardAuthenticated } = require("../middleware/checkAuth");
const authController = require("../controller/auth_controller");
const router = express.Router();
const upload = require("../middleware/multer");

// Fix this to work with passport! The registration does not need to work, you can use the fake database for this.
router.get("/register", forwardAuthenticated, authController.register);
router.get("/login", forwardAuthenticated, authController.login);

router.post(
  "/register",
  upload.single("avatar"),
  authController.registerSubmit,
  passport.authenticate("local", {
    successRedirect: "/reminders",
    failureRedirect: "/auth/login",
  })
);
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/reminders",
    failureRedirect: "/auth/login", // Route back to /auth/login on failed authentication
  })
);

router.get(
  "/github",
  forwardAuthenticated,
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: "/reminders",
    failureRedirect: "/auth/login",
  })
);

router.get("/logout", authController.logout);

module.exports = router;
