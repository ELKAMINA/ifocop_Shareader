const router = require("express").Router();
const e = require("express");
const User = require("../models/User")
const bcrypt = require("bcrypt");

/*----------- REGISTERING A USER ------------*/
router.post("/register", async (req,res) => {
    /*****Protecting PWD in DB ******/
        //....Salting a password = ajouter une random string pr qu'il devienne inhackable
    const salt = await bcrypt.genSalt(10);
    const hashedPasswd = await bcrypt.hash(req.body.password, salt);
    /********************************/

    /***** Créer new user ******/
    const newUser =  await new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPasswd,
    });
        //....Enregistrer le user et renvoyer une réponse.
    const user = await newUser.save()
    .catch(e => {
        console.log('Probleme avec operation de récupération: ' + e.message);
    })
    res.status(200).json(user);
})
/*--------------------------------------------*/

/*----------- LOGIN WITH A USER ------------*/
router.post("/login", async (req, res) =>{
    /***** Checking user existence in DB  ******/
        //....Check de l'email
    const user = await User.findOne({email: req.body.email})
    .catch(err => {
        res.status(500).json(err);
    })
    !user && res.status(404).send("User Not Found")

        //....Check du MDP
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    .catch(err => {
        res.status(500).json(err);
    })
    !validPassword && res.status(400).json("Wrong Password")

    res.status(200).json(user);
    /********************************/


})
/*--------------------------------------------*/

module.exports = router;