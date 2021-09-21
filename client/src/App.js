import React, {Component} from 'react';
import ApolloClient from 'apollo-boost';
import {ApolloProvider} from 'react-apollo'; //clienti belirleyebilmek kodların uri adresini çağırmasını sağlamak

import BookList from './components/BookList';
import AddBook from './components/AddBook';


//apolloproviderin kullanacağı client
const client = new ApolloClient({
  uri:'http://localhost:4000/graphql'
})

class App extends Component {
  render(){
    return (
      <ApolloProvider client={client}>
        <div id="main">
          <h1>Books to Read</h1>
          <BookList/>
          <AddBook/>
        </div>
      </ApolloProvider>
    );
  } 
}

export default App;
