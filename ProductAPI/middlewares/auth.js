const router = require("express").Router()

function adminPrivileges(req,res,next){
    if(req.get('x-token') == 'admin2024'){
        res.locals.admin=true;
        next();
    }else{
        res.locals.admin=false;
        next();
    }
}
function adminNeeded(req,res,next){
    //console.log( req.get('x-token'));
    if(req.get('x-token') == 'admin2024'){
        res.locals.admin=true;
        next();
    }else{
        res.status(403).send({error:'Unauthorized access'});
    }
}
function hasUser(req,res,next){
    if(req.get('x-user')){
        res.locals.username=req.get('x-user');
        next();
    }else{
        res.status(401).send({error:'Not user'});
        return
    }
}
module.exports = {adminPrivileges, adminNeeded, hasUser}