const mongoose=require('mongoose')

mongoose.set('useNewUrlParser', true); 
mongoose.set('useFindAndModify', false); 
mongoose.set('useCreateIndex', true); 
mongoose.set('useUnifiedTopology', true); 

const uri = "mongodb+srv://Farmersdb:88884444665@cluster0.yr5ix.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(uri,{
    useNewUrlParser:true,
    useCreateIndex:true
})
