const mongoose = require('mongoose')

const movieSchema = mongoose.Schema({
    mid:{
        type: Number,
        required: true
    },
    name:{
        type: String,
        required: true,
        trim: true
    },
    duration:{
        type: Number,
        required: true
    }
})

module.exports = mongoose.model("movie", movieSchema)