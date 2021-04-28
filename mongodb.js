const mongodb=require('mongodb')

const Mongoclient=mongodb.MongoClient
const ObjectID=mongodb.ObjectID

const connectionURL='mongodb://127.0.0.1:27017'
const databaseName ='Farmers'

Mongoclient.connect(connectionURL,{
    useNewUrlParser:true
},(error,client)=>{
    if(error)
    {
        console.log("Failed to connect to database")
        return;
    }

    const db=client.db(databaseName);


    //***   INSERTION OF DOCUMENTS   ***
    /*db.collection('Farmers').insertMany([
        {
        Name:'Hari Prasad',
        age:44
        },
        {
            Name:'Abhinav Tiwary',
        age:21,
        phone:8709279522
        }
    ],(error,result)=>{
        if(error)
        {
            console.log('Unable to connect')
        }

        console.log(result.ops);
    })
    */

    /*  //READING DOCUMENTS OF DATABASE
    db.collection('Farmers').find({age:44}).toArray((err,res)=>{
        console.log(res);
    })

    db.collection('Farmers').find({age:44}).count((err,res)=>{
        console.log(res);
    })
    */


    /*   UPDAION OF DOCUMENT
    const update=db.collection('Farmers').updateOne({
        _id:new ObjectID("60040ba8688dac058c7ca241")
    },{
        $set:{
            Name:"Harshvardhan"
        }
    })

    update.then((res)=>{
        console.log(res);
    }).catch((err)=>{
        console.log(err);
    })

    db.collection('Farmers').updateMany({
        Name:"Hari Prasad"
    },{
        $set:{
            phone:8709279522,
            place:"Sasaram"
        }
    }).then((res)=>{
        console.log(res);
    }).catch((err)=>{
        console.log(err);
    })

    */


    /*   DELETION OF DOCUMENT
    db.collection('Farmers').deleteMany({
        place:"Sasaram"
    }).then((res)=>{
        console.log(res)
    }).catch((err)=>{
        console.log(err)
    })

    */


   db.collection('Farmers').update({
        Name:"Harshvardhan"
    },{
        $unset:{
            age:""
        }
    })

})