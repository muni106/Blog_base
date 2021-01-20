const express = require('express')
const mongoose = require('mongoose')
//importiamo la ROUTE degli articoli del blog
const articleRouter = require('./routes/articles')
//importiamo gli articoli del blog nella home
const Articolo = require('./models/article')
//importiamo libreria per portare alcune funzioni come cancellare
const methodOverride = require('method-override')


const app = express()


//connettiamo il database
mongoose.connect("mongodb+srv://mounirsamite:Muni106vuolete@cluster0.nanar.mongodb.net/<dbname>?retryWrites=true&w=majority",
 { useNewUrlParser:true, useUnifiedTopology: true, useCreateIndex:true })

//vado a dire che uso ejs come motore di visualizzazione
app.set('view engine', 'ejs')


app.use(express.urlencoded({extended:false}))
//diciamo alla nostra app di usare method-override
app.use(methodOverride('_method'))


// this is '/' route get call
app.get('/', async (req,res)=>{
    //sta roba fa vede tutti gli articoli che abbiamo creato
    const articolo = await Articolo.find().sort({
        creatoIl: 'desc'
    })
    res.render('articles/index', { articoli : articolo})
})

//chiamiamo gli articoli del blog 8:00
app.use('/articles', articleRouter)

app.listen(5000)