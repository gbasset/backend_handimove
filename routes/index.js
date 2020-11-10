// Routes messages
const messages = require("./messages/messages")

// Routes search
const searchEstablishments = require("./search/establishments")
const city = require("./search/city")

// Routes admin
const admin = require("./admin/admin")
const adminUsers = require("./admin/users")


module.exports = { messages, searchEstablishments, city, admin, adminUsers }