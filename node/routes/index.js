var express = require("express");
var router = express.Router();

var database = require("../database");

/* GET home page. */
router.get("/", function (req, res, next) {
  const successMessage = req.session.successMessage;
  req.session.successMessage = null;
  res.render("index", { title: "Express", session: req.session, successMessage });
});

router.get("/login", function (req, res, next) {
  const successMessage = req.session.successMessage;
  req.session.successMessage = null;
  res.render("index", { title: "Express", session: req.session, successMessage });
});

router.get("/register", function (req, res, next) {
  res.render("signup", { title: "Express" });
});

router.post("/api/login", function (request, response, next) {
  var user_email_address = request.body.user_email_address;

  var user_password = request.body.user_password;

  if (user_email_address && user_password) {
    query = `
        SELECT * FROM signup_users 
        WHERE user_email = "${user_email_address}"
        `;
    database.query(query, function (error, data) {
      if (data.length > 0) {
        console.log(data[0]);
        for (var count = 0; count < data.length; count++) {
          if (data[count].user_password == user_password) {
            request.session.user_name =
              data[count].user_first_name + " " + data[count].user_last_name;

            response.redirect("/");
          } else {
            response.send("Incorrect Password");
          }
        }
      } else {
        response.send("Incorrect Email Address");
      }
      response.end();
    });
  } else {
    response.send("Please Enter Email Address and Password Details");
    response.end();
  }
});

/* Register new User. */
router.post("/api/register", function (request, response, next) {
  var user_email_address = request.body.user_email_address;
  var user_first_name = request.body.user_first_name;
  var user_last_name = request.body.user_last_name;
  var user_password = request.body.user_password;

  if (user_email_address && user_password && user_first_name && user_last_name) {
    check_query =
      'SELECT * FROM signup_users WHERE user_email = "' + user_email_address + '"';

    database.query(check_query, function (error, data) {
      if (data.length > 0) {
        response.send("User with this email already exists!");
      } else {
        query = `
          INSERT INTO signup_users (user_email, user_first_name, user_last_name, user_password)
          VALUES ("${user_email_address}", "${user_first_name}", "${user_last_name}", "${user_password}");
        `;

        database.query(query, function (error, data) {
          if (error) {
            response.send("Something went wrong!");
          } else {
            // Show a success message to the user
            request.session.successMessage = "Registration is successful. You can now log in.";
            response.redirect("/login");
          }
        });
      }
    });
  } else {
    response.send(
      "Please Enter Email Address, First Name, Last Name, and Password Details"
    );
  }
});

router.get("/logout", function (request, response, next) {
  request.session.destroy();

  response.redirect("/");
});

module.exports = router;
