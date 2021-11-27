const imgur = require("imgur");
const fetch = require("node-fetch");
const { registerUser } = require("../controller/userController");
const fs = require("fs");

let authController = {
  login: (req, res) => {
    res.render("auth/login");
  },

  register: (req, res) => {
    res.render("auth/register");
  },

  registerSubmit: async (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    if (req.file) {
      const file = req.file;
      try {
        const resp = await imgur.uploadFile(`./uploads/${file.filename}`);
        const imageUrl = resp.link;
        await registerUser(email, password, name, imageUrl);
        fs.unlinkSync(`./uploads/${file.filename}`);
      } catch (err) {
        console.log(err);
      }
    } else {
      const clientId = process.env.UNSPLASH_ID;
      const query = "quokka";
      const url = `https://api.unsplash.com/photos?client_id=${clientId}&query=${query}`;
      try {
        const resp = await fetch(url);
        const data = await resp.json();
        const num = Math.floor(Math.random() * data.length);
        const imageFromUnsplash = data[num]["urls"]["thumb"];
        await registerUser(email, password, name, imageFromUnsplash);
      } catch (err) {
        console.log(err);
      }
    }

    next();
  },

  logout: (req, res) => {
    req.logout();
    res.redirect("/auth/login");
  },
};

module.exports = authController;
