import express from "express"
import { ENV } from "./config/env.js"
import {db} from "./config/db.js"
import {favoritesTable } from "./db/schema.js"
import { eq, and } from "drizzle-orm";

const app = express()

const PORT = ENV 


app.use(express.json())

app.get("/api.health", (req,res) => {
    res.status(200).json({success:true})
})
console.log("test")
app.post("/api/favorites",async (req,res)=>{
    try{
        const {userId,recipeId,title,image,cookTime,servings} = req.body

        if(!userId || !recipeId || !title){
            return res.status(400).json({error:"Missing required fields"})
        }

       const newFaviroute =  await db.insert(favoritesTable).values({
            userId,
            recipeId,
            title,
            image,
            cookTime,
            servings

        }).returning()

        res.status(201).json(newFaviroute[0])

    }catch(error){
        console.log("Error adding favorites",error)
        res.status(500).json({error:"Somthing went wrong"})

    }
})

app.get("/api/favorites/:userId",async (req,res)=>{
    try{
        const {userId} = req.params

       const userFaviroute =  await db.select().from(favoritesTable).where(eq(favoritesTable.userId,userId))

        res.status(200).json(userFaviroute)

    }catch(error){
        console.log("Error Fetching favorites",error)
        res.status(500).json({error:"Somthing went wrong"})

    }
})


app.delete("/api/favorites/:userId/:recipeId",async (req,res)=>{
    try {
        const {userId,recipeId} = req.params

        console.log("userId",userId)

     await db.delete(favoritesTable).where(
        and(eq(favoritesTable.userId,userId),eq(favoritesTable.recipeId,parseInt(recipeId)))
       )

        res.status(200).json({message:"Favorite removed successfully"})

    }catch(error){
        console.log("Error Deleteing favorites",error)
        res.status(500).json({error:"Somthing went wrong"})

    }
})


app.listen(5001, ()=>{
    console.log("server is running on port:", PORT)
})