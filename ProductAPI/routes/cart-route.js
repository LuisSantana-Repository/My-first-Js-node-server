const router = require("express").Router()
const cart = require('../data/cart.json')
const products = require('../data/products.json')
const midlewords = require("../middlewares/auth");
const { nanoid } = require("nanoid");
const fs = require('fs')
const { error, log } = require("console");





router.post('/',midlewords.hasUser,(req,res)=>{
    //console.log(req.body, res.locals.username);
    if(Array.isArray(req.body)){
        for (let index = 0; index < req.body.length; index++) {
            let element =  req.body[index];
            if(!products.find(u => u.uuid == element.uuid)){
                res.status(404).send({error:'uuid not found'});
                return
            }
            if(element.amount<=0){
                res.status(400).send({error:'amount lower than 0'});
                return
            }
            let temp =products.find(u => u.uuid == element.uuid)
            if(temp.stock-element.amount <0){
                res.status(400).send({error:'not enought stock'});
                return
            }
        }
        let tempList= cart.find(u => u.user = res.locals.username);
        if(tempList){
            tempList.cart = req.body
        }else{
            let tempItemm ={
                "user":res.locals.username,
                "cart":req.body.map(u=>{
                    return {
                        "uuid":u.uuid,
                        "amount": u.amount
                    }
                })
            }
            cart.push(tempItemm);
        }
        
        fs.writeFileSync(`./data/cart.json`,JSON.stringify(cart))
        res.send(tempList)
        return
    }else{
        res.status(400).send({error:'Not an array'});
        return
    }
})


router.get('/',midlewords.hasUser,(req,res)=>{
    let temp = cart.find(u => u.user == res.locals.username)
    if(!temp){
        res.status(400).send({error:'User not found'});
        return
    }
    let sum=0
    let help=temp.cart.map( u=>{

        let test2= products.find(product => { return product.uuid ==(u.uuid)});
        if(test2 && test2.stock >0){
            if(test2.stock< u.amount){
                u.amount=test2.stock;
            }
            sum += u.amount * test2.pricePerUnit;
            return {
                "uuid":u.uuid,
                "amount":u.amount,
                "product":{
                    "uuid":test2.uuid,
                    "imageUrl": test2.imageUrl,
                    "name": test2.name,
                    "description": test2.description,
                    "unit": test2.unit,
                    "category": test2.category,
                    "pricePerUnit": test2.pricePerUnit,
                }
            }
        }
    })
    help = help.filter(u => {return u!==undefined })
    if(temp ){
        res.send({
            "user":res.locals.username,
            "cart": help,
            "total":sum
        })

    }else{
        res.status(400).send('Not an user');
        return
    }
})
module.exports = router;