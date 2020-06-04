        //Storage Controller
const StorageController = (function () {

return {
    storageProduct:function(product){
        let products;
        if(localStorage.getItem('products')===null){
            products=[];
            products.push(product);
        }else{
            products=JSON.parse(localStorage.getItem('products'));
            products.push(product);
        }


        localStorage.setItem('products',JSON.stringify(products));
    },
    getProductsLS:function(){
        let products;
        if(localStorage.getItem('products')===null){
            products=[];
        }
        else{
         products=JSON.parse(localStorage.getItem('products'));
        }
        return products;
    }
}

})()




//Product Controller
const ProductController = (function () {

    //Private
    const Product = function (id, name, price) {
        this.id = id,
            this.name = name,
            this.price = price
    }

    const data = {
       
        // products: [
        //     // { id: 0, name: 'Monitor', price: 100 },
        //     // { id: 1, name: 'TV', price: 400 },
        //     // { id: 2, name: 'Noutbook', price: 1800 },
        //     // { id: 3, name: 'Printer', price: 250 }
        // ],

        products:StorageController.getProductsLS(),
        selectedProduct: null,
        totalPrice: 0
    }

    //Public
    return {
        getProducts: function () {
            return data.products;
        },
        getData: function () {
            return data;
        },
        getProductById: function (id) {
            let product = null;
            data.products.forEach(function (prd) {
                if (prd.id == id) {
                    product = prd
                }
            });
            return product;
        },

        addProduct: function (name, price) {
            let id;
            if (data.products.length > 0) {
                id = data.products[data.products.length - 1].id + 1;
            } else {
                id = 0;
            }
            const newProduct = new Product(id, name, parseFloat(price));
            data.products.push(newProduct);
            return newProduct;
        },
        deleteProductItem: function (product) {

            data.products.forEach(function (prd, index) {
                if (prd.id == product.id) {
                    data.products.splice(index, 1)
                }
            })

        },
        updateProduct: function (name, price) {
            let product = null;
            data.products.forEach(function (prd) {
                if (prd.id == data.selectedProduct.id) {
                    prd.name = name;
                    prd.price = parseFloat(price);
                    product = prd;
                }
            });
            return product;
        },
        getTotal: function () {
            let total = 0;
            data.products.forEach(function (item) {
                total += item.price;
            })
            data.totalPrice = total;
            return data.totalPrice;
        },
        setCurrentProduct: function (product) {
            data.selectedProduct = product;
        },
        getCurrentProduct: function () {
            return data.selectedProduct;
        }
    }


})()




// UI Controller
const UIController = (function () {

    const Selectors = {
        productList: "#item-list",
        productListItems: "#item-list tr",
        addButton: "#addBtn",
        editButton: "#btnEdit",
        deleteButton: "#deleteBtn",
        cancelButton: "#cancelBtn",
        productName: "#productName",
        productPrice: "#productPrice",
        productCard: "#productCard",
        total_azn: "#total-azn",
        total_dollar: "#total-dollar",
    }

    return {
        createProductList: function (products) {
            let output = '';
            products.forEach(prd => {
                output += `
               
               <tr>
               <td>${prd.id + 1}</td>
               <td>${prd.name}</td>
               <td>${prd.price}$</td>
               <td class="text-right">                  
                       <i class="far fa-edit editProduct" ></i>               
               </td>
           </tr>
               `
            });

            document.querySelector('#item-list').innerHTML += output;
        },
        getSelectors: function () {
            return Selectors;
        },
        addProduct: function (prd) {
            document.querySelector(Selectors.productCard).style.display = 'block'
            let item = `

            <tr>
            <td>${prd.id + 1}</td>
            <td>${prd.name}</td>
            <td>${prd.price}$</td>
            <td class="text-right">
            <i class="far fa-edit editProduct" ></i>   
            </td>
        </tr>
                        `
            document.querySelector(Selectors.productList).innerHTML += item;
        },
        updateProductInUI: function (prd) {
            let updatedItem = null;
            let items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(function (item) {
                if (item.classList.contains('bg-warning')) {
                    item.children[1].textContent = prd.name;
                    item.children[2].textContent = prd.price;
                    updatedItem = item;
                }
            })

            return updatedItem;
        },
        deleteProductItem: function () {
            let items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(function (item) {
                if (item.classList.contains('bg-warning')) {
                    item.remove();
                }
            })
        },
        clearInputs: function () {
            document.querySelector(Selectors.productName).value = '';
            document.querySelector(Selectors.productPrice).value = '';
        },
        clearWarnings: function () {
            const items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(function (item) {
                if (item.classList.contains('bg-warning')) {
                    item.classList.remove('bg-warning');
                }
            });
        },
        hidecard: function () {
            document.querySelector(Selectors.productCard).style.display = 'none';
        },
        showTotal: function (total) {

            let azn = document.querySelector(Selectors.total_azn).textContent = total * 1.7;
            azn.toFixed(4);
            document.querySelector(Selectors.total_dollar).textContent = total;
        },
        addProductToForm: function () {
            const selected = ProductController.getCurrentProduct();
            document.querySelector(Selectors.productName).value = selected.name;
            document.querySelector(Selectors.productPrice).value = selected.price;
        },

        addState: function (item) {
            UIController.clearWarnings();
            UIController.clearInputs();
            document.querySelector(Selectors.addButton).style.display = 'inline';
            document.querySelector(Selectors.editButton).style.display = 'none';
            document.querySelector(Selectors.deleteButton).style.display = 'none';
            document.querySelector(Selectors.cancelButton).style.display = 'none';
        },
        editState: function (tr) {
            // const parent = tr.parentNode;
            // for (let i = 0; i < parent.children.length; i++) {
            //     parent.children[i].classList.remove('bg-warning');
            // }
            tr.classList.add('bg-warning');
            document.querySelector(Selectors.addButton).style.display = 'none';
            document.querySelector(Selectors.editButton).style.display = 'inline';
            document.querySelector(Selectors.deleteButton).style.display = 'inline';
            document.querySelector(Selectors.cancelButton).style.display = 'inline';
        }

    }

})()


