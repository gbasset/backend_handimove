const express = require("express")
const connection = require('../../conf')
const router = express.Router()
//  get establishment by id 
router.route(['/establishments/:name'])
    .get(function (req, res) {
        const name = req.params.name
        connection.query(`SELECT * FROM establishment WHERE name LIKE "${name}%"`, (err, results) => {
            if (err) {
                console.log('Query error: ' + err);
                res.status(500).send("Erreur lors de la récupération des etablisements");
            } else {
                res.json(results).status(200);
            }
        })
    })
router.route(['/event/:name'])
    .get(function (req, res) {
        const name = req.params.name
        connection.query(`SELECT * from events  WHERE name LIKE "${name}%"`, (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de la recherche des événement");
                console.log('Query error: ' + err);
            } else {
                res.json(results).status(200)
            }

        })
    })
router.route(['/users/:name'])
    .get(function (req, res) {
        const name = req.params.name
        connection.query(`SELECT u.username, u.id, u.is_admin, u.login, u.mail , t.name as townname from users u  
        join town t on u.town=t.id WHERE u.username LIKE "%${name}%"
        `, (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de la recherche des utilisateurs");
                console.log('Query error: ' + err);
            } else {
                res.json(results).status(200)
            }

        })
    })
router.route(['/comments'])
    .get(function (req, res) {
        connection.query(`select u.username, u.id as id_user, u.username, com.name as "comment_name", com.comment, com.id as "comment_id", com.status, com.date, etab.name as "establishment_name", etab.id_etablishment as id_etabl FROM establishment etab inner join etablishment_comments ac on etab.id_etablishment=ac.etablishment_id INNER JOIN comments com on ac.comment_id=com.id INNER JOIN users u ON ac.user_id=u.id  `, (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de la récupération des commentaires ");
                console.log('Query error: ' + err);
            } else {
                res.json(results).status(200);
            }
        })
    })
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
        connection.query(`SELECT et.name as "establish_name", c.id as "comment_id", c.name as "comment_name",c.id_user,c.comment, c.status as "status_comment",u.username, u.login, u.id as "id_user" FROM comments c join user_comments uc on c.id_user=uc.user_id join users u ON uc.user_id=u.id 
        left Join etablishment_comments ec on c.id=ec.comment_id 
        join establishment et on ec.etablishment_id=et.id_etablishment WHERE c.id=${id} GROUP BY c.id`, (err, results) => {
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
        console.log("formData", formData);
        connection.query(`UPDATE comments SET ? WHERE id=${id}`, [formData], (err, results) => {
            if (err) {
                console.log('Query error: ' + err);
                res.status(500).send("Erreur lors de la modification du commentaire");
            } else {
                res.sendStatus(200);
            }
        });
    })
    .delete(function (req, res) {
        const id = req.params.id;
        connection.query(`DELETE FROM comments WHERE id=?`, id, (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de la supression de l'etablissement");
                console.log('Query error: ' + err);
            } else {
                res.json(results).status(200);
            }
        })
    })

// Routes for the establishments
router.route(['/establisments/:id'])
    .get(function (req, res) {
        const id = req.params.id;
        connection.query(`SELECT * from establishment WHERE id_etablishment=?`, id, (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de la modification de l'etablissement");
                console.log('Query error: ' + err);
            } else {
                res.json(results).status(200)
            }
        })
    })
    .put(function (req, res) {
        const id = req.params.id
        console.log("id", id);
        const formData = req.body;
        connection.query(`UPDATE establishment SET ? WHERE id_etablishment=${id}`, [formData], (err, results) => {
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
router.route(['/events/:id'])
    .get(function (req, res) {
        const id = req.params.id;
        connection.query(` SELECT e.id, e.name, e.date_begin, e.date_end, e.description, e.title, e.handicaps, e.address, e.town_id, e.event_url, e.id_region, e.id_department, t.name as town , d.name as depart_name, r.name as region_name FROM events e join town t on e.town_id=t.id
        join departments d on e.id_department=d.id  join regions r on e.id_region=r.id WHERE e.id=${id}`, (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de la récupération des commentaires ");
                console.log('Query error: ' + err);
            } else {
                res.json(results).status(200);
            }
        })
    })
// Routes for the events
router.route(['/event/:id'])
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