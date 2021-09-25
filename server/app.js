const express = require('express');
const app = express();

const graphqlHTTP = require('express-graphql').graphqlHTTP; //express bağlantısı
const schema = require('./schema/schema'); //graphql schema gerektirir
const mongoose = require('mongoose'); //database
const cors= require('cors'); //apollo ayarlama
require('dotenv').config();
const slowDown = require('express-slow-down');
const rateLimit = require('express-rate-limit');
const isAuth = require('./middlewares/is-auth');
const isValidAPI = require('./middlewares/api-keys');


//30 saniyede 10 request geçilmesin, her 30 saniyede 1 kontrol et
const limiter = rateLimit({
    windowMs: 30 * 1000, //30 seconds
    max: 10 //limit each IP to make 10 request per windowMs
});

//if user does more than 3 requests in 3 seconds add a half second delay at each
const speedLimiter = slowDown({
    windowMs:  3 * 1000, //3 seconds
    delayAfter: 3, //allow 3 request per 3 seconds
    delayMs: 500 //add half second delay after each request limit
});

app.use(cors()); //this is a basic security for apollo client

app.use(limiter); //use the limiter const to limit requests coming from IP
app.use(speedLimiter); //add delay if user passes requests per second

app.use(isAuth); //check is the user have a valid token (given in the header)
app.use(isValidAPI); //check is API key is valid (given in the header)

//use graphql express
app.use('/graphql',graphqlHTTP({
    schema:schema,
    graphiql:true
}));

//connect mongodb
mongoose.connect(process.env.DB_CONNECTION, ()=> {console.log('connected to db')});

//run server on 4000 port
app.listen(4000, ()=> console.log('listening port 4000'));