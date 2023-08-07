const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "isaac.mhlanga13@gmail.com",
    pass: "orfvcfjhvbncoepl",
  },
});

const handlebarsOptions = {
  viewEngine: {
    extName: ".ejs",
    partialsDir: path.resolve("../views"),
    defaultLayout: false,
  },
  viewPath: path.resolve("./views"),
  extName: ".ejs",
};

transporter.use("compile", hbs(handlebarsOptions));

module.exports = transporter;
