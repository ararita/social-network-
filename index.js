const express = require("express");
const compression = require("compression");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require("./bcrypt");
const db = require("./db");
const csurf = require("csurf");
const app = express();

app.use(compression());

app.use(bodyParser.json());
app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

app.use(express.static(__dirname + "/public"));

app.use(csurf());

app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

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

//---server routes:

app.get("/welcome", function(req, res) {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/register", (req, res) => {
    console.log("req.body: ", req.body);
    bcrypt
        .hashPassword(req.body.password)
        .then(hash => {
            return db.registerUser(
                req.body.first,
                req.body.last,
                req.body.email,
                hash
            );
        })
        .then(dbResult => {
            req.session.userId = dbResult.rows[0].id;
            req.session.first = req.body.first;
            req.session.last = req.body.last;

            res.json({ success: true });
        })
        .catch(err => {
            res.json({ success: false });
            console.log(err);
        });
});

app.post("/login", (req, res) => {
    let userId;
    db.getUserInfo(req.body.email)
        .then(dbResult => {
            req.session.email = dbResult.rows[0].email;
            if (dbResult.rows[0]) {
                userId = dbResult.rows[0].id;
                return bcrypt.compare(
                    req.body.password,
                    dbResult.rows[0].password
                );
            } else {
                req.session.userId = dbResult.rows[0].id;
                res.json({ notRegistered: true });
            }
        })
        .then(() => {
            req.session.userId = userId;
            res.json({ success: true });
        })
        .catch(err => {
            res.json({ success: false });
            console.log(err);
        });
});

//this has to be at the end
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
