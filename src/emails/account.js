const sgMail=require('@sendgrid/mail')

const api='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'

sgMail.setApiKey(api)


sgMail.send({
    to:'btech10125.18@bitmesra.ac.in',
    from:'tiwaryabhinav125@gmail.com',
    subject:'Farmers project',
    text:'it happens'
}).then(()=>{
    console.log("send");
}).catch(()=>{
    console.log("Failed")
})
