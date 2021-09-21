import React, {Component} from 'react';

import {graphql} from 'react-apollo';
import {flowRight as compose} from 'lodash';

import {getAuthorsQuery, addBookMutation, getBooksQuery} from '../queries/queries';

class AddBook extends Component{

    constructor(props){
        super(props)
        this.state={
            name:'',
            bType:'',
            authorID:''
        }
    }

    showAuthors(){
        
        var data = this.props.getAuthorsQuery;
        if(data.loading == false){
            return data.authors.map(author=>{
                return(
                    <option key={author.id} value={author.id}>
                        {author.name}
                    </option>
                );
            })
        }
        else{
            return (<option disabled>Yazarlar Yükleniyor</option>);
        }
    }

    sendForm(e){
        e.preventDefault();
        this.props.addBookMutation({
            variables:{
                name:this.state.name,
                bType:this.state.bType,
                authorID:this.state.authorID
            },
            refetchQueries:[{query:getBooksQuery}]
        });
        
    }

    render(){
        return(
            <form className="add-book" onSubmit={this.sendForm.bind(this)}>
                <div className='field'>
                    <label>Book Name:</label>
                    <input type='text' onChange={(e)=>this.setState({name:e.target.value})}/>
                </div>
                <div className='field'>
                    <label>Book Type:</label>
                    <input type='text'onChange={(e)=>this.setState({bType:e.target.value})}/>
                </div>
                <div className='field'>
                    <label>Author List:</label>
                    <select onChange={(e)=>this.setState({authorID:e.target.value})}>
                        <option>Select Author</option>
                        {this.showAuthors()}
                    </select>
                </div>
                <button>Add Book</button>
                
            </form>
        )
    }
}

//export default graphql(getAuthorsQuery) (AddBook)
export default compose(
    graphql(getAuthorsQuery,{name:"getAuthorsQuery"}),
    graphql(addBookMutation,{name:"addBookMutation"})
)(AddBook);