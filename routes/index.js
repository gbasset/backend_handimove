// Routes messages
const messages = require("./messages/messages")

// Routes search
const searchEstablishments = require("./search/establishments")
const events = require("./search/events")
const city = require("./search/city")

// Routes admin
const admin = require("./admin/admin")
const adminUsers = require("./admin/users")

// Routes comments
const comments = require("./comments/comments")
// Routes fav 
const fav = require("./fav/fav")

// Routes fav 
const users = require("./users/users")

// routes for auth
const authentification = require("./authentification/authentification")
/// route for register
const register = require("./register/register")

// route for images 
const images = require("./images/images")

module.exports = { messages, searchEstablishments, events, city, admin, adminUsers, comments, fav, users, register, authentification, images }