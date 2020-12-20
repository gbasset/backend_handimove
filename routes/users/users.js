const express = require("express")
const connection = require('../../conf')
const router = express.Router()
const bcrypt = require('bcryptjs')
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
                // res.json(results).status(200)
                connection.query(`SELECT avatar_url, username, mail, town, login, id as "id_user", is_admin, question, password  FROM users WHERE id=${id}`, formData, (err, results) => {
                    if (err) {
                        res.status(500).send("Erreur");
                        console.log('Query error 1 : ' + err)
                    } else {
                        res.json(results).status(200)
                    }
                })
            }
        })
    })
router.route(['/pass/:id'])
    .put(function (req, res) {
        const id = req.params.id;
        const pass = bcrypt.hashSync(req.body.user_password)
        connection.query(`UPDATE users set password= ? WHERE id=${id}`, pass, (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de la modification du mot de passe");
                console.log('Query error: ' + err)
            } else {
                res.json(results).status(200)
            }
        })
    })

module.exports = router