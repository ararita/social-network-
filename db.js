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

//get list of friends and wanna be friends
module.exports.getFriendsAndWannabes = function(id) {
    return db.query(
        `SELECT users.id, first, last, url, accepted
        FROM friendships
        JOIN users
        ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
        OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
        OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)`,
        [id]
    );
};

//get online users
module.exports.getUsersByIds = function(arrayOfIds) {
    return db.query(
        ` SELECT id, first, last, url FROM users WHERE id = ANY ($1)`,
        [arrayOfIds]
    );
};

//get users who joined:
module.exports.getJoinedUser = function(userId) {
    return db.query(`SELECT id,first,last,url FROM users WHERE id = $1`, [
        userId
    ]);
};

//get chat messages
module.exports.getChatMessages = function() {
    return db.query(
        `SELECT users.id AS sender_id, users.first AS sender_first, users.last AS sender_last, users.url AS sender_url, message, chatmessages.id AS message_id, chatmessages.created_at AS message_created_at
        FROM chatmessages
        LEFT JOIN users
        ON chatmessages.user_id = users.id
        ORDER BY chatmessages.created_at DESC
        LIMIT 10`
    );
};

module.exports.addChatMessage = function(message, userId) {
    return db.query(
        `INSERT INTO chatmessages (message, user_id)
        VALUES ($1, $2)
        RETURNING *`,
        [message, userId]
    );
};
