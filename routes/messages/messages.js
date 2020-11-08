const express = require("express")
const connection = require('../../conf')
const router = express.Router()

/////// Send a message from the form contact //////////

// get all messages 
router.route(['/all'])
    .get(function (req, res) {
        connection.query('SELECT * FROM `messages`', (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de la récupération des messages");
            } else {
                res.json(results).status(200);
            }
        })
    })
// get messages with status unread
router.route(['/unread'])
    .get(function (req, res) {
        connection.query('SELECT * FROM `messages` WHERE status = "unread"', (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de la récupération des messages non lus");
            } else {
                res.json(results).status(200);
            }
        })
    })
router.route(['/message:id'])
    .get(function (req, res) {
        connection.query('SELECT * FROM `messages` WHERE id = ?', req.params.id, (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de la récupération du message");
            } else {
                res.json(results).status(200);
            }
        })
    })
    .put(function (req, res) { // modifier un message
        const requestMessage = req.params.id;
        const formData = req.body;
        connection.query('UPDATE messages SET ? WHERE id=?', [formData, requestMessage], (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de la modification du produit");
            } else {
                res.sendStatus(200);
            }
        });
    })

router.route(['/send'])
    .post(function (req, res) {
        const formData = req.body;
        connection.query('INSERT INTO messages SET ?', formData, (err, results) => {
            if (err) {
                res.status(500).send("Erreur  l'ajout du message");
            } else {
                res.json(results).status(200);
            }
        })
    })
// INSERT INTO`messages`(`id`, `subject`, `message`, `contact`, `status`) VALUES(NULL, 'manger caca', 'dscsdcd*\r\ndc\r\ns\r\ndc\r\nsd\r\nc\r\nsdc\r\nsd\r\ncdsdsc\r\n', 'john@gmail.com', 'unread');


module.exports = router