import React, {Component} from 'react';
import {graphql} from 'react-apollo';

import {getBookDetailsQuery} from '../queries/queries'

class BookDetails extends Component{

    showBookDetails(){
        const loadi = this.props.data.loading;
        if(loadi == false){
            console.log("loadvar");
            const book = this.props.data.kitap;
            if(book){
                return(
                    <div>
                        <h2>{book.name}</h2>
                        <h4>{book.bType}</h4>
                        <h3>{book.author.name}</h3>
                        <div >
                            {
                                book.author.books.map(b=>{
                                    return <span className = "author-books" key={b.id}>{b.name}</span>
                                })
                            }
                        </div>
                    </div>
                )
            }
            
        }
    }

    render(){
        return(
            <div>
                <p className="book-details">{this.showBookDetails()}</p>
            </div>
        )
    }
}

export default graphql(getBookDetailsQuery,{
    options:(props)=>{
        return{
            variables:{
                name:props.bookName
            }
        }
    }
}) (BookDetails);