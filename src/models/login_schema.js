const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { use } = require('passport')
const sgMail = require('@sendgrid/mail')
const api = process.env.SENDGRID_API_KEY
sgMail.setApiKey(api)
const passportLocalMongoose = require('passport-local-mongoose');
const nodemailer = require("nodemailer");
const Nexmo=require('nexmo')


const uri = process.env.MONGO_URL
mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true
})

const nexmo = new Nexmo({
    apiKey: "2d36f221",
    apiSecret: "eKbLC6Nwt8Efk8tJ"
})

const person_schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    Produce_type: {
        type: String,
        required: true
    },
    crop: {
        type: String,
        required: true
    },
    Produce_quantity: {
        type: Number,
        required: true
    },
    Phone: {
        type: Number,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    estimated_price: {
        type: Number,
        required: true
    },
    info: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        trim: true,
        required: true
        /*validate(value){
        if(value==phone)
        {   
            throw new Error("Password must not be same as phone number")
        }
        */
    },
    avatar: {
        type: Buffer,
        required: true
    },
    message: [
        {
            From: {
                type: String
            },
            Address: {
                type: String
            },
            State: {
                type: String
            },
            Quantity: {
                type: Number
            },
            Phone: {
                type: Number
            }
        }
    ],
    active: {
        type: Number
    }
})

person_schema.methods.toJSON = function () {
    const person = this

    const person_object = person.toObject()

    delete person_object.Password
    delete person_object.tokens
    return person_object;
}


person_schema.methods.generateAuthToken = async function () {
    const person = this
    const token = jwt.sign({ _id: person._id.toString() }, "indiaforfarmers")
    person.tokens = person.tokens.concat({
        token
    })
    await person.save()

    return token;
}


person_schema.statics.findByCredentials = async (Phone, password) => {
    const person = await Person.findOne({ Phone })
    if (!person) {
        throw new Error('Person doest not exists')
    }

    const isMatch = await bcrypt.compare(password, person.Password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return person
}

person_schema.statics.vieworder = async (id) => {
    const person = await Person.findById(id)
    if (person.active === 0) {
        throw new Error('Invalid entry')
    }
    return person.message
}

person_schema.statics.findByNumber = async (Phone) => {
    const person = await Person.findOne({ Phone });
    return person;
}

person_schema.statics.insertmsg = async (order, id) => {
    const user = await Person.findById(id)
    user.message.push(order)

    let transporter = nodemailer.createTransport({
        service:'gmail',
        auth: {
          user: process.env.EMAIL, // generated ethereal user
          pass: process.env.PASSWORD_EMAIL, // generated ethereal password
        },
      });
    
      // send mail with defined transport object

      const mailoptions={
        from: 'tiwaryabhinav125@gmail.com', // sender address
        to: user.email, // list of receivers
        subject: "Request Order", // Subject line
        text:`${order.From} from ${order.Address} ${order.State} has placed a order request of ${order.Quantity}kg`, // plain text body
      };

      transporter.sendMail(mailoptions,(error,info)=>{
          if(error)
          {
              console.log(error);
          }
          else
          {
              console.log(info.response)
          }
      });

    user.save()
}


person_schema.statics.changestatus = async (id) => {
    const user = await Person.findById(id)
    user.active = 0;
    user.save();
}


person_schema.statics.findByCrop = async (crop) => {
    const person = await Person.find({ Produce_type: crop })
    return person
}

person_schema.statics.getlasttoken = async (id) => {
    const user = await Person.findById(id)
    const last = user.tokens[user.tokens.length - 1]
    return last
}

person_schema.pre('save', async function (next) {
    try {
        const person = this
        person.Produce_type = person.Produce_type.toLowerCase()

        if (person.isModified('Password')) {
            person.Password = await bcrypt.hash(person.Password, 8)
        }

        next()
    } catch {
        throw new Error();
    }
})

person_schema.plugin(passportLocalMongoose);

const Person = mongoose.model('Person', person_schema)


module.exports = Person
