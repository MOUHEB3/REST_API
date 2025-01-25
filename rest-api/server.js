const express = require('express');
const mongoose = require('mongoose');
const User= require('./model/user');
const dotenv=require("dotenv");
dotenv.config();
const app = express();
app.use(express.json());

async function connectToDataBase() {


    try{
        await mongoose.connect(process.env.MONGOOSE_URI);
        console.log("Connected to MongoDB");
}
    catch (error) {
    
    console.log("erreur:", error.message);
    }  
};

connectToDataBase();

    app.get('/user', async(req,res)=>{
    try{
        const user= await User.find();
        console.log(user)
        return res.status(200).send(user);
    }catch(error){
        console.log(error)
        return res.status(500).send(error);
    }
    });
    

    app.post('/user',async(req,res)=>{
    try{
        const { name,age,password}= req.body
        const newuser= new User({name,age,password});
        await newuser.save();
        return res.status(201).send({message:"utlisateur créé avec succés" , user:newuser});
    }catch(error){
        res.status(400).send({"error is": error})   
        }
    });

    app.put('/user/:id',async(req,res)=>{
    try{
        const userId=req.params.id;
        const updateData=req.body;
        const updateUser=await(User.findByIdAndUpdate(userId,updateData, {new:true}));

            if(!updateUser){
                res.status(404).send({message:"utilisateur non trouvé"});
            } else{
                res.status(200).send({message:"utilisateur mise a jour avec succés" ,user:updateUser});
        }


    }catch(error){
        res.status(400).send({"error is":error });
    }

    });

    app.delete('/user/:id',async(req,res)=>{
    try{
        const userId=req.params.id;
        const DeletUser=await User.findByIdAndDelete(userId);
        if(!DeletUser){
            res.status(404).send({"message":"utilisateur non trouvé"})
        } else{
            res.status(200).send({"utilisateur supprimé avec succés": DeleteUser});
        }

    }catch(error){
    res.status(400).send({"error is":error });
    }

    });
    app.listen(3000);