var mongoose =require('mongoose')
const marked = require('marked')
const slugify = require('slugify')

const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

//abbiamo creato una table nel nostro database con specificate queste cose
var articleSchema = new mongoose.Schema({
    titolo:{
        type: String,
        required:true
    },
    descrizione:{
        type: String,
    },
    markdown:{
        type: String,
    },
    creatoIl:{
        type:Date,
        default: Date.now()
    },
    //serve a cambiare l'URL => usa titolo al posto dell'id
    slug:{
        type:String,
        required:true,
        unique:true
    },
    sanitizedHtml: {
        type:String,
        required: true
    }

}
)

//collegato a slug
articleSchema.pre('validate', function(next){
    if (this.titolo){
        this.slug = slugify(this.titolo, {lower:true,
        strict:true })
    }
    //da jsdom e dompurify
    if(this.markdown) {
        this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
    }
    next()
})

//EXPORTSSSSSSSSS PER LA MADONNA
module.exports = mongoose.model('Article', articleSchema)