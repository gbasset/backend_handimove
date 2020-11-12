const express = require("express")
const connection = require('../../conf')
const router = express.Router()
const multer = require("multer");
const upload = multer({ dest: "public/" });
const fs = require("fs");

// router.post('/uploaddufichier', upload.single('monfichier'), function (req, res, next) {
//     var tmp_path = req.file.path;
//     console.log(tmp_path);
//     fs.rename(req.file.path, 'public/images/' + req.file.originalname, function (err) {
//         if (err) {
//             res.send('problème durant le déplacement');
//         } else {
//             res.send('Fichier uploadé avec succès');
//         }
//     });
// })

// faire un upload pour le site en mode images 
// faire un upload par event 
// faire un get par etablissement 
// get par event 

router.post("/upload/:id", upload.array("file"), (req, res, next) => {
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

module.exports = router