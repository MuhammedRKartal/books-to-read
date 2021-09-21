const graphql = require('graphql');
const { buildResolveInfo } = require('graphql/execution/execute');
const Book = require('../Models/book');
const Author = require('../Models/author');

//object type ile databasedeki türü belirtiriz, string ile doğrudan tür
const {GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLList, 
    GraphQLSchema,
    GraphQLNonNull
}= graphql;


const BookType = new GraphQLObjectType({
    name:'Book',
    fields:()=>({
        id:{type:GraphQLID},
        name:{type:GraphQLString},
        bType:{type:GraphQLString},
        author:{
            type:AuthorType,
            resolve(parent,args){
                console.log(parent);
                //return _.find(yazarlar,{name:parent.authorName})
                return Author.findById(parent.authorID);
            }
        }
        
    })
})

const AuthorType = new GraphQLObjectType({
    name:'Author',
    fields:()=>({
        id:{type:GraphQLID},
        name:{type:GraphQLString},
        age:{type:GraphQLInt},
        books:{
            type:new GraphQLList(BookType),
            resolve(parent,args){
                //return _.filter(kitaplar,{authorName:parent.name})
                return Book.find({authorID:parent.id})
            }
        }
    })
})

//kitap tipini referans alan çağırma işlemi yapılır
const RootQuery = new GraphQLObjectType({
    name:"RootQueryType",
    fields:{
        kitap:{
            type:BookType, 
            args:{
                //id:{type:GraphQLID},
                name:{type:GraphQLString}
            },
            resolve: async(parent,args)=>{
                const a = await Book.findOne({name:args.name});
                return a;
            }
        },
        yazar:{
            type:AuthorType,
            args:{
                id:{type:GraphQLID}
            },
            resolve(parent,args){
                //return _.find(yazarlar,{name:args.name})
                return Author.findById(args.id);
            }
        },
        books:{
            type:new GraphQLList(BookType),
            resolve(parent,args){
                //return kitaplar
                return Book.find({});
            }
        },
        authors:{
            type:new GraphQLList(AuthorType),
            args:{
                id:{type:GraphQLID}
            },
            resolve(parent,args){
                //return yazarlar
                return Author.find({});
            }
        }
    }
});


const Mutation= new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addAuthor:{
            type:AuthorType,
            args:{
                name:{type:new GraphQLNonNull(GraphQLString)},
                age:{type:new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent,args){
                let yazar = new Author({
                    name:args.name,
                    age:args.age    
                });
                return yazar.save();
            }
        },
        addBook:{
            type:BookType,
            args:{
                name:{type:new GraphQLNonNull(GraphQLString)},
                bType:{type:new GraphQLNonNull(GraphQLString)},
                authorID:{type:new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent,args){
                let book = new Book({
                    name:args.name,
                    bType:args.bType,
                    authorID:args.authorID    
                });
                return book.save();
            }
        },
        deleteBook:{
            type:BookType,
            args:{
                id:{type:GraphQLID}
            },
            resolve(parent,args){
                return Book.findByIdAndRemove(args.id);
            }
        }
    }
})

module.exports = new graphql.GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
    
})
