const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const { use } = require('passport')
const sgMail=require('@sendgrid/mail')
const api='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'
sgMail.setApiKey(api)
const passportLocalMongoose = require('passport-local-mongoose');

const uri = "mongodb+srv://Farmersdb:88884444665@cluster0.yr5ix.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(uri,{
    useNewUrlParser:true,
    useCreateIndex:true
})

const person_schema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    age:{
        type:Number,
        required:true,
        validate(value){
            if(value<=12)
            {
                throw new Error('Age must be greater than 12 years')
            }
        }
    },
    address:{
        type:String,
        required:true
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
        unique:true,
        required:true
    },
    email:{
        type:String,
        validate(value){
            if(!validator.isEmail(value))
            {
                throw new Error('Email is invalid')
            }
        }
    },
    estimated_price:{
        type:Number,
        required:true
    },
    info:{
        type:String,
        required:true
    },
    Password:{
        type:String,
        required:true,
        trim:true
        /*validate(value){
        if(value==phone)
        {   
            throw new Error("Password must not be same as phone number")
        }
        */
    },
    avatar:{
        type:Buffer
    },
    crop_pic:{
        type:Buffer
    },
    message:[
        {
            From:{
                type:String
        },
        Address:{
            type:String
        },
        State:{
            type:String
        },
        Quantity:{
            type:Number
        },
        Phone:{
            type:Number
        }
        }
    ],
    active:{
        type:Number
    }
})

person_schema.methods.toJSON=function(){
    const person=this

    const person_object=person.toObject()

    delete person_object.Password
    delete person_object.tokens
    return person_object;
}


person_schema.methods.generateAuthToken=async function(){
    const person=this
    const token=jwt.sign({_id:person._id.toString()},"indiaforfarmers")
    person.tokens=person.tokens.concat({
        token
    })
    await person.save()

    return token;
}


person_schema.statics.findByCredentials=async (Phone,password)=>{
    const person=await Person.findOne({Phone})
    if(!person)
    {
        throw new Error('Person doest not exists')
    }

    const isMatch=await bcrypt.compare(password,person.Password)

    if(!isMatch)
    {
        throw new Error('Unable to login')
    }

    return person
}

person_schema.statics.vieworder=async (id)=>{
    const person=await Person.findById(id)
    if(person.active===0)
    {
        throw new Error('Invalid entry')
    }
    return person.message
}

person_schema.statics.findByNumber=async (Phone)=>{
    const person=await Person.findOne({Phone});
    return person;
}

person_schema.statics.insertmsg=async (order,id)=>{
    const user=await Person.findById(id)
    user.message.push(order)
    sgMail.send({
        to:user.email,
        from:'tiwaryabhinav125@gmail.com',
        subject:'New Order Request',
        text:`${order.From} from ${order.Address} ${order.State} has placed a order request of ${order.Quantity}kg`
    }).then(()=>{
        console.log("send");
    }).catch(()=>{
        console.log("Failed")
    })
    user.save()
}


person_schema.statics.changestatus=async (id)=>{
    const user=await Person.findById(id)
    user.active=0;
    user.save();
}


person_schema.statics.findByCrop=async (crop)=>{
    const person=await Person.find({Produce_type:crop})
    return person
}

person_schema.statics.getlasttoken=async (id)=>{
    const user=await Person.findById(id)
    const last=user.tokens[user.tokens.length-1]
    return last
}

person_schema.pre('save',async function(next){
    const person=this

    person.Produce_type=person.Produce_type.toLowerCase()

    if(person.isModified('Password')){
        person.Password=await bcrypt.hash(person.Password,8)
    }

    next()
})

person_schema.plugin(passportLocalMongoose);

const Person=mongoose.model('Person',person_schema)


module.exports=Person
