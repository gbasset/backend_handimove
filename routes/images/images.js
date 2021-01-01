const express = require("express")
const connection = require('../../conf')
const router = express.Router()
const multer = require("multer");
const upload = multer({ dest: "public/" });
const fs = require("fs");

router.post("/upload/establish/:id", upload.array("file"), (req, res, next) => {
    const id = req.params.id;
    let error = false;
    req.files.map(file => {
        let arr = []
        let Timestamp = Math.round(new Date().getTime() / 1000)
        let FileName = file.originalname
        let regex1 = /\’\”\;\,\*\./gi;
        let NewFileName = FileName.replace(regex1, "").split(" ").join("").toLowerCase()
        fs.rename(file.path, `public/${Timestamp}${NewFileName}`, err => {
            if (err) {
                error = true;
            } else {
                const objectFile = {
                    image_name: `${Timestamp}${NewFileName}`,
                    image_url: `public/${Timestamp}${NewFileName}`,
                }
                connection.query("INSERT INTO images SET ?", objectFile, (err2, results) => {
                    if (err2) {
                        error = true;
                    } else {
                        console.log(results);
                        connection.query(`INSERT INTO images_establishment (id_esta,id_image) VALUES (${id}, ${results.insertId})`, (err3, results) => {
                            if (err3) {
                                error = true;
                            } else {
                                connection.query(`Select * from images i join images_establishment ies on i.id=ies.id_image where ies.id_esta=${id}`, (err4, results) => {
                                    if (err4) {
                                        error = true;
                                    } else {
                                        console.log("results", results);
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    })
    if (error) {
        res.send("Problem when uploading files").status(500);
    } else
        return res.send("Files uploaded sucessfully").status(200);
});

//  get establishment by region by name 
router.route(['/establishment/:id'])
    .get(function (req, res) {
        connection.query(`Select * from images i join images_establishment ies on i.id=ies.id_image where ies.id_esta=${req.params.id}`, (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de la récupération des etablissements");
                console.log('Query error: ' + err);
            } else {
                res.json(results).status(200);
            }
        })
    })
router.post("/upload/event/:id", upload.array("file"), (req, res, next) => {
    const id = req.params.id;
    let error = false;
    req.files.map(file => {
        console.log(file);
        let arr = []
        let Timestamp = Math.round(new Date().getTime() / 1000)
        let FileName = file.originalname
        let regex1 = /\’\”\;\,\*\./gi;
        let NewFileName = FileName.replace(regex1, "").split(" ").join("").toLowerCase()
        fs.rename(file.path, `public/${Timestamp}${NewFileName}`, err => {
            if (err) {
                error = true;
            } else {
                const objectFile = {
                    image_name: `${Timestamp}${NewFileName}`,
                    image_url: `public/${Timestamp}${NewFileName}`,
                }
                connection.query("INSERT INTO images SET ?", objectFile, (err2, results) => {
                    if (err2) {
                        error = true;
                    } else {
                        console.log(results);
                        connection.query(`INSERT INTO images_event (id_event,id_image) VALUES (${id}, ${results.insertId})`, (err3, results) => {
                            if (err3) {
                                error = true;
                            } else {
                                connection.query(`Select * from images i join images_event ies on i.id=ies.id_image where ies.id_image=${id}`, (err4, results) => {
                                    if (err4) {
                                        error = true;
                                    } else {
                                        console.log("results", results);
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    })
    if (error) {
        res.send("Problem when uploading files").status(500);
    } else
        return res.send("Files uploaded sucessfully").status(200);
});

//  get establishment by region by name 
router.route(['/event/:id'])
    .get(function (req, res) {
        connection.query(`Select * from images i join images_event ies on i.id=ies.id_image where ies.id_event=${req.params.id}`, (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de la récupération des etablissements");
                console.log('Query error: ' + err);
            } else {
                res.json(results).status(200);
            }
        })
    })

/// post an avatar image 
router.post("/upload/avatar/", upload.array("file"), (req, res, next) => {
    let error = false;
    req.files.map(file => {
        console.log(file);
        let arr = []
        let Timestamp = Math.round(new Date().getTime() / 1000)
        let FileName = file.originalname
        let regex1 = /\’\”\;\,\*\./gi;
        let NewFileName = FileName.replace(regex1, "").split(" ").join("").toLowerCase()
        fs.rename(file.path, `public/${Timestamp}${NewFileName}`, err => {
            if (err) {
                error = true;
            } else {
                const objectFile = {
                    name: `${Timestamp}${NewFileName}`,
                    url: `public/${Timestamp}${NewFileName}`,
                }
                connection.query("INSERT INTO avatars SET ?", objectFile, (err2, results) => {
                    if (err2) {
                        error = true;
                    }
                })
            }
        })
    })
    if (error) {
        res.send("Problem when uploading files").status(500);
    } else
        return res.send("Files uploaded sucessfully").status(200);
});

//  get all avatars
router.route(['/avatars'])
    .get(function (req, res) {
        connection.query(`Select * from avatars`, (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de la récupération des avatars");
                console.log('Query error: ' + err);
            } else {
                res.json(results).status(200);
            }
        })
    })

router.route(['/avatar/:id'])
    .delete(function (req, res) {
        const id = req.params.id;
        connection.query(`Delete from avatars WHERE id=?`, id, (err, results) => {
            if (err) {
                res.status(500).send("Erreur lors de la suppresion de l'avatar");
                console.log('Query error: ' + err);
            } else {
                res.json(results).status(200);
            }
        })
    })
module.exports = router