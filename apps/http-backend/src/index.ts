import dotenv, { parse } from "dotenv";
import jwt  from "jsonwebtoken";
import express from "express";
import { middleware } from "./middleware";
import {CreateUserSchema,SigninSchema,CreateRoomSchema} from  "@repo/common/types";
import {prismaClient} from "@repo/db/client"
const app = express();
dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

app.use(express.json())
app.post("/signup", async (req, res) => {
  // zod validation
  const parsedData  = CreateUserSchema.safeParse(req.body);
  if(!parsedData.success){
     return res.json({
        message:"Incorrect inputs"
     })
  }

   //db call
   try{
    const user = await prismaClient.user.create({
     data: {
        email : parsedData.data.username,
        password : parsedData.data.password,
        name : parsedData.data.name
     }
   })
   res.json({
     userId : user.id
   })
}catch(e){
    res.status(411).json({
        message : "User already exists with this username. "
    })
}
});

app.get("/signin", async (req, res) => {

      const parsedData = SigninSchema.safeParse(req.body);
      if (!parsedData.success) {
        return res.json({
          message: "Incorrect inputs",
        });
      }
        const user = await prismaClient.user.findFirst({
         where: {
             email : parsedData.data.username,
             password : parsedData.data.password
         }
      })
      if(!user){
        res.status(403).json({
            message:"user not found"
        })
        return
      }
     if(!jwtSecret){
        throw new Error("JWT_SECRET environment variable is required");
     }
     const token = jwt.sign({
        userId:user?.id
     },jwtSecret)

     res.json({
        token
     })
});

app.get("/room",middleware , async (req, res) => {

     const parsedData = CreateRoomSchema.safeParse(req.body);
     if (!parsedData.success) {
       return res.json({
         message: "Incorrect inputs",
       });
     }
      //@ts-ignore
     const userId = req.userId;
    // db call
    try{
       const room = await prismaClient.room.create({
         data : {
            slug : parsedData.data.name,
            adminId : userId
         }
       })
    res.json({
        roomId: room.id
    })
} catch(e){
    res.status(411).json({
        message: "room already exists with this name."
    })
}
});

app.listen(3008, () => {
  console.log("listening on port 3008");
});
