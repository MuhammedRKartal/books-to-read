const graphql = require('graphql');
const { buildResolveInfo } = require('graphql/execution/execute');
const Book = require('../Models/book');
const Author = require('../Models/author');
const User = require('../Models/user');
const { findOne } = require('../Models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//object type ile databasedeki türü belirtiriz, string ile doğrudan tür
const {GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLList, 
    GraphQLSchema,
    GraphQLNonNull
}= graphql;

const UserType = new GraphQLObjectType({
    name:'User',
    fields:()=>({
        username:{type:GraphQLString},
        email:{type:GraphQLString},
        password:{type:GraphQLString}
    })
})

const loginTokenType = new GraphQLObjectType({
    name:'Token',
    fields:()=>({
        userID:{type:GraphQLID},
        email:{type:GraphQLString},
        token:{type:GraphQLString}
    })
})

const BookType = new GraphQLObjectType({
    name:'Book',
    fields:()=>({
        id:{type:GraphQLID},
        name:{type:GraphQLString},
        bType:{type:GraphQLString},
        author:{
            type:AuthorType,
            resolve(parent,args){
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
                //find all books written by the given author
                return Book.find({authorID:parent.id})
            }
        }
    })
})

//rootquery
const RootQuery = new GraphQLObjectType({
    name:"RootQueryType",
    fields:{
        //create a get book query by given book name
        //this is async because we are using database to get book name
        kitap:{
            type:BookType, 
            args:{
                name:{type:GraphQLString}
            },
            resolve: async(parent,args,req)=>{
                const book = await Book.findOne({name:args.name});
                return book;
            }
        },
        //create a get author query by given author ID
        yazar:{
            type:AuthorType,
            args:{
                id:{type:GraphQLID}
            },
            resolve: async(parent,args)=>{
                return await Author.findById(args.id);
            }
        },
        //return all books
        books:{
            type:new GraphQLList(BookType),
            resolve(parent,args){
                return Book.find({});
            }
        },
        //return all authors
        authors:{
            type:new GraphQLList(AuthorType),
            args:{
                id:{type:GraphQLID}
            },
            resolve(parent,args){
                return Author.find({});
            }
        },
        //login by email and password
        login:{
            type: loginTokenType,
            args:{
                email:{type:GraphQLString},
                password:{type:GraphQLString}
            },
            resolve: async(parent,args)=>{
                const user = await User.findOne({email:args.email});
                if(!user){
                    throw new Error('User not Found');
                }
                else{
                    const isEqual = await bcrypt.compare(args.password, user.password); //hashing the password to store in database (security)
                    if(!isEqual){
                        throw new Error('Wrong password');
                    }
                    else{
                        const token = jwt.sign({email: user.email}, process.env.ACCESS_TOKEN_SECRET, {expiresIn:'30m'}); //create a token to sign in it expires in 30 mins
                        return {userID:user.id, email:user.email, token:token}; //return the user.id, email and the token
                    }
                }
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
        },
        signUp:{
            type:UserType,
            args:{
                username:{type:new GraphQLNonNull(GraphQLString)},
                email:{type:new GraphQLNonNull(GraphQLString)},
                password:{type:new GraphQLNonNull(GraphQLString)},
            },
            resolve: async (parent,args,req)=>{
                const existingUser = await User.findOne({email: args.email});
                if (existingUser){
                    throw new Error('User already exists');
                }
                else{
                    const hashedPassword = await bcrypt.hash(args.password,16);
                    let user = new User({
                        username:args.username,
                        email:args.email,
                        password:hashedPassword
                    })
                    return await user.save();
                }
            }
        }
    }
})

module.exports = new graphql.GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
    
})
