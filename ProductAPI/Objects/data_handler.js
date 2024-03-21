let products = []

class ProdList {
    static products =[]
    //CRUD METHODS
    static addProduct(name, description, imageUrl, unit, stock, pricePerUnit, category){
        this.products.push(new Product(name, description, imageUrl, unit, stock, pricePerUnit, category));
    }
    static createProduct(product) {
        this.products.push(Product.createFromObject(product))
    }  
    static getProducts(){ return this.products}  
    static getProductById(uuid) {
        
        return this.products.filter(obj => {if(obj.uuid == uuid){ return obj}})
    } 
    static updateProduct(uuid, updatedProduct) {
        console.log(this.products)
        return this.products.map(obj => {if(obj.uuid!== uuid){ return obj}else{return updatedProduct}})
    }
    static deleteProduct(uuid) {
        this.products = this.products.filter(obj => {if(obj.uuid!== uuid){ return obj}})
    }



    static toHtmlTable(list){
        let html= `<table>
            ${list.map(product=>product.toHTML(Product.toHtmlRow)).join("")}
        </table>`
        return html
    }
    static getListToHTML(list,propOrder){
        
        let html =`<div class="Products row mt-4 mx-2">
        ${list.map(product=>product.toHTML(Product.toHtmlDiv,propOrder)).join("")}
        </div>`

        return html
    }
    
    //FILTER METHOD
    static filterProducts(query,intersection=true) {
        let conditions = {
            '>' : (a,b) => a>b,
            '<' : (a,b) => a<b,
            '>=' : (a,b) => a>=b,
            '<=' : (a,b) => a<=b,
            '==' : (a,b) => a==b,
            '!==' : (a,b) => a!=b,
            'contains': (a,b) => a.contains(b),
            'startsWith':(a,b) => a.startsWith(b),
            'endsWith':(a,b)=>a.endsWith(b),
            'includes':(a,b)=>a.includes(b)
        }
        let filter=this.products.slice();
        if(intersection == true){
            query.forEach(element => {
                filter = filter.filter(prod => {if(conditions[element.operator](prod[element.property],element.value)){return prod}})
            });
        }else{
            let matchedProducts = new Set();
            query.forEach(element => {
                filter.filter(prod => {
                    if (conditions[element.operator](prod[element.property], element.value)) {
                        matchedProducts.add(prod);
                    }
                });
            });
            filter = Array.from(matchedProducts)
        }
        return filter;
    } 
   
    // you don't need to modify this method, use it to test your code
    static log(list = this.products){ 
        console.table(list) 
    }   
}


// You don't need to modify this class, use it to render the products
// View.renderList() to render the list of products (show the products in a web page)
// View.renderTable() to render the table of products 
class View {
    static render(html, elementId){
        document.querySelector(`#${elementId}`).innerHTML = html;
    }
    static renderList(list = ProdList.products, elementId = "pList"){
        let html = ProdList.getListToHTML(list); //  implement ProdList.toHtmlList method
        this.render(html, elementId);
    }
    static renderTable(list = ProdList.products, elementId = "pTable"){
        let html = ProdList.toHtmlTable(list); //  implement ProdList.toHtmlTable method
        console.log(html)
        this.render(html, elementId);
    }
    static searchProduct(uuid, elementId = "pList"){
        let product = ProdList.getProductById(uuid); // implement ProdList.getProductById method
        View.renderList([product], elementId);
    }
}

ProdList.log();
//View.renderList(); // Render the list of products
//View.renderTable(); // Render the table of products
