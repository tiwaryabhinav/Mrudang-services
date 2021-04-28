const mongoose=require('mongoose')
const validator=require('validator')


mongoose.connect('mongodb://127.0.0.1:27017/Farmers',{
    useNewUrlParser:true,
    useCreateIndex:true
})

const products=mongoose.model('products',{
    name:{
        type:String,
        require:true,
        trim:true
    },
    state:{
        type:String,
        require:true
    },
    Produce_type:{
        type:String,
        require:true
    },
    Produce_quantity:{
        type:Number,
        require:true
    },
    Phone:{
        type:Number,
        require:true
    },
    email:{
        type:String,
        validate(value){
            if(!validator.isEmail(value))
            {
                console.log("invalid email")
                throw new Error('Email is invalid')
            }
        }
    },
    price:{
        type:Number,
        require:true
    }
})

module.exports=products