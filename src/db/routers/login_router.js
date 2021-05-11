const express = require('express')
const router = new express.Router()
const Person = require('../../models/login_schema');
const multer = require('multer');
const sharp = require('sharp');
const session = require('express-session')
//const flash=require('express-flash')
const methodOverRide = require('method-override')
const passport = require('passport')
const initpassport = require('./auth')(passport)
const jwt = require('jsonwebtoken');
const { compare } = require('bcryptjs');
const { use } = require('passport');
const bcrypt = require('bcryptjs')

router.use(express.urlencoded({ extended: false }))
//router.use(flash)
router.use(session({
    secret: "forfarmers",
    resave: false,
    saveUninitialized: false
}))
router.use(passport.initialize());
router.use(passport.session());

router.use(methodOverRide('_method'))

router.get('/signup', async (req, res) => {
    res.render('register.ejs')
})

const upload = multer({
    limits: {
        fileSize: 5000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/)) {
            return cb(new Error("File should be in suitable format"))
        }

        cb(undefined, true)
    }
})

router.post('/signup', upload.single('avatar'), async (req, res) => {

    const person = new Person(req.body);
    try {
        const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
        person.avatar = buffer
        person.active=0;
        await person.save()
        res.render('index.ejs', {
            alert: 'success'
        });
    } catch (e) {
        console.log(e)
        res.render('index.ejs', {
            alert: 's-failed'
        })
    }
})


router.get('/login', async (req, res) => {
    res.render('index.ejs', {
        alert: ''
    })
})


router.post('/login', async (req, res) => {
        Person.findByCredentials(req.body.phone, req.body.password).then((person) => {
            person.active = 1;
            person.save()
            res.render('after_login.ejs', {
                person,
                data: person.avatar.toString('base64')
            })
        }).catch((e)=>{
            res.render('index.ejs', {
                alert: 'login-f'
            })
        })
})


router.post('/sendrequest', async (req, res) => {

    const order = {
        From: req.body.name,
        Address: req.body.address,
        State: req.body.state,
        Quantity: req.body.quantity,
        Phone:req.body.phone
    }

    //SEND MAIL CODE HERE
    Person.insertmsg(order, req.query.id)
    res.redirect('back')
})

router.get('/logout', async (req, res) => {

    Person.changestatus(req.query.id).then(() => {
        console.log("Sucessfully logout")
    }).catch((e) => {
        console.log(e)
    })
    req.session.destroy();

    res.redirect('/login')
})

router.get('/vieworder', async (req, res) => {

    try {
        Person.vieworder(req.query.id).then((list) => {
            res.render('vieworder.ejs', {
                list: list
            })
        }).catch((e) => {
            res.redirect('/login')
        })
    }
    catch {
        res.redirect('/login')
    }
})


router.get('/getkharif', async (req, res) => {
    Person.findByCrop('kharif').then((users) => {
        if (users.length == 0) {
            res.redirect('/login')
        }
        else {
            res.render('crops.ejs', {
                users: users
            })
        }
    })

})

router.get('/getrabi', async (req, res) => {
    Person.findByCrop('rabi').then((users) => {
        if (users.length == 0) {
            res.redirect('/login')
        }
        else {
            res.render('crops.ejs', {
                users: users
            })
        }
    })

})


router.get('/finduser', async (req, res) => {
    Person.findById(req.query.id).then((user) => {
        res.render('detailsofperson.ejs', {
            user: user
        })
    })
    /*res.render('detailsofperson.ejs',{
        user:user
    });
    */
})

router.get('/editprofile', async (req, res) => {
    try {
        const user = await Person.findById(req.query.id)
        if (user.active === 0) {
            throw new Error();
        }
        res.render('edit_profile.ejs', {
            user: user
        });
    }
    catch {
        res.redirect('/login')
    }
})

router.post('/updateprofile', async (req, res) => {
    try {
        const person = await Person.findById(req.query.id)
        if (person.active === 0) {
            throw new Error();
        }
        if (req.body.new_add) {
            person.address = req.body.new_add
        }
        if (req.body.new_price) {
            person.estimated_price = req.body.new_price
        }
        if (req.body.new_password) {
            person.Password = req.body.new_password
        }
        person.save()
        res.redirect('/login')
    }
    catch {
        console.log('error')
        res.redirect('/login')
    }
})

module.exports = router
