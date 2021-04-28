const jwt=require('jsonwebtoken')
const Person=require('../models/login_schema')


const auth=async (req,res,next)=>{
    try{
        console.log(req.header('Authorization'))
        const token=req.header('Authorization').replace('Bearer ','')
        const decoded=jwt.verify(token,"indiaforfarmers")
        const person=await Person.findOne({_id:decoded._id,'tokens.token':token})
        if(!person)
        {
            throw new Error()
        }
        req.token=token
        req.person=person
        next()
    }catch(e){
        res.status(401).send({error:"Please authenticate"})
    }
}

module.exports=auth