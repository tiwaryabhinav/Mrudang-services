const localStrategy=require('passport-local').Strategy
const Person=require('../../models/login_schema')
const bcrypt=require('bcrypt')

function initpassport(passport){
    const authenticateUser=async (Phone,password,done)=>{
        Person.findByNumber(Phone).then((person)=>{
            console.log(person)
        })
        if(!person)
        {
            return done(null,false)
        }

        const isMatch=bcrypt.compare(password,person.Password)
        if(!isMatch)
        {
            return done(null,false)
        }
        else
        {
            console.log("match found")
            return done(null,person)
        }
    }

    passport.use(new localStrategy({usernameField:'phone'},
    authenticateUser))
    passport.serializeUser((user,done)=>{
        done(null,user._id)
    })

    passport.deserializeUser((id,done)=>{
        return done(null,Person.findById(id))
    })
}

module.exports=initpassport