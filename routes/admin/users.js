const express = require("express")
const connection = require('../../conf')
const router = express.Router()

// get all comment by status 
router.route(['/users'])
    .get(function (req, res) {
        connection.query(`SELECT * FROM users`, (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de la récupération des utilisateurs");
            } else {
                res.json(results).status(200);
            }
        })
    })


// Routes for the events
router.route(['/user/:id'])
    .get(function (req, res) {
        const id = req.params.id;
        connection.query(`SELECT * from users WHERE id=?`, id, (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de la récupération de l'utilisateur");
                console.log('Query error: ' + err);
            } else {
                res.json(results).status(200)
            }
        })
    })
    .put(function (req, res) {
        const id = req.params.id;
        const formData = req.body;
        connection.query(`UPDATE users SET ? WHERE id=?`, [formData, id], (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de la modification de l'utilisateur ");
                console.log('Query error: ' + err);
            } else {
                return connection.query(`SELECT * from  users WHERE id=?`, id, (err, results) => {
                    if (res) {
                        res.json(results).status(200)
                    }
                })
            }
        })
    })
    .delete(function (req, res) {
        const id = req.params.id;
        connection.query("SET FOREIGN_KEY_CHECKS=0", (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de la modification d'une collection");
            } else {
                connection.query(`DELETE FROM users WHERE id=?`, id, (err, results) => {
                    if (err) {
                        res.status(500).send("Erreur lors de la supression de l'utilisateur");
                        console.log('Query error: ' + err);
                    } else {
                        return connection.query(`DELETE  from user_fav_events WHERE user_id=?`, id, (err, results) => {
                            if (err) {
                                res.status(500).send("Erreur lors de la supression de la table user event");
                                console.log('Query error: ' + err)
                            }
                            else {
                                return connection.query(`DELETE  from  user_fav_etablish WHERE user_id=?`, id, (err, results) => {
                                    if (err) {
                                        res.status(500).send("Erreur lors de la supression de la table user favoris");
                                        console.log('Query error: ' + err)
                                    }
                                    else {
                                        return connection.query(`DELETE  from  user_comments WHERE user_id=?`, id, (err, results) => {
                                            if (err) {
                                                res.status(500).send("Erreur lors de la supression de l'utilisateur");
                                                console.log('Query error: ' + err)
                                            }
                                            else {
                                                res.json(results).status(200)
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    })


module.exports = router