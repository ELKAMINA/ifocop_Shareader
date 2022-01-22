const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

/*----------- MAJ USER ------------*/
    //... router.put, requête pour modifier/updater des informations
router.put("/:id", async (req, res) => {
    //.... Ici, je n'ai pas cibler req.user.isAdmin car introuvable
    if (req.body.userId === req.params.id)
    {
        if  (req.body.password)
        {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt)
            .catch(err =>{
                return res.status(500).json(err)
            })
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            })
            .catch(err =>{
                return res.status(500).json(err)
            })
            res.status(200).json("Compte mis à jour")
        }
    }
    else 
    {
        return res.status(403).json("Tu peux mettre à jour uniquement ton compte ")
    }
})
/*--------------------------------------------*/

/*----------- SUPP USER ------------*/
//... router.put, requête pour modifier/updater des informations
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id)
    {
        const user = await User.findByIdAndDelete(req.params.id)
        .catch(err =>{
            return res.status(500).json(err)
        })
        res.status(200).json("Compte supprimé")
    }
    else 
    {
        return res.status(403).json("Tu peux mettre à jour uniquement ton compte ")
    }
})
/*--------------------------------------------*/

/*----------- Get A USER ------------*/
router.get("/:id", async (req, res) => {
    const user = await User.findById(req.params.id)
    //.... Si on veut filtrer le résultat de notre requête, on crée un objet avec toutes les propriétés que l'on ne veut pas.
    .catch(err =>{
        return res.status(500).json(err)
    })
    const {password, updatedAt, ...other} = user._doc
    res.status(200).json(other)
})
/*--------------------------------------------*/

/*----------- SUIVRE A USER ------------*/
/*--------------------------------------------*/

/*----------- UNFOLLOW ------------*/
/*--------------------------------------------*/
router.get("/",(req,res) => {
    res.send("Hey its user route");
})

module.exports = router;