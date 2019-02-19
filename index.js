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
const server = require("http").Server(app);
const cheerio = require("cheerio");
const request = require("request");
const url = require("url");
const moment = require("moment");

const io = require("socket.io")(server, { origins: "localhost:8080" });

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
const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

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
        // console.log("req.session.userId: ", req.session.userId);
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/register", (req, res) => {
    // console.log("req.body: ", req.body);
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

            console.log("req.session.userId ", req.session.userId);
            console.log("req.sess.first", req.session.first);
            console.log("req.session.last", req.session.last);

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
            // console.log("dbresults: ", dbResult);
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
        // console.log("rows in image upload: ", rows);
        req.session.url = rows[0].url;
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

app.get("/friends/list", (req, res) => {
    db.getFriendsAndWannabes(req.session.userId)
        .then(dbResult => {
            // console.log("dbResult from getFriendsAndWannabes", dbResult);
            res.json(dbResult);
        })
        .catch(err => {
            console.log("error while getting friendshiplists: ", err);
        });
});

app.get("/getWallPosts", (req, res) => {
    db.getWallPosts(req)
        .then(dbResult => {
            // console.log("this is result from /getWallPosts: ", dbResult);

            console.log("req.session.userId ", req.session.userId);
            console.log("req.sess.first", req.session.first);
            console.log("req.session.last", req.session.last);
            console.log("req.session.url", req.session.url);
            dbResult.rows.forEach(item => {
                item.created_at = moment(item.created_at).format(
                    "MMMM Do YYYY, h:mm:ss a"
                );
            });

            res.json(dbResult.rows);
        })
        .catch(err => {
            console.log("this is err from /getWallPosts", err);
        });
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/welcome");
});

//this has to be at the end
app.get("*", function(req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

server.listen(8080, function() {
    console.log("I'm listening.");
});

/////socket.io stuff

let onlineUsers = {};

io.on("connection", function(socket) {
    if (!socket.request.session || !socket.request.session.userId) {
        return socket.disconnect(true);
    }
    //this callback function will run whenever user logs in or registers;
    // socket is an object that represents the socket connection that just happened

    //console.log("socket.request.session: ", socket.request.session);

    const socketId = socket.id;
    const userId = socket.request.session.userId;
    // every socket has its on unique id, every time different
    onlineUsers[socket.id] = userId;

    //console.log("onlineUsers: ", onlineUsers);
    //console.log("onlineUsers[socket.id]: ", onlineUsers[socket.id]);

    let userIds = Object.values(onlineUsers);
    //console.log("userIds", userIds);

    //-------------socket events:-------------------
    //online users
    db.getUsersByIds(userIds)
        .then(data => {
            console.log("Data get usersByID: ", data.rows);
            socket.emit(
                "onlineUsers",
                data.rows.filter(i => {
                    if (i.id == userId) {
                        return false;
                    } else {
                        return true;
                    }
                })
            );
        })
        .catch(err => {
            console.log(err.message);
        });

    //USER JOINS
    const filteredOwnUserIds = userIds.filter(id => id == userId);
    if (filteredOwnUserIds.length == 1) {
        db.getJoinedUser(userId)
            .then(dbResults => {
                socket.broadcast.emit("userJoined", dbResults.rows[0]);
            })
            .catch(err => {
                console.log(err);
            });
    }

    // USER LEAVES
    socket.on("disconnect", function() {
        delete onlineUsers[socketId];
        if (Object.values(onlineUsers).indexOf(userId) == -1) {
            io.sockets.emit("userLeft", userId);
        }
    });

    //chat messages:
    db.getChatMessages()
        .then(results => {
            //console.log("this are results.rows from getChatMessages", results.rows);
            socket.emit("chatMessages", results.rows.reverse());
        })
        .catch(err => {
            console.log("chatMessages aren't loading: ", err);
        });

    socket.on("chatMessageFromUserInput", async text => {
        const userInfo = await db.getUserProfile(userId);
        let newMessage = {
            message: text,
            sender_first: userInfo.rows[0].first,
            sender_last: userInfo.rows[0].last,
            sender_id: userInfo.rows[0].id,
            sender_url: userInfo.rows[0].url
        };
        db.addChatMessage(newMessage.message, newMessage.sender_id)
            .then(dbInfo => {
                newMessage.message_id = dbInfo.rows[0].id;
                newMessage.message_created_at = dbInfo.rows[0].created_at;
                io.sockets.emit("loadChatMessages", newMessage);
            })
            .catch(err => {
                console.log("error while loading new chatmessage: ", err);
            });
    });

    //wall posts
    // db.getWallPosts()
    //     .then(dbResults => {
    //         console.log("results from getWallPosts: ", dbResults.rows);
    //         socket.emit("wall messages", dbResults.rows);
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     });

    app.post("/wallPost", (req, res) => {
        // let usersLink = url.parse(req.body.urlPost);
        console.log("req in /wallPost:", req);
        request(req.body.urlPost, { json: true }, (err, response, body) => {
            if (err) {
                return console.log(err);
            }
            const $ = cheerio.load(body);
            // console.log("this is body from wallPost: ", body);
            const title = $('meta[property="og:title"]').attr("content");
            const picture = $('meta[property="og:image"]').attr("content");
            const publisher = $('meta[property="og:site_name"]').attr(
                "content"
            );
            const description = $('meta[property="og:description"]').attr(
                "content"
            );
            const first = req.session.first;
            const last = req.session.last;
            const url = req.session.url;
            const message = "test message";
            db.addWallPostsLink(
                req.session.userId,
                first,
                last,
                url,
                message,
                req.body.urlPost,
                description,
                publisher,
                picture
            )
                .then(dbInfo => {
                    dbInfo.rows.forEach(item => {
                        item.created_at = moment(item.created_at).format(
                            "MMMM Do YYYY, h:mm:ss a"
                        );
                    });

                    res.json(dbInfo.rows);
                    console.log("this is dbInfo.rows: ", dbInfo.rows);
                })
                .catch(err => {
                    console.log("error in /wallpost: ", err);
                });
        });
    });

    // db.addWallUrl(req.session.userId, wallId, wallPostDesc, wallPostImg, req.body.wallpost, wallPostTitle)
    //             .then(() => {
    //                 db.getWallPosts(wallId)
    //                     .then(data => {
    //                         for (let i = 0; i < data.rows.length; i++) {
    //                             if (data.rows[i].wallpost_text) {
    //                                 data.rows[i].wallpost_text = data.rows[i].wallpost_text.substring(0, 400);
    //                             }
    //                         }
    //                         response.json(data.rows);
    //                     }).catch(err => {console.log(err);} );
    //             }).catch(err => { console.log(err); });
    //     });
    // socket.on("new post from user", function(wallpost) {
    //     console.log("this is wallpost: ", wallpost);
    //     //run a query to insert it in database, and then emit, and make sure socket.on is working.
    // });
});

//davids steps:
//receive the link on the server, confirm youre getting it, console.log
//make http request to go get the html page
