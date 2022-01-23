const mongoose = require("mongoose");
const { stringify } = require("nodemon/lib/utils");

const PostSchema = new mongoose.Schema({
    userId:{
        type:String,
        require:true,
    },
    img:{
        type:String,
        default:""
    },
    likes:{
        type:Array,
        default:[]
    },
    desc:{
        type: String,
        max: 500
    },
},
{timestamps: true}
)

module.exports = mongoose.model("Post", PostSchema);
