const express = require("express")
const connection = require('../../conf')
const router = express.Router()


router.route(['/mdph'])
    .get(function (req, res) {
        connection.query('SELECT * FROM mdph ', req.params.id, (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de la récupération des mdph");
            } else {
                res.json(results).status(200);
            }
        })
    })

module.exports = router