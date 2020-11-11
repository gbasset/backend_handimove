const express = require("express")
const connection = require('../../conf')
const router = express.Router()

// get all users 
router.route(['/'])
    .get(function (req, res) {
        connection.query(`SELECT * from users`, (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de l'affichage des utilisateurs");
                console.log('Query error: ' + err)
            } else {
                res.json(results).status(200)
            }
        })
    })

router.route(['/:id'])
    .put(function (req, res) {
        const id = req.params.id;
        const formData = req.body;
        connection.query(`UPDATE users set ? WHERE id=${id}`, formData, (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de la modification des informations de l'utilisateur");
                console.log('Query error: ' + err)
            } else {
                res.json(results).status(200)
            }
        })
    })

module.exports = router