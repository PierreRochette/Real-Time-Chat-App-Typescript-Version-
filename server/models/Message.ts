import mongoose, { Document, Schema } from "mongoose";

interface IMessage extends Document {
    room: string;
    author: string;
    message: string;
    time: string; 
}

const MessageSchema: Schema = new Schema({
    room: String, 
    author: String, 
    message: String, 
    time: String, 
}); 

export const Message = mongoose.model<IMessage>('Message', MessageSchema); 