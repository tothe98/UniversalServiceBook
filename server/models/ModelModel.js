const mongoose = require('mongoose')

const ModelSchema = new mongoose.Schema({
    model: {
        type: mongoose.Types.String,
        required: true
    },
    _manufacture: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    isActive: {
        type: mongoose.Types.Boolean,
        default: true
    }

},
    {
        collection: 'Models'
    })

mongoose.model('Models', ModelSchema)