const express = require("express")
const connection = require('../../conf')
const router = express.Router()

// get all comments establishment by status by id
router.route(['/establishment/:id'])
    .get(function (req, res) {
        const id = req.params.id;
        connection.query(`select u.username, u.id as id_user, com.name as "comment_name", com.comment, com.id as "comment_id", com.status, com.date, etab.name as "establishment_name", etab.id_etablishment as id_etabl FROM establishment etab inner join etablishment_comments ac on etab.id_etablishment=ac.etablishment_id INNER JOIN comments com on ac.comment_id=com.id INNER JOIN users u ON ac.user_id=u.id WHERE ac.etablishment_id = ? AND com.status = 0`, id, (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de la récupération des commentaires ");
            } else {
                res.json(results).status(200);
            }
        })
    })

router.route(['/user/:idUser/:idEstablishment'])
    .post(function (req, res) {
        const idUser = req.params.idUser;
        const idEstablishment = req.params.idEstablishment;
        const formData = req.body;
        connection.query("SET FOREIGN_KEY_CHECKS=0", (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de la suppression de la foreign key");
            }
            else {
                connection.query(`INSERT INTO comments SET ?`, formData, (err, results) => {
                    if (err) {
                        res.status(500).send("Erreur lors de la création du commentaire");
                        console.log('Query error 1 : ' + err)
                    } else {
                        console.log(results.insertId);
                        let idComment = results.insertId
                        return connection.query(`INSERT INTO user_comments (user_id,comment_id) VALUES (${idUser}, ${idComment})`, (err, results) => {
                            if (err) {
                                res.status(500).send("Erreur lors de la création du lien entre le commentaire et l'utilisateur");
                                console.log('Query error 2 : ' + err)
                            } else {
                                return connection.query(`INSERT INTO etablishment_comments (etablishment_id,user_id,comment_id) VALUES (${idEstablishment},${idUser},${idComment} )`, (err, results) => {
                                    if (err) {
                                        res.status(500).send("Erreur lors de la création du lien entre le commentaire et l'etablissement");
                                        console.log('Query error 3: ' + err)
                                    }
                                    else {
                                        res.json(results).status(200);
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    })
router.route(['/user/:idComment/'])
    .put(function (req, res) {
        const id = req.params.idComment;
        const formData = req.body;
        connection.query(`UPDATE comments SET ? WHERE id=?`, [formData, id], (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de la modification du commentaire ");
                console.log('Query error: ' + err);
            } else {
                return connection.query(`SELECT * from comments WHERE id=?`, id, (err, results) => {
                    if (res) {
                        res.json(results).status(200)
                    }
                })
            }
        })
    })
router.route(['/user/:id'])
    .get(function (req, res) {
        const id = req.params.id;
        connection.query(` SELECT DISTINCT c.id AS "comment_id", c.name as "comment_name", c.comment, c.status, c.date, u.id as "id_user", u.username , ec.etablishment_id as "id_establish", e.name as "establish_name", e.department, e.region
        FROM users u
        JOIN user_comments uc on u.id=uc.user_id
        JOIN comments c on uc.comment_id=c.id
        JOIN etablishment_comments ec on c.id=ec.comment_id
        JOIN establishment e on ec.etablishment_id=e.id_etablishment
        WHERE c.id_user=${id}`, (err, results) => {

            if (err) {
                res.status(500).send("Erreur lors de la récupération des commentaires ");
                console.log('Query error: ' + err);
            } else {
                res.json(results).status(200)
            }
        })
    })

module.exports = router