const express = require("express")
const connection = require('../../conf')
const router = express.Router()

// get all comment by status 
router.route(['/estaall'])
    .get(function (req, res) {
        connection.query(`SELECT * from establishment`, (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de la récupération des commentaires");
            } else {
                res.json(results).status(200);
            }
        })
    })
// get all comment by status 
router.route(['/comments/all/:id'])
    .get(function (req, res) {
        const id = req.params.id
        connection.query(`SELECT c.id as "comment_id", c.comment as "message", c.name, c.status as "status-message", et.id_etablishment as "establishment_id", et.name as "establish_name" FROM comments c left join user_comments uc on c.id=uc.comment_id left join users u on uc.user_id=u.id left Join etablishment_comments ec on c.id=ec.comment_id left join establishment et on ec.etablishment_id=et.id_etablishment WHERE c.status =?`, id, (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de la récupération des commentaires");
            } else {
                res.json(results).status(200);
            }
        })
    })
// get comment by id 
router.route(['/comment/:id'])
    .get(function (req, res) {
        const id = req.params.id
        connection.query(`SELECT c.id as "comment_id", c.name as "comment_name",c.id_user,c.comment, c.status as "status_comment",u.username, u.login, u.id as "id_user" FROM comments c join user_comments uc on c.id_user=uc.user_id join users u ON uc.user_id=u.id WHERE c.id=${id} GROUP BY c.id`, (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de la récupération du commentaire");
            } else {
                res.json(results).status(200);
            }
        })
    })
    .put(function (req, res) { // modifier un message
        const id = req.params.id;
        const formData = req.body;
        connection.query('UPDATE comments SET ? WHERE id=?', [formData, id], (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de la modification du commentaire");
            } else {
                res.sendStatus(200);
            }
        });
    })

// Routes for the establishments
router.route(['/establisments/:id'])
    .put(function (req, res) {
        const id = req.params.id;
        const formData = req.body;
        connection.query(`UPDATE establishment SET ? WHERE id_etablishment=?`, [formData, id], (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de la modification de l'etablissement");
                console.log('Query error: ' + err);
            } else {
                return connection.query(`SELECT * from  establishment WHERE id_etablishment=?`, id, (err, results) => {
                    if (res) {
                        res.json(results).status(200)
                    }
                })
            }
        })
    })
    .delete(function (req, res) {
        const id = req.params.id;
        connection.query(`DELETE FROM establishment WHERE id_etablishment =?`, id, (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de la supression de l'etablissement");
                console.log('Query error: ' + err);
            } else {
                res.json(results).status(200);
            }
        })
    })
// create comment by id 
router.route(['/establisments'])
    .post(function (req, res) {
        const formData = req.body;
        connection.query(`INSERT INTO establishment SET ?`, formData, (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de la création de l'etablissement");
                console.log('Query error: ' + err);
            } else {
                return connection.query(`SELECT * from  establishment WHERE id_etablishment=?`, results.insertId, (err, results) => {
                    if (res) {
                        res.json(results).status(200)
                    }
                })

            }
        })
    })

// Routes for the events
router.route(['/event/:id'])
    .get(function (req, res) {
        const id = req.params.id;
        connection.query(`SELECT * from events WHERE id=?`, id, (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de la modification de l'evenement");
                console.log('Query error: ' + err);
            } else {
                return connection.query(`SELECT * from  events WHERE id=?`, id, (err, results) => {
                    if (res) {
                        res.json(results).status(200)
                    }
                })
            }
        })
    })
    .put(function (req, res) {
        const id = req.params.id;
        const formData = req.body;
        connection.query(`UPDATE events SET ? WHERE id=?`, [formData, id], (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de la modification de l'evenement");
                console.log('Query error: ' + err);
            } else {
                return connection.query(`SELECT * from  events WHERE id=?`, id, (err, results) => {
                    if (res) {
                        res.json(results).status(200)
                    }
                })
            }
        })
    })
    .delete(function (req, res) {
        const id = req.params.id;
        connection.query(`DELETE FROM events WHERE id=?`, id, (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de la supression de l'événement");
                console.log('Query error: ' + err);
            } else {
                res.json(results).status(200);
            }
        })
    })
// post a new event 
router.route(['/event'])
    .post(function (req, res) {
        const formData = req.body;
        connection.query('INSERT INTO events SET ?', formData, (err, results) => {
            if (err) {
                res.status(500).send("Erreur l'ajout de l'événement");
                console.log('Query error: ' + err);
            } else {
                // res.json(results).status(200);
                return connection.query(`SELECT * from events WHERE id=?`, results.insertId, (err, results) => {
                    if (res) {
                        res.json(results).status(200)
                    }
                })
            }
        })
    })

module.exports = router