const mongo = require('mongoose')

if(process.argv.length < 3){
    console.log('Ingrese la contraseña: ')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://lucasP:${password}@test.nxukuu6.mongodb.net/noteApp?retryWrites=true&w=majority`

mongo.set('strictQuery', false)

mongo.connect(url)

const noteSchema = mongo.Schema({
    content: String,
    important: Boolean
})

const Note = mongo.model('Note', noteSchema)

// const note = new Note({
//     content: "made in mongoose",
//     important: true
// })

// note.save().then(result => {
//     console.log('note added')
//     mongo.connection.close()
// })

Note.find({}).then(result => {
    result.forEach(note => {
        console.log(note)
    });
    mongo.connection.close()
})