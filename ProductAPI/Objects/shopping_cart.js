"use strict";

class ShoppingCartException {
    constructor(errorMessage) {
        this.message = errorMessage;
        this.name="ShoppingCartException";
    }
}

//Only one constructor that saves uuid and quantity 
class ProductProxy {
    constructor(uuid, quantity) {
        this.uuid = uuid;
        this.quantity = quantity;
    }
}   

class ShoppingCart {
   
    constructor() {
        this._proxies = [];
        this._products = ProdList.products.slice();
    }
    get productProxies() {
        return this._proxies.slice();
    }
    set productProxies(value) { 
        throw new ShoppingCartException("Not permited change Proxies")
    }
    get products() { 
        return this._products.slice();
    }
    set products(value) {
        throw new ShoppingCartException("Not permited change values")
    }
    addItem(productUuid, amount) {
        if (amount < 0) throw new ShoppingCartException("Amount cannot be negative.");
        if(this._proxies.findIndex(obj => obj.uuid == productUuid)  >=0){
            this.updateItem(productUuid,amount)
        }else{
            let temp = new ProductProxy(productUuid,amount)
            this._proxies.push(temp);
        }

    }
    updateItem(productUuid, newAmount) {
        let num =this._proxies.findIndex(obj => obj.uuid == productUuid)
        if(   num>=0){
            if(newAmount>=0){
                if(newAmount==0){
                    this.removeItem(productUuid)
                }else{
                    this._proxies[num].quantity=newAmount;
                }
            }else{
                throw new ShoppingCartException("No negative numbers")
            }
        }else{
            throw new ShoppingCartException("No productUuid")
        }
    }
    removeItem(productUuid) {
        this._proxies = this._proxies.filter(proxy => proxy.uuid !== productUuid);

    }
    calculateTotal() {
        let count  = this._proxies.reduce((count,object)=>{
            //console.log((this.products.filter(obj => obj._uuid == object.uuid))[0].pricePerUnit)
            return count + (object.quantity  * (this.products.filter(obj => obj._uuid == object.uuid))[0].pricePerUnit)
        },0)
        return count
    }

    //this method is Optional, 
    //receives a function to render the shopping cart and its arguments
    toHtml(){ 

        let proxi = this.productProxies;
        let cart = this.products;
        let join= proxi.map(Item=>{
            let itemData = cart.find(data => data.uuid == Item.uuid)
            return  {
                quantity:Item.quantity,
                Name:itemData.name,
                pricePerUnit:itemData.pricePerUnit}
            
        })
        let total = this.calculateTotal();

        let html=`
            <div class="row mx-3 my-3">
                <div class="col-sm-12 col-md-6 col-lg-4">
                    <div class="media border p-3 ms-lg-3 ms-md-3  w-100" >
                        <div class="media-body">
                            <h4>Total purchase:</h4>`

                            join.forEach((arg)=>{
                                html+=`<p><b>${arg.Name}</b> ${arg.quantity} x ${arg.pricePerUnit} MX</p>`
                            })
                            
                            html+=`
                            <h5>Total: ${total+60}MXN</h5>

                            <div class="d-grid gap-2 px-5">
                                <a
                                    name="Pay"
                                    id=""
                                    class="btn btn-primary"
                                    role="button"
                                    >Pay</a
                                >

                            </div>

                            <div class="d-grid gap-2 px-5 py-3">
                                <button
                                    type="button"
                                    name="Pay"
                                    id=""
                                    class="btn btn-danger"
                                >
                                    Cancel
                                </button>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        `

        return html
    }
    static showShoppingCart(fnRender, args) {
        fnRender(args);
    }  
}
