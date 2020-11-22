const express = require("express")
const connection = require('../../conf')
const router = express.Router()

//  get event by town
router.route(['/town/:request'])
    .get(function (req, res) {
        connection.query(`SELECT e.id as "id_event" , e.name, e.date_begin, e.date_end, e.description, e.title, e.handicaps, e.address, e.event_url , r.name as "region_name", r.id as "region_id", d.id as "id_region", d.name as"departement_name", t.name as town FROM events e JOIN town t on e.town_id=t.id join regions r on e.id_region=r.id JOIN departments d on e.id_department=d.id WHERE t.name LIKE "${req.params.request}"`, (err, results) => {
            if (err) {
                console.log('Query error: ' + err);
                res.status(500).send("Erreur lors de la récupération des événements");
            } else {
                res.json(results).status(200);
            }
        })
    })

//  get events by region by name 
router.route(['/regions/:request'])
    .get(function (req, res) {
        connection.query(`SELECT e.id as "id_event" , e.name, e.date_begin, e.date_end, e.description, e.title, e.handicaps, e.address, e.event_url , r.name as "region_name", r.id as "region_id", d.id as "id_region", d.name as"departement_name", t.name as town FROM events e JOIN town t on e.town_id=t.id join regions r on e.id_region=r.id JOIN departments d on e.id_department=d.id WHERE r.name LIKE "${req.params.request}"`, (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de la récupération des événements");
                console.log('Query error: ' + err);
            } else {
                res.json(results).status(200);
            }
        })
    })
//  get establishment by region by name 
router.route(['/department/:request'])
    .get(function (req, res) {
        connection.query(`SELECT e.id as "id_event" , e.name, e.date_begin, e.date_end, e.description, e.title, e.handicaps, e.address, e.event_url , r.name as "region_name", r.id as "region_id", d.id as "id_region", d.name as"departement_name", t.name as town FROM events e JOIN town t on e.town_id=t.id join regions r on e.id_region=r.id JOIN departments d on e.id_department=d.id WHERE d.name LIKE "${req.params.request}"`, (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de la récupération des événements");
                console.log('Query error: ' + err);
            } else {
                res.json(results).status(200);
            }
        })
    })



module.exports = router