const express = require('express');
const app = express();
const graphqlHTTP = require('express-graphql').graphqlHTTP; //express bağlantısı
const schema = require('./schema/schema'); //graphql schema gerektirir
const mongoose = require('mongoose'); //database
const cors= require('cors'); //apollo ayarlama


app.use(cors());

app.use('/graphql',graphqlHTTP({
    schema:schema,
    graphiql:true
}));

mongoose.connect('mongodb+srv://hirohito:14421473aA.@hirodb.wbn7q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
mongoose.connection.once('open',()=>{
    console.log("başarılı bağlantı db")
});

app.listen(4000,()=>{
    console.log('4000 portu dinleniyor');
});