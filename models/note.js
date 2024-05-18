const mongo = require('mongoose')

const url = process.env.MONGO_URI

console.log("connect to", url)

mongo.connect(url)
    .then(result => {
        console.log("connected to Mongo")
    })
    .catch(error => {
        console.log("fail to connect to mongo", error.message)
    })

const noteSchema = mongo.Schema({
    content:{
        type:  String,
        minLenght: 5,
        require: true
    },
    important: Boolean
})

noteSchema.set('toJSON', {
    transform: (document, returnObject) =>{
        returnObject.id = returnObject._id.toString(),
        delete returnObject._id,
        delete returnObject.__v
    }
})

module.exports = mongo.model('note', noteSchema)