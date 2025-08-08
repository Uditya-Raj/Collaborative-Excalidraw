import { WebSocketServer } from "ws";
import  jwt, { JwtPayload }  from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const jwtSecret = process.env.JWT_SECRET;
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws,request) {
     const url = request.url
     if(!url){
        return
     }
     const queryparams = new URLSearchParams(url.split('?')[1])
     const token = queryparams.get('token') || "";
     if(!jwtSecret){
        throw new Error("JWT_SECRET environment variable is required");
     }
     const decoded = jwt.verify(token,jwtSecret)
     if(!decoded || !(decoded as JwtPayload).userId){
        ws.close();
        return;
     }
  ws.on("message", function message(data) {
    console.log("received: %s", data);
    ws.send('pong');
  });

  
});