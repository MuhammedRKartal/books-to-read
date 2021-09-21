import React, {Component} from 'react';

import {graphql} from 'react-apollo';
import {flowRight as compose} from 'lodash';
import { removeBookMutation } from '../queries/queries';
import BookList from './BookList';
import UserConsumer from './BookList';

class RemoveBook extends Component{
    
    constructor(props){
        super(props)
    }

    /*removeBook(){
        if(BookList.state.selected != null){
            
        }
    }*/

    render(){
        console.log("burada");
        
        return(
            /*<UserConsumer>
                {
                    value =>{
                        const selection = value;
                        
                    }
                }

            </UserConsumer>*/
            <p>a</p>
            
        )    
    }
}

export default RemoveBook;

