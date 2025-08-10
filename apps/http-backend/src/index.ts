import dotenv from "dotenv";
import jwt  from "jsonwebtoken";
import express from "express";
import { middleware } from "./middleware";
import {CreateUserSchema,SigninSchema,CreateRoomSchema} from  "@repo/common/types";
import {prismaClient} from "@repo/db/client"
const app = express();
dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

app.get("/signup", (req, res) => {
  // zod validation
  const data  = CreateUserSchema.safeParse(req.body);
  if(!data.success){
     return res.json({
        message:"Incorrect inputs"
     })
  }
   //db call
   res.json({
     userId : "123"
   })
});

app.get("/signin", (req, res) => {

      const data = SigninSchema.safeParse(req.body);
      if (!data.success) {
        return res.json({
          message: "Incorrect inputs",
        });
      }
     const userId = 1;
     if(!jwtSecret){
        throw new Error("JWT_SECRET environment variable is required");
     }
     const token = jwt.sign({
        userId:userId
     },jwtSecret)

     res.json({
        token
     })
});

app.get("/room",middleware ,(req, res) => {

     const data = CreateRoomSchema  .safeParse(req.body);
     if (!data.success) {
       return res.json({
         message: "Incorrect inputs",
       });
     }
    // db call

    res.json({
        roomId: 123
    })
});

app.listen(3008, () => {
  console.log("listening on port 3000");
});
