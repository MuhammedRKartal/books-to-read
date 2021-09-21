import React, {Component} from 'react';

import {graphql} from 'react-apollo';

import {getBooksQuery} from '../queries/queries';
import BookDetails from './BookDetails'


class BookList extends Component{
    constructor(props){
        super()
        this.state={
            selected:null
        }
    }
    showBooks(){
        var data = this.props.data;
        if(data.loading == false){
            return data.books.map(book=>{
                return(
                    <span className='book-list-item' key={book.name} onClick={(e)=>{this.setState({selected:book.name})}}>
                        {book.name}
                    </span>
                )
            })
        }
        else{
            return (<div>Books are loading.</div>)
        }
    }

    render(){   
        return(
            <div>
                <div className='book-list'>
                    {this.showBooks()}
                </div>
                <BookDetails bookName= {this.state.selected}/>
            </div>
        )
    }
}

export default graphql(getBooksQuery) (BookList);