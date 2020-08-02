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
    let tempCart = [...this.state.cart];
    let selectedProduct = tempCart.find(item => item.id === id);
    const index = tempCart.indexOf(selectedProduct);
    const product = tempCart[index];
    product.count = product.count + 1;
    product.total = product.count * product.price

    this.setState(
      () => {
        return {
          cart: [...tempCart]
        }
      },
      ()=> {
        this.addTotals(); //add totals is called in a callback function so that it is run exactly when the totals values are changed, not before, not after.
      }
    );
  };

  decrement = (id) => {
    let tempCart = [...this.state.cart];
    let selectedProduct = tempCart.find(item => item.id === id);
    const index = tempCart.indexOf(selectedProduct);
    const product = tempCart[index];

    product.count = product.count - 1;

    if(product.count === 0) {
      this.removeItem(id)
    } else {
      product.total = product.count * product.price;
      this.setState(
        () => {
          return {
            cart: [...tempCart]
          }
        },
        ()=> {
          this.addTotals(); //add totals is called in a callback function so that it is run exactly when the totals values are changed, not before, not after.
        }
      );
    }
  }

  removeItem = (id) => {
    let tempProducts = [...this.state.products];
    let tempCart = [...this.state.cart];
    tempCart = tempCart.filter(item => item.id !== id);
    const index = tempProducts.indexOf(this.getItem(id)); //this gives us the index of the actual product that we want to remove.
    let removedProduct = tempProducts[index];
    //we also need to change a few properties of the removedProduct back to their default values:
    removedProduct.inCart = false;
    removedProduct.count = 0;
    removedProduct.total = 0;

    this.setState(() => {
      return {
        cart: [...tempCart],
        products: [...tempProducts] //removedProduct got its properties changed back to default, so it will not be included in the cart (inCart changed to false etc.)
      }
    }, () => {
      this.addTotals();
    })
  }

  clearCart = (id) => {   //arrow functions are used so taht we don't have to use constructor and bind these methods in the constructor
    this.setState(() => {
      return { cart: [] }
    },() => {
      this.setProducts(); //because all the products that have been added to the cart have been actually modified(their props/values are modified, for example, inCart is changed to true, and we need to change it back to false), we need to call the setProducts() method to change them back to their default state
      this.addTotals();
    })
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