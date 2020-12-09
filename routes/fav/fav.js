const express = require("express")
const connection = require('../../conf')
const router = express.Router()

// post establishment fav by user id and by id establishment 
router.route(['/establishment/:idUser/:idEstablishment'])
    .post(function (req, res) {
        const idUser = req.params.idUser;
        const idEstablishment = req.params.idEstablishment;
        connection.query(`INSERT INTO user_fav_etablish (user_id,id_etablish) VALUES (${idUser}, ${idEstablishment})`, (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de l'ajout d'un etablissement favoris");
                console.log('Query error: ' + err)
            } else {
                res.json(results).status(200)
            }
        })
    })
router.route(['/establishments/:id'])
    .get(function (req, res) {
        const id = req.params.id;
        connection.query(`SELECT u.username, u.id as "id_user", es.handicaps, es.name as "establishment_name", es.region, es.category, es.phone, es.town, es.activity, es.id_etablishment as "id_establishment", es.url_website , uf.id as "ID_fav" FROM users u join user_fav_etablish uf on u.id=uf.user_id join establishment es on uf.id_etablish=es.id_etablishment where u.id=${id} GROUP BY es.name ORDER BY es.name`, (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de l'affichage des etablissements favoris");
                console.log('Query error: ' + err)
            } else {
                res.json(results).status(200)
            }
        })
    })
    .delete(function (req, res) {
        const id = req.params.id;
        connection.query(`DELETE FROM user_fav_etablish WHERE id=${id}`, (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de la supression du favoris");
                console.log('Query error: ' + err)
            } else {
                res.json(results).status(200)
            }
        })
    })

// push fav event by id user 
router.route(['/event/:idUser/:idEvent'])
    .post(function (req, res) {
        const idUser = req.params.idUser;
        const idEvent = req.params.idEvent;
        connection.query(`INSERT INTO user_fav_events (user_id,event_id) VALUES (${idUser}, ${idEvent})`, (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de l'ajout d'un événement aux favoris");
                console.log('Query error: ' + err)
            } else {
                res.json(results).status(200)
            }
        })
    })

router.route(['/event/:id'])
    .get(function (req, res) {
        const id = req.params.id;
        connection.query(`SELECT u.username, u.id as "user_id" , ev.id as "id_event", ev.name, ev.date_begin, ev.date_end, ev.title, ev.address, ev.handicaps, ev.town_id, ev.event_url, ev.description, t.name, t.zipcode, t.latitude, t.longitude, ufe.id AS "ID_fav" from users u join  user_fav_events ufe on u.id=ufe.user_id join events ev on ufe.event_id=ev.id join town t on ev.town_id=t.id where u.id =${id} ORDER BY ev.id`, (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de l'affichage des etablissements favoris");
                console.log('Query error: ' + err)
            } else {
                res.json(results).status(200)
            }
        })
    })
    .delete(function (req, res) {
        const id = req.params.id;
        connection.query(` DELETE FROM user_fav_events WHERE  id=${id}`, (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de l'affichage de la supression du favoris");
                console.log('Query error: ' + err)
            } else {
                res.json(results).status(200)
            }
        })
    })


module.exports = router