const mongoose = require('mongoose')

const ModelSchema = new mongoose.Schema({
    model: {
        type: String,
        required: true
    },
    _manufacture: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }

},
    {
        collection: 'Models'
    })

mongoose.model('Models', ModelSchema)