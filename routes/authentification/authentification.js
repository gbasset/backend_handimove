const express = require('express')
require('dotenv').config(process.cwd(), '../.env')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const connection = require('../../conf')
const secret = process.env.JWT_SECRET
const router = express.Router()

/**
 * Route post d'authentification
 */

router.post('/', (req, res) => {
  /**
   * Verification du format de l'email fournit.
   */

  const emailRegEx = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/

  if (!emailRegEx.test(req.body.mail)) { //on test l'email fournit avec la regex 'emailRegEx'
    return res.status(401).send('Le format de cet email est invalide')
  }

  const email = req.body.mail
  const password = req.body.password

  /**
   * Recuperation de l'utilisateur par son email
   */

  connection.query(`SELECT avatar_url, username, mail, town, login, id as "id_user", is_admin, question, password  FROM users WHERE mail = ?`, email, (err, result) => {
    // console.log(email, password);

    if (err) {
      console.log('Query error: ' + err);
      return res.status(500).send(err)
    } else if (!result[0]) { // on verifie la presence d'un resultat dans la reponse
      return res.status(409).send('Cet utilisateur n\'existe pas dans notre base de donnée') // si pas de resultat l'email n'est pas enregistre en base donc l'utilisateur est inconnu
    }
    /**
     * Test du mot de passe envoye.
     */

    // console.log(password);
    const passwordIsValid = bcrypt.compareSync(password, result[0].password); // comparaison entre le mot de passe envoye et le hash suvegarde en base grace a compareSync de bcrypt
    // console.log(passwordIsValid);
    if (!passwordIsValid) {
      console.log('Query: ' + err);
      return res.status(401).send("Ce mot de passe est invalide");
      // Si passwordValid est false le mot de passe est faux, on renvoie donc une 401 
    }
    /**
     * Construction du token
     */

    const token = jwt.sign(// on utilise sign de jwt pour creer le token
      { id: result[0].id, name: result[0].username, email: result[0].mail }, // on rentre les information de l'utilisateur dont on a besoin en front 
      secret, // correspond a une chaine de caractere permettant de chiffrer la signature du token
      {
        expiresIn: '24h'// fixe la duree de vie du token
      },
      { algorithm: 'RS256' }// specifie l'algorithme de chiffrage utilise
    );
    res.header("Access-Control-Expose-Headers", "x-access-token") // On crer le header de la reponse
    res.set("token", token) // on ajoute le token au header
    res.status(200).send({ auth: true, userInformations: result }) // on envoie la reponse
  });
})

module.exports = router