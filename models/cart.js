const fs = require('fs');
const path = require('path');

const p = path.join(path.dirname(require.main.filename), 'data', 'cart.json');

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // Fetch the previous cart
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };

      if (err) {
        console.log('Error reading file:', err);
      } else {
        // Log file content for debugging
        console.log('File content:', fileContent.toString());

        if (fileContent.length > 0) {
          try {
            cart = JSON.parse(fileContent);
          } catch (parseError) {
            console.log('Error parsing JSON:', parseError);
          }
        } else {
          console.log('Cart file is empty, initializing new cart.');
        }
      }

      // Ensure cart.products is always an array
      if (!cart.products) {
        cart.products = [];
      }

      // Analyze the cart => Find existing product
      const existingProductIndex = cart.products.findIndex(
        prod => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;

      // Add new product/ increase quantity
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }

      cart.totalPrice = cart.totalPrice + +productPrice;

      // Save the updated cart back to file
      fs.writeFile(p, JSON.stringify(cart), err => {
        if (err) {
          console.log('Error writing to cart.json:', err);
        }
      });
    });
  }
};
