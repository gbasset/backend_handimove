const express = require("express")
const connection = require('../../conf')
const router = express.Router()

//  get establishment by id 
router.route(['/establishments/:id'])
    .get(function (req, res) {
        const id = req.params.id
        connection.query('SELECT * FROM establishment WHERE id_etablishment=?', id, (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de la récupération de etablissement");
            } else {
                res.json(results).status(200);
            }
        })
    })
//  get establishment by region name 
router.route(['/establishment/town/:request'])
    .get(function (req, res) {
        connection.query(`SELECT e.name,e.town, e.id_etablishment, e.address, e.url_website, e.phone, e.zip_code, e.region, e.department, e.category, e.activity,e.handicaps,e.handicaps, t.latitude, t.longitude FROM town t INNER join establishment e on t.name=e.town WHERE e.town LIKE "${req.params.request}" group by e.id_etablishment ORDER BY e.name ASC`, (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de la récupération de l'etablissement");
                console.log('Query error: ' + err);
            } else {
                res.json(results).status(200);
            }
        })
    })
//  get establishment by region by name 
router.route(['/establishment/regions/:request'])
    .get(function (req, res) {
        connection.query(`SELECT e.name, e.town,e.id_etablishment, e.address, e.url_website, e.phone, e.zip_code, e.region, e.department, e.category, e.activity,e.handicaps,e.handicaps, t.latitude, t.longitude FROM town t INNER join establishment e on t.name=e.town WHERE e.region LIKE "${req.params.request}" group by e.id_etablishment ORDER BY e.town ASC`, (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de la récupération des etablissements");
                console.log('Query error: ' + err);
            } else {
                res.json(results).status(200);
            }
        })
    })
//  get establishment by region by name 
router.route(['/establishment/department/:request'])
    .get(function (req, res) {
        connection.query(`SELECT  e.name,e.town, e.id_etablishment, e.address, e.url_website, e.phone, e.zip_code, e.region, e.department, e.category, e.activity,e.handicaps,e.handicaps, t.latitude, t.longitude FROM town t INNER join establishment e on t.name=e.town WHERE e.department LIKE"${req.params.request}" group by e.id_etablishment ORDER BY e.town ASC`, (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de la récupération des etablissements");
                console.log('Query error: ' + err);
            } else {
                res.json(results).status(200);
            }
        })
    })



module.exports = router