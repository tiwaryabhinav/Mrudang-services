const mongoose=require('mongoose')

mongoose.set('useNewUrlParser', true); 
mongoose.set('useFindAndModify', false); 
mongoose.set('useCreateIndex', true); 
mongoose.set('useUnifiedTopology', true); 

const uri = process.env.MONGO_URL

mongoose.connect(uri,{
    useNewUrlParser:true,
    useCreateIndex:true
})
