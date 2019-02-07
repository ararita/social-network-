const spicedPg = require("spiced-pg");
var db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    const { dbUser, dbPassword } = require("./secrets");
    db = spicedPg(`postgres:${dbUser}:${dbPassword}@localhost:5432/social`);
}

//registration
module.exports.registerUser = (first, last, email, hash) => {
    return db.query(
        `INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id`,
        [first, last, email, hash]
    );
};

//login
module.exports.getUserByEmail = function(email) {
    return db.query(
        `SELECT *
        FROM users
        WHERE email = $1`,
        [email]
    );
};

//
module.exports.getUserProfile = function(userId) {
    return db.query(
        `SELECT *
        FROM users
        WHERE id = $1`,
        [userId]
    );
};

module.exports.addImage = function(userId, url) {
    return db.query(
        `UPDATE users
        SET url = $2
        WHERE id = $1
        RETURNING url
        `,
        [userId, url]
    );
};

module.exports.updateBio = function(userId, bio) {
    return db.query(
        `UPDATE users
        SET bio = $2
        WHERE id = $1`,
        [userId, bio]
    );
};

module.exports.getUserById = function(userId) {
    return db.query(
        `SELECT * FROM users
        WHERE id = $1`,
        [userId]
    );
};

module.exports.getInitialFriendship = function(loggedInId, otherUserId) {
    return db.query(
        `
      SELECT * FROM friendships
      WHERE (recipient_id = $1 AND sender_id = $2)
      OR (recipient_id = $2 AND sender_id = $1)
  `,
        [loggedInId, otherUserId]
    );
};

module.exports.addFriend = function(loggedInId, otherUserId) {
    return db.query(
        `
  INSERT INTO friendships (sender_id, recipient_id)
  VALUES($1, $2)
  `,
        [loggedInId, otherUserId]
    );
};

module.exports.unfriend = function(loggedInId, otherUserId) {
    return db.query(
        `
        DELETE FROM friendships WHERE (recipient_id = $1 AND sender_id = $2)
        OR (recipient_id = $2 AND sender_id = $1)
  `,
        [loggedInId, otherUserId]
    );
};

module.exports.cancelFriendRequest = function(loggedInId, otherUserId) {
    return db.query(
        `
  DELETE FROM friendships WHERE (recipient_id = $1 AND sender_id = $2)
  OR (recipient_id = $2 AND sender_id = $1)
  `,
        [loggedInId, otherUserId]
    );
};

module.exports.acceptFriendRequest = function(loggedInId, otherUserId) {
    return db.query(
        `
UPDATE friendships
SET accepted = true
WHERE (recipient_id = $1 AND sender_id = $2)
OR (recipient_id = $2 AND sender_id = $1)

  `,
        [loggedInId, otherUserId]
    );
};
