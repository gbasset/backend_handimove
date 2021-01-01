const express = require("express")
const connection = require('../../conf')
const router = express.Router()

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
router.route(['/message/:id'])
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
    .delete(function (req, res) {
        const id = req.params.id
        connection.query('DELETE FROM messages WHERE id=?', id, err => {
            if (err) {
                res.render(err).status(500).send("Erreur lors de la suppression d'un header collection menu");
            } else {
                res.sendStatus(200);
            }
        });
    })
/////// Send a message from the form contact //////////
router.route(['/send'])
    .post(function (req, res) {
        const formData = req.body;
        connection.query('INSERT INTO messages SET ?', formData, (err, results) => {
            if (err) {
                console.log('Query error: ' + err);
                res.status(500).send("Erreur  l'ajout du message");
            } else {
                res.json(results).status(200);
            }
        })
    })

module.exports = router