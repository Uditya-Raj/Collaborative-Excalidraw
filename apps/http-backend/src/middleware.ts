import { NextFunction, Request, Response } from "express"
import  jwt  from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

 export function middleware(req:Request,res:Response,next:NextFunction){
    const token = req.headers['authorization']??"";
    
    if(!JWT_SECRET){
          throw new Error("JWT_SECRET environment variable is required");
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    if(decoded){
          //@ts-ignore
         req.userId = decoded.userId;
         next();
    }else{
        res.status(403).json({
            message:"Unauthorized"
        })
    }
    
    
 }

 