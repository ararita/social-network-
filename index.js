const express = require("express");
const compression = require("compression");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require("./bcrypt");
const db = require("./db");
const csurf = require("csurf");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const app = express();
const config = require("./config");

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

const s3 = require("./s3");

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
        console.log("req.session.userId: ", req.session.userId);
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
    db.getUserByEmail(req.body.email)
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

app.get("/user", (req, res) => {
    let userId = req.session.userId;
    db.getUserProfile(userId)
        .then(dbResult => {
            console.log("dbresults: ", dbResult);
            res.json(dbResult.rows[0]);
        })
        .catch(err => {
            console.log(err);
        });
});

app.post("/bio", (req, res) => {
    const userId = req.session.userId;
    const bio = req.body.text;

    db.updateBio(userId, bio)
        .then(() => {
            res.json({ bio });
        })
        .catch(err => {
            res.status(500).json({ err });
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    let userId = req.session.userId;

    // console.log("POST /upload");
    // console.log("req body: ", req.body);
    // console.log("req file: ", req.file);
    db.addImage(userId, config.s3Url + req.file.filename).then(({ rows }) => {
        console.log("rows: ", rows);
        res.json(rows[0]);
    });
});

app.get("/user/:id/info", (req, res) => {
    db.getUserById(req.params.id).then(dbResult => {
        res.json(dbResult.rows[0]);
    });
});

app.get("/initial-friendship-status/:id", (req, res) => {
    db.getInitialFriendship(req.session.userId, req.params.id).then(
        dbResult => {
            res.json(dbResult.rows[0]);
        }
    );
    //req.params.id je user koji nismo mi
});

app.post("/initial-friendship-status/:id/add-friend", (req, res) => {
    db.addFriend(req.session.userId, req.params.id).then(dbResult => {
        res.json(dbResult);
    });
});
app.post("/initial-friendship-status/:id/unfriend", (req, res) => {
    db.unfriend(req.session.userId, req.params.id).then(dbResult => {
        res.json(dbResult);
    });
});

app.post("/initial-friendship-status/:id/cancel-friend-request", (req, res) => {
    db.cancelFriendRequest(req.session.userId, req.params.id).then(dbResult => {
        res.json(dbResult);
    });
});

app.post("/initial-friendship-status/:id/accept-friend-request", (req, res) => {
    db.acceptFriendRequest(req.session.userId, req.params.id).then(dbResult => {
        res.json(dbResult);
    });
});

app.get("/friends", (req, res) => {});

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