//App Controller
const AppController = (function (ProductCtrl, UICtrl,StorageCtrl) {
    const UISelectors = UIController.getSelectors();

    //Load Event Listeners

    const loadEventListener = function () {
        //Add product event
        document.querySelector(UISelectors.addButton).addEventListener('click', productAddSubmit);
        //Edit Product
        document.querySelector(UISelectors.productList).addEventListener('click', productEditClick);
        //Update Product
        document.querySelector(UISelectors.editButton).addEventListener('click', productUpdate);

        //Cancel Update
        document.querySelector(UISelectors.cancelButton).addEventListener('click', cancelUpdate);

        //Delete product
        document.querySelector(UISelectors.deleteButton).addEventListener('click', deleteProduct);
    }

    const productAddSubmit = function (e) {

        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        if (productName !== '' && productPrice !== '') {
            //Add product
            const newProduct = ProductCtrl.addProduct(productName, productPrice)
            //Add item to list
            UICtrl.addProduct(newProduct)

            //Add produc to Local storage
            StorageCtrl.storageProduct(newProduct)
            //get total
            const total = ProductCtrl.getTotal();
            console.log(total)
            //Show Total
            UICtrl.showTotal(total);
            //clear inputs
            UICtrl.clearInputs();
        }
        e.preventDefault();
    }

    const productEditClick = function (e) {
        if (e.target.classList.contains('editProduct')) {
            const id = e.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent - 1;

            //Gel selected product
            const product = ProductCtrl.getProductById(id);

            //Set current Product
            ProductCtrl.setCurrentProduct(product);

            //Add selected product to UI
            UICtrl.addProductToForm();
            //UI clear warnings
            UICtrl.clearWarnings();
            //Edit state
            UICtrl.editState(e.target.parentNode.parentNode);
        }

        e.preventDefault();
    }

    const productUpdate = function (e) {
        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;
        if (productName !== '' && productPrice !== '') {
            //product update
            const updatedProduct = ProductCtrl.updateProduct(productName, productPrice);

            //Product update in UI
            let item = UICtrl.updateProductInUI(updatedProduct);

            const total = ProductCtrl.getTotal();

            UICtrl.showTotal(total)

            UICtrl.addState();
        }

        e.preventDefault();
    }
    const cancelUpdate = function (e) {

        UICtrl.addState();
        UICtrl.clearWarnings();
        e.preventDefault();
    }
    const deleteProduct = function (e) {
        const selectedProduct = ProductCtrl.getCurrentProduct();

        ProductCtrl.deleteProductItem(selectedProduct);

        UICtrl.deleteProductItem();

        const total = ProductCtrl.getTotal();

        UICtrl.showTotal(total)

        UICtrl.addState();

        if(total===0){
            UICtrl.hidecard();
        }
        e.preventDefault();
    }
    return {
        init: function () {
            UICtrl.addState();
            const products = ProductCtrl.getProducts();
            UICtrl.createProductList(products);

            if (products.length == 0) {
                UICtrl.hidecard();
            }
            else {
                UICtrl.createProductList(products);
            }
            loadEventListener();
        }
    }

})(ProductController, UIController,StorageController)

AppController.init()

