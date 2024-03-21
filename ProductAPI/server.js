const express = require('express');
const app = express();

const port =3000;
const cartEndpoint = require("./routes/cart-route")
const productEndpoint = require("./routes/product-route")


app.use(express.json())

app.get('/api',(req,res)=>{
    res.send("Integrated Assignment 3. e-commerce app");
})
app.use('/api/products', productEndpoint )
app.use('/api/cart', cartEndpoint )
app.listen(port, ()=>console.log("Running in port"+port));