const mongoose=require('mongoose')
const validator=require('validator')


mongoose.connect('mongodb://127.0.0.1:27017/Farmers',{
    useNewUrlParser:true,
    useCreateIndex:true
})


const producer_schema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    state:{
        type:String,
        required:true
    },
    Produce_type:{
        type:String,
        required:true
    },
    Produce_quantity:{
        type:Number,
        required:true
    },
    Phone:{
        type:Number,
        required:true
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
    estimated_price:{
        type:Number,
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }
})

producer_schema.pre('save',function(next){
    const producer=this

    next()
})


const Producer=mongoose.model('Producer',producer_schema)
module.exports=Producer