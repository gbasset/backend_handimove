// Routes messages
const messages = require("./messages/messages")

// Routes search
const searchEstablishments = require("./search/establishments")
const city = require("./search/city")

// Routes admin
const admin = require("./admin/admin")
const adminUsers = require("./admin/users")

// Routes comments
const comments = require("./comments/comments")
// Routes fav 
const fav = require("./fav/fav")
module.exports = { messages, searchEstablishments, city, admin, adminUsers, comments, fav }