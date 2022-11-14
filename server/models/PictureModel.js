const mongoose = require('mongoose')

const PictureSchema = new mongoose.Schema({
    picture: {
        type: mongoose.Types.String,
        required: true
    },
    _uploadFrom: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    isDelete: {
        type: mongoose.Types.Boolean,
        default: false
    },
    uploadAt:{
        type: mongoose.Types.Date,
        default: Date.now,
        required: true
    }

},
    {
        collection: 'Pictures'
    })

mongoose.model('Pictures', PictureSchema)