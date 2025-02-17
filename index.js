const express = require('express')
const { buildSchema } = require("graphql")
const { graphqlHTTP } = require("express-graphql")
const mongoose = require('mongoose')
require('dotenv').config();
const MovieModel = require('./models/Movie')

const app = express()

const SERVER_PORT = 4000;
const MONGO_URI = process.env.MONGO_URI;

const gqlSchema = buildSchema( 
    `
    type Query {
        movie: Movie
        movies: [Movie]
        movieByName(name: String!): Movie
        movieById(id: ID!): Movie
    },
    type Mutation {
        addMovie(mid: Int, name: String, duration: Float): Movie
        updateMovie(id: ID!, name: String, duration: Float): Movie
        deleteMovie(id: ID!): String
    },
    type Movie{
        _id: ID
        mid: Int
        name: String
        duration: Float
    }
    `
)

const rootResolver = {
    movie: async () =>{
        const movie = await MovieModel.findOne({})

        return movie
    },
    movies: async () =>{
        const movies = await MovieModel.find({})
        return movies
    },
    addMovie: async ({mid, name, duration}) => {
        const movie = new MovieModel({
            mid,
            name,
            duration
        })

        const newMovie = await movie.save()
        return newMovie
    },
    movieByName: async ({name}) => {
        const movie = await MovieModel.findOne({'name': name})
        return movie
    },
    movieById: async ({ id }) => {
        return await MovieModel.findById(id);
    },
    updateMovie: async ({ id, name, duration }) => {
        return await MovieModel.findByIdAndUpdate(
            id,
            { name, duration },
            { new: true }
        );
    },
    deleteMovie: async ({ id }) => {
        await MovieModel.findByIdAndDelete(id);
        return "Movie deleted successfully!";
    }
}

const graphqlHttp = graphqlHTTP({
    schema: gqlSchema,
    rootValue: rootResolver,
    graphiql: true
})

app.use("/graphql", graphqlHttp)

const connectDB = async() => {
    try {
        console.log("Attempting to connect to DB")
        mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
        }).then(() => console.log('Succesful MongoDB Connection'))
        .catch(err => console.log('MongoDB Connection Error:', err));
    }
    catch {
        console.log(`Unable to connect to DB: ${error.message}`)
    }
}

app.listen(SERVER_PORT, () => {
    connectDB()
    console.log(`Server running on port ${SERVER_PORT}`)
    console.log("http://localhost:4000/graphql")
});