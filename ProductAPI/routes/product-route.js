const router = require("express").Router()
const products = require('../data/products.json')
const midlewords = require("../middlewares/auth");
const { nanoid } = require("nanoid");
const fs = require('fs')
const { error } = require("console");



router.get('/', midlewords.adminPrivileges ,(req,res)=>{
    let filtered = products.slice()
    
    let {uuid,imageUrl,name,description,unit,category,max,min} = req.query;
    //console.log(uuid,imageUrl,name,description,unit,category,max,min)
    if(uuid && res.locals.admin==true){
        filtered = filtered.filter(u=> u.uuid.includes(uuid))
    }
    
    if(imageUrl){
        filtered = filtered.filter(u=> u.imageUrl.includes(imageUrl))
    }
    if(category){
        filtered = filtered.filter(u=> u.category.toUpperCase().includes(category.toUpperCase()))
    }

    if(description){
        filtered = filtered.filter(u=> u.description.toUpperCase().includes(description.toUpperCase()))
    }
    if(name){
        filtered = filtered.filter(u=> u.name.toUpperCase().includes(name.toUpperCase()))
    }


    if(unit){
        filtered = filtered.filter(u=> u.unit.toUpperCase().includes(unit.toUpperCase()))
    }
    if(max){
        filtered = filtered.filter(u=> u.pricePerUnit<=max)
    }
    if(min){
        filtered = filtered.filter(u=> u.pricePerUnit>=min)
    }
    

    if(res.locals.admin==true){
        res.send(
            filtered
        );
    }else{
        res.send(
            filtered.map(producto=>{
                return {
                    "imageUrl": producto.imageUrl,
                    "name": producto.name,
                    "description": producto.description,
                    "unit": producto.unit,
                    "category": producto.category,
                    "pricePerUnit": producto.pricePerUnit,
                }
            }
            )
        );
    }
    
})


router.get('/:id',midlewords.adminPrivileges,(req,res)=>{
    //console.log(req.params.id);
    let product =products.find((u)=> u.uuid == req.params.id);
    if(!product){
        res.status(404).send({error:"ID not found"});
    }else{
        if(res.locals.admin==true){
            res.send(
                product
            );
        }else{
            res.send(
                    {
                        "imageUrl": product.imageUrl,
                        "name": product.name,
                        "description": product.description,
                        "unit": product.unit,
                        "category": product.category,
                        "pricePerUnit": product.pricePerUnit,
                    }
            );
        }
    }
    
})

router.post(`/`,midlewords.adminNeeded,(req,res)=>{
    
    let {imageUrl,name,description,unit,category,pricePerUnit,stock} = req.body
    console.log(imageUrl,name,description,unit,category,pricePerUnit,stock)
    if(imageUrl&&name&&description&&unit&&category&&!Number.isNaN(pricePerUnit)&&!Number.isNaN(stock)){
        if(name.trim() && imageUrl.trim() && description.trim() && unit.trim() && pricePerUnit>=0&& stock>=0&& category.trim()){
        let product = products.find(u=>u.name == name)
        if(product){
            res.status(400).send({error:"product already exist"})
            return
        }
        let productObj = {imageUrl,name,description,unit,category,pricePerUnit,stock,uuid: nanoid()}
        products.push(productObj)
        res.send(productObj)
        fs.writeFileSync(`./data/products.json`,JSON.stringify(products))
        return
        }
        res.status(400).send({error:"Information not correct"})
        return
    }else{
        res.status(400).send({error:"Information missing"})
        return
    }
    
})
router.put(`/:id`,midlewords.adminNeeded,(req,res)=>{
    let product = products.find((u)=>u.uuid == req.params.id)
    if(!product){
        res.status(404).send({error:"Products not found"})
        return
    }
    let {imageUrl,name,description,unit,category,pricePerUnit,stock} = req.body
    if(!name || !imageUrl || !description || !unit || !category || !(Number.isInteger(pricePerUnit) && pricePerUnit>=0) || !(Number.isInteger(stock) && stock>=0)){
        res.status(400).send({error:"Missing Parameters"})
        return
    }
    if(name.trim() && imageUrl.trim() && description.trim() &&unit.trim()&&category.trim()){
        let temp =products.find(u=>u.name.toUpperCase() == name.toUpperCase()) 
        if(( temp && temp.uuid != req.params.id)){
            res.status(400).send({error:"Name Already Exist"})
            return
        }
            product.name=name;
            product.imageUrl=imageUrl
            product.description=description
            product.unit=unit
            product.category=category
            product.pricePerUnit=pricePerUnit
            product.stock=stock
        fs.writeFileSync(`./data/products.json`,JSON.stringify(products))
        res.send(product)
        return
    }else{
        res.status(400).send({error:"Bad Parameters"})
        return
    }
})

router.delete('/:id',midlewords.adminNeeded,(req,res)=>{
    let product = products.findIndex(u => u.uuid == req.params.id)
    //console.log(product)
    if(product == -1){
        res.status(404).send({error:"product not found"})
        return
    }
    let del = products.splice(product,1)
    fs.writeFileSync(`./data/products.json`,JSON.stringify(products))
    res.send(del);
    return
})

module.exports = router;