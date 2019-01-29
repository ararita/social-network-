const express = require("express");
const compression = require("compression");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require("./bcrypt");
const db = require("./db");

const app = express();

app.use(compression());

app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

app.use(express.static(__dirname + "./public"));

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

//---------missing hashed password business--------------
app.post("/register", (req, res) => {
    bcrypt.hashPassword(req.body.password).then(hash => {
        db.registerUser(req.body.first, req.body.last, req.body.email, hash);
    });
});

//---server routes:

app.get("/welcome", function(req, res) {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

//this has to be at the nend
app.get("*", function(req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.listen(8080, function() {
    console.log("I'm listening.");
});
