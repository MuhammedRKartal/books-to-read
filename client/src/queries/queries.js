import {gql} from 'apollo-boost';

const getBooksQuery=gql`
    { 
        books{
            name
            bType
            id
        }
    }
`

const getAuthorsQuery=gql`
    {
        authors{
            name
            age
            id
        }
    }
`

const addBookMutation=gql`
    mutation($name:String!, $bType:String!, $authorID:ID!){
        addBook(name:$name,bType:$bType,authorID:$authorID){
            name
            bType
            id
        }
    }
`

const getBookDetailsQuery=gql`
query($name:String){
    kitap(name:$name){
        id
        name
        bType
        author{
            id
            name
            age
            books{
                id
                name
            }
        }
    }
}
`


export {getAuthorsQuery,getBooksQuery, addBookMutation, getBookDetailsQuery};
