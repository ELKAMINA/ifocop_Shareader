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
router.delete("/:id", async(req,res)=> {
    //.... On récupère le post qui a le même id que notre requête
    const post = await Post.findById(req.params.id)
    .catch(err => {
        res.status(500).json(err)
    })
    //.... On vérifie que l'utilisateur associé est bien celui qui l'a posté
    if (post.userId === req.body.userId)
    {
        //.... On supprime le post
        await post.deleteOne({$set: req.body})
        .catch(err => {
            res.status(500).json(err)
        })
        res.status(200).json("Alors on assume pas ? Ton post a bien été supprimé")
    }
    else 
        res.status(403).json("Tu peux supprimer uniquement que tes posts Coco ")
})
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
router.put("/:id/like", async(req,res)=> {
    //.... On récupère le post qui a le même id que notre requête
    const post = await Post.findById(req.params.id)
    .catch(err => {
        res.status(500).json(err)
    })
    //.... On vérifie si le post n'a pas été liké par l'utilisateur
    if (!post.likes.includes(req.body.userId))
    {
        //.... On modifie le post
        await post.updateOne({$push: {likes: req.body.userId}})
        .catch(err => {
            res.status(500).json(err)
        })
        res.status(200).json("Tu as liké")
    }
    else 
    {
        //.... Si le même post est reliké => dislike
        await post.updateOne({$pull: {likes: req.body.userId}})
        .catch(err => {
            res.status(500).json(err)
        })
        res.status(200).json("Tu as supprimé ton like")
    }
})
/*--------------------------------------------*/

/*----------- get un post ------------*/
router.get("/:id", async(req,res)=> {
    //.... On récupère le post qui a le même id que notre requête
    const post = await Post.findById(req.params.id)
    .catch(err => {
        res.status(500).json(err)
    })
    //.... On le récupère
    res.status(200).json(post)
})
/*--------------------------------------------*/
/*----------- get les timeslines un post ------------*/
/*--------------------------------------------*/
module.exports = router;