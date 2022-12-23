const { default: mongoose } = require('mongoose')
const mongooose=require('mongoose')
const Schema=mongooose.Schema
const PostSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String
    },
    url:{
        type:String
    },
    status:{
        type:String,
        enum:['TO LEARN', 'LEARNING', 'LEARNED']
    },
    user:{
        type:Schema.Types.ObjectId, //noi voi user ben kia
        ref:'users' // cai bang
    }
})
module.exports= mongoose.model('posts',PostSchema )