import React, { Component } from 'react';
import { storeProducts, detailProduct } from './data'; //I can import variables!! these will be set as state

//this is where I start using Context API, no need to import/install it, you automatically get it. We just need to create a new conte vxt object. We do that by creating a variable and using the createContext() method on React: 
const ProductContext = React.createContext();
//Context object comes with 2 components:
//Provider
//Consumer

class ProductProvider extends Component {

  state = {  //we grabbed data from data.js and set it as a state
    products: [],  //it is an empty array initially because if we would assign the storeProducts as the value, actual value of the storeProducts would change as we manipulate the app. This way and by using componentDidMount() we are able to use just copies of actual data, comming from setProducts() method below.
    detailProduct: detailProduct,
    cart: [],
    modalOpen: false,
    modalProduct: detailProduct,
    cartSubTotal: 0,
    cartTax: 0,
    cartTotal: 0
  }

  componentDidMount() {
    this.setProducts(); //this way we get copies of product objects, not actual references
  }

  setProducts = () => {
    let tempProducts = []; 
    storeProducts.forEach(item => {
      const singleItem = {...item}; // three dots ... mean that I am just copying the values 
      tempProducts = [...tempProducts, singleItem];
    });
    this.setState( () => {
      return {products: tempProducts}
    })
  }

  //utility method that gets the item according to id
  getItem = (id) => {
    const product = this.state.products.find(item => item.id === id);
    return product;
  }

  handleDetail = (id) => {
    const product = this.getItem(id);
    this.setState(() => {
      return {detailProduct: product}
    })
  }

  addToCart = (id) => {
    let tempProducts = [...this.state.products];
    const index = tempProducts.indexOf(this.getItem(id));
    const product = tempProducts[index];
    product.inCart = true;
    product.count = 1;
    const price = product.price;
    product.total = price;

    this.setState(() => {
      return { products: tempProducts, 
               cart: [...this.state.cart, product]
      }
    }, ()=> {
      this.addTotals();
    })

  }

  openModal = (id) => {
    const product = this.getItem(id);
    this.setState(() => {
      return {modalProduct: product, modalOpen: true}
    })
  }

  closeModal = () => {
    this.setState(() => {
      return {modalOpen: false}
    })
  }

  increment = (id) => {
    console.log('this is increment method')
  }

  decrement = (id) => {
    console.log('this is decrement method')
  }

  removeItem = (id) => {
    console.log('item removed')
  }

  clearCart = (id) => {   //arrow functions are used so taht we don't have to use constructor and bind these methods in the constructor
    console.log('cart cleared')
  }

  addTotals = () => {
    let subTotal = 0;
    this.state.cart.map(item => (subTotal += item.total));
    const tempTax = subTotal * 0.1;
    const tax = parseFloat(tempTax.toFixed(2));
    const total = subTotal + tax;
    this.setState(() => {
      return {
        cartSubTotal: subTotal,
        cartTax: tax,
        cartTotal: total
      }
    })
  }


  render() {
    return(
      //ProductContext.Provider is sitting on top of my component tree.
      //In order to get the data from ProductProvider I will use a function in PrioductList component to get whatever the value is
      <ProductContext.Provider value={{  //you can set objects as value and include any of their methods. You can than access these methods as well in other components
         ...this.state,   //another way:  products: this.state.products etc.
         handleDetail: this.handleDetail,
         addToCart: this.addToCart,
         openModal: this.openModal,
         closeModal: this.closeModal,
         increment: this.increment,
         decrement: this.decrement,
         removeItem: this.removeItem,
         clearCart: this.clearCart
        }}> 
        {this.props.children}
      </ProductContext.Provider>
    )
  }
}

const ProductConsumer = ProductContext.Consumer;

export {ProductProvider, ProductConsumer };