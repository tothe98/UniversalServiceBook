const mongoose = require('mongoose')

const PictureSchema = new mongoose.Schema({
    picture: {
        type: String,
        required: true
    },
    _uploadFrom: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'UserInfo'
    },
    isDelete: {
        type: Boolean,
        default: false
    },
    uploadAt:{
        type: Date,
        default: Date.now,
        required: true
    }

},
    {
        collection: 'Pictures'
    })

mongoose.model('Pictures', PictureSchema)