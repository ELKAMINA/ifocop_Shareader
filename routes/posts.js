const { model } = require("mongoose");
const router = require("express").Router();
const Post = require("../models/Post");

/*----------- Créer un post ------------*/
router.post("/", async(req,res)=> {
    const newPost = new Post(req.body)
    const savedPost = await newPost.save()
    .catch(err => {
        res.status(500).json(err)
    })
    res.status(200).json(savedPost)
})
/*--------------------------------------------*/

/*----------- Supprimer un post ------------*/
/*--------------------------------------------*/
/*----------- MAJ un post ------------*/
router.put("/:id", async(req,res)=> {
    //.... On récupère le post qui a le même id que notre requête
    const post = await Post.findById(req.params.id)
    .catch(err => {
        res.status(500).json(err)
    })
    //.... On vérifie que l'utilisateur associé est bien celui qui l'a posté
    if (post.userId === req.body.userId)
    {
        //.... On modifie le post
        await post.updateOne({$set: req.body})
        .catch(err => {
            res.status(500).json(err)
        })
        res.status(200).json("Ton post a été modifié")
    }
    else 
        res.status(403).json("Tu peux mettre à jour uniquement tes posts Coco ")
})
/*--------------------------------------------*/

/*----------- Liker un post ------------*/
/*--------------------------------------------*/
/*----------- get un post ------------*/
/*--------------------------------------------*/
/*----------- get les timeslines un post ------------*/
/*--------------------------------------------*/
module.exports = router;