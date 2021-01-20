const express = require('express')
const Article = require('./../models/article')
//va a creare vari handler modulari, montabili (lo usiamo per aggiungere articoli)
const router = express.Router();

router.get('/new',(req,res)=>{
    res.render('articles/new',{ articolo: new Article() })
})

//modificare
router.get('/edit/:id',async (req,res)=>{
    const article = await Article.findById(req.params.id)
    res.render('articles/edit',{ articolo: article })
})


router.get('/:slug', async (req,res)=>{
    //findOne e non find perche il secondo individua un'array
    const articolo = await Article.findOne({
        slug: req.params.slug
    })
    if (articolo == null) res.redirect('/')
    res.render('articles/show', {articolo:articolo})
})


// sta roba crea un nuovo articolo (che figata)
router.post('/', async (req,res,next)=>{
    req.articolo = new Article()
    next()
},saveArticleAndRedirect('new'))

//
router.put('/:id', async (req,res,next)=>{
    req.articolo = await Article.findById(req.params.id)
    next()
},saveArticleAndRedirect('edit'))

router.delete('/:id', async (req,res)=> {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

 function saveArticleAndRedirect(path){
    return async (req,res) =>{
        let articolo = req.articolo
        let corpo = req.body
            articolo.titolo = corpo.titolo,
            articolo.descrizione = corpo.descrizione,
            articolo.markdown = corpo.markdown

        try{
            articolo = await articolo.save()
            res.redirect(`/articles/${articolo.slug}`)
        }  catch(err){
            console.log(err)
            res.render(`articles/${path}`, {articolo: articolo})
        }
    }
}
module.exports = router;