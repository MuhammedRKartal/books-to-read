import React, {Component} from 'react';

import {graphql} from 'react-apollo';

import {getBooksQuery} from '../queries/queries';
import BookDetails from './BookDetails'


const UserContext = React.createContext();


export class BookList extends Component{
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
                <UserContext.Provider value={this.state}>
                    {this.props.children}
                </UserContext.Provider>
                <div className='book-list'>
                    {this.showBooks()}
                </div>
                <BookDetails bookName= {this.state.selected}/>
            </div>
            /*<div>
                
            </div>*/
        )
    }
}

const UserConsumer = UserContext.Consumer;

export default graphql(getBooksQuery) (BookList);