const express=require('express')
const router=new express.Router()
const Producer=require('../../models/customer_schema')

/*
router.post('/users',async (req,res)=>{
    console.log(req.body)
    const producer=new Producer(req.body);

    try{
        await producer.save()
        res.status(201).send(producer)
    } catch(e){
        res.status(400).send(e)
    }


    /*producer.save().then(()=>{
        console.log(producer._id);
        res.send(producer);
    }).catch((err)=>{
        console.log(err);
    })
})

*/


router.get('/users', async (req,res)=>{

    try{
        const all_farmers=await Producer.find({})
        res.send(all_farmers)
    } catch(e){
        res.status(500).send(e);      
    }




    /*Producer.find({}).then((result)=>{
        res.send(result)
    }).catch((err)=>{
        res.send(err);
    })*/
})


/*
router.get('/users/:id',async (req,res)=>{

    try{
        const farmer=await Producer.findById(req.params.id)

        if(!farmer)
        {
            res.status(404).send();
        }
        res.send(farmer)
    }catch(e){
        res.status(500).send();
    }


    /*
    Producer.findById(req.params.id).then((result)=>{
        res.send(result)
    }).catch((err)=>{
        res.status(404).send()
    })
})
*/


/*
router.patch('/users/:id',async (req,res)=>{

    const updates=Object.keys(req.body)
    const allowedUpdates=["name"];

    const valid=updates.every((update)=>{
        return allowedUpdates.includes(update)
    })

    if(!valid)
    {
        res.status(400).send({
            "error":"Invalid access"
        })
    }


    try{
        //const farmer=await Producer.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        const farmer=await Producer.findById(req.params.id)

        updates.forEach((update)=>{
            farmer[update]=req.body[update]
        })

        if(!farmer)
        {
            res.status(404).send()
        }


        await farmer.save()
        res.send(farmer)
    }catch(e){
        res.status(400).send(e);
    }
})



router.delete('/users/:id',async (req,res)=>{
    try{
        const farmer=await Producer.findByIdAndDelete(req.params.id)

        if(!farmer)
        {
            res.status(404).send()
        }
        res.send(farmer)
    }catch(e){
        res.status(500).send(e)
    }
})
*/

module.exports=router
