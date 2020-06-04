import React, { Component } from 'react';
import { storeProducts, detailProduct } from './data'; //I can import variables!! these will be set as state

//this is where I start using Context API, no need to import/install it, you automatically get it. We just need to create a new context object. We do that by creating a variable and using the createContext() method on React: 
const ProductContext = React.createContext();
//Context object comes with 2 components:
//Provider
//Consumer

class ProductProvider extends Component {

  state = {  //we grabbed data from data.js and set it as a state
    products: storeProducts,
    detailProduct: detailProduct
  }

  handleDetail = () => {
    console.log("Hello from detail page");
  }

  addToCard = () => {
    console.log("Hello from add to cart");
  }

  render() {
    return(
      //ProductContext.Provider is sitting on top of my component tree.
      //In order to get the data from ProductProvider I will use a function in PrioductList component to get whatever the value is
      <ProductContext.Provider value={{  //you can set objects as value and include any of their methods. You can than access these methods as well in other components
         ...this.state,   //another way:  products: this.state.products etc.
         handleDetail: this.handleDetail,
         addToCard: this.addToCard
      }}> 
        {this.props.children}
      </ProductContext.Provider>
    )
  }
}

const ProductConsumer = ProductContext.Consumer;

export {ProductProvider, ProductConsumer };