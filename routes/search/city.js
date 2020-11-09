const express = require("express")
const connection = require('../../conf')
const router = express.Router()

// get town request 
router.route(['/town/:request'])
    .get(function (req, res) {
        connection.query(`SELECT id, name, zipcode FROM town WHERE name LIKE"${req.params.request}%"`, (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de la récupération des villes");
            } else {
                res.json(results).status(200);
            }
        })
    })
// get regions request 
router.route(['/regions/:request'])
    .get(function (req, res) {
        connection.query(`SELECT id, name FROM regions WHERE name LIKE"${req.params.request}%"`, (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de la récupération des regions");
            } else {
                res.json(results).status(200);
            }
        })
    })
// get department request 
router.route(['/department/:request'])
    .get(function (req, res) {
        connection.query(`SELECT id, name FROM departments WHERE name LIKE"${req.params.request}%"`, (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de la récupération des departements");
            } else {
                res.json(results).status(200);
            }
        })
    })




module.exports = router