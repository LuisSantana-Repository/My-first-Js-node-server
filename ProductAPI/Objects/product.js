"use strict";

class ProductException {
    constructor(errorMessage) {
        this.message = errorMessage;
        this.name="ProductException";
    }
}


// This class focuses on creating/editing objects (it does not use any object lists at all)
class Product {

    // Constructor here
    constructor(name,description,image,unit,stock,price,category){
        this.name=name;
        this._uuid=generateUUID();
        this.description=description;
        this.imageUrl=image;
        this.unit=unit;
        this.stock=stock;
        this.pricePerUnit=price;
        this.Category=category;
    }








    // Returns the _uuid

    get uuid() { return this._uuid}

    // Throws an exception for attempting to set an id
    set uuid(arg) {
        throw new ProductException("Not permited to set ID")
    }

    // Getters and setters for each property: name, description, imageUrl, unit, stock, pricePerUnit, category
    // Remember to use underscores in variables: this._name, this._unit
    // Perform corresponding validations in the getters
        //seters
        set stock(arg){
            if(arg<0){
                throw new ProductException("Stock canot be negative");
                return;
            }
            this._stock=arg;
        }
        set pricePerUnit(arg){
            if(arg<0){
                throw new ProductException("price per Unit canot be negative");
                return;
            }
            this._pricePerUnit=arg;
        }
        set name(arg){
            if(!arg){
                throw new ProductException("Name canot be empty");
                return;
            }
            this._name=arg;
        }
        set description(arg){
            if(!arg){
                throw new ProductException("Description canot be empty");
                return;
            }
            this._description=arg;
        }
        set imageUrl(arg){
            if(!arg){
                throw new ProductException("imageUrl canot be empty");
                return;
            }
            this._imageUrl=arg;
        }
        set unit(arg){
            if(!arg){
                throw new ProductException("unit canot be empty");
                return;
            }
            this._unit=arg;
        }
        set Category(arg){
            if(!arg){
                throw new ProductException("Category canot be empty");
                return;
            }
            this._Category=arg;
        }
        
        //getters
        get name(){ return this._name}
        get description(){return this._description}
        get imageUrl(){return this._imageUrl}
        get unit(){return this._unit}
        get stock(){return this._stock}
        get pricePerUnit(){return this._pricePerUnit}
        get Category(){ return this._Category}
    
    
    // Removes all the properties that are not part of a product
    static cleanObject(obj) {
        let keys = ["_name","_uuid","_description","_imageUrl","_unit","_stock","_pricePerUnit","_Category"]
        //console.log(keys);
        for (let key in obj) {
            if(!keys.includes(key)){
                delete obj[key];
            }
        }
        return obj
    }
    
    // cleans the obj, tests if it has the required properties and returns a new Product
    static createFromObject(obj) {
        let keys = ["_name","_description","_imageUrl","_unit","_stock","_pricePerUnit","_Category"]
        let able = true
        for (let key in obj) {
            if(!keys.includes(key)){
                able=false
            }
        }
        if(able=true){
            if("_uuid" in obj){
                this.cleanObject(obj)
            }else{
                obj = new Product(obj._name,obj._description,obj._imageUrl,obj._unit,obj._stock,obj._pricePerUnit,obj._Category)
            }
            return obj
        }else{
            console.log("Not an Product")
        }
    } 
    
    // Returns the product in HTML format
    // default order is uuid, name, description, imageUrl, unit, stock, pricePerUnit, category
    static toHtmlRow(obj, propOrder = ["_name","_description","_imageUrl","_unit","_stock","_pricePerUnit","_Category"]) {
        let html='<tr>'
        if(propOrder ==undefined || propOrder.length==0){
            for (let key in obj) {
                if(key =="_imageUrl"){
                    html+=`<td><img src="${obj[key]}" alt="" style="width: 50px;"></td>`
                }else
                html+=`<td>${obj[key]}</td>`
            }
        }else{
            propOrder.forEach(element => {
                if(element =="_imageUrl"){
                    html+=`<td><img src="${obj[element]}" alt="" style="width: 50px;"></td>`
                }else
                html+=`<td>${obj[element]}</td>`
            });
        }
        html+='</tr>'

        return html
    } 
    // returns a html string similar to the first integrated assignment, but hide those properties in the array
    static toHtmlDiv(obj, hideProps=["_stock","_uuid"]) {
        let html=`
        <div class="col-lg-3 col-md-4 col-sm-6 mb-3">
            <div class="card h-100">`
            if(!hideProps.includes("imageUrl")){
                html+=`<img src="${obj.imageUrl}" class="card-img-top" alt="image">
                `

            }
            html+=`<div class="card-body">
            `
                for (let key in obj) {
                    if(!hideProps.includes(key) && key!="_imageUrl"){
                        html+=`<p class="card-text">${obj[key]}
                        </p>`
                    }
                }
                
                html+=`
                </div>
            </div>
        </div>`

        return html
    } 

    // Set a default function to convert a product to HTML 
    toHTML(fnToHtml = Product.toHtmlDiv,propOrder) {
        return fnToHtml(this,propOrder);
    } 
}



