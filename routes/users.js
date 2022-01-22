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
        return res.status(403).json("Tu peux mettre à jour uniquement ton compte ")
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

/*----------- Follow A USER ------------*/
router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id)
    {
        //.... On cherche l'utilisateur à follow dans la BDD.
        const user = await User.findById(req.params.id)
        .catch(err =>{
            return res.status(500).json(err)
        })
        const currentUser = await User.findById(req.body.userId)
        .catch(err =>{
            return res.status(500).json(err)
        })
        if (!user.followers.includes(req.body.userId))
        {
            await user.updateOne({$push: { followers: req.body.userId }})
            await currentUser.updateOne({ $push: { following: req.params.id }})
            res.status(200).json("On t'a vu, tu l'as suivi!")
        }
        else
        {
            res.status(403).json("On sait que tu le kiffes trop mais tu le suis déjà!")
        }
    }
    else
        return res.status(403).json("On sait que tu te kiffes mais tu ne peux pas te follow par toi-même")
})
/*--------------------------------------------*/

/*----------- UNFOLLOW ------------*/
router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id)
    {
        //.... On cherche l'utilisateur à follow dans la BDD.
        const user = await User.findById(req.params.id)
        .catch(err =>{
            return res.status(500).json(err)
        })
        const currentUser = await User.findById(req.body.userId)
        .catch(err =>{
            return res.status(500).json(err)
        })
        if (user.followers.includes(req.body.userId))
        {
            await user.updateOne({$pull: { followers: req.body.userId }})
            await currentUser.updateOne({ $pull: { following: req.params.id }})
            res.status(200).json("Ah ça sent la bagarre! Tu l'as bien unfollow en tout cas")
        }
        else
        {
            res.status(403).json("Tu ne suis pas cet utilisateur")
        }
    }
    else
        return res.status(403).json("On sait que tu ne t'aimes plus, mais tu ne peux malheureseument pas t'unfollower toi-même")
})
/*--------------------------------------------*/
module.exports = router;