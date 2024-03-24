import {model, Schema} from 'mongoose';

export const ChatMessageSchema = new Schema(
    {
        role: {type: String, required: false,unique: false},
        userName: {type: String, required: true,unique: false},
        message: {type: String, required: true,unique: false},
        
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
        toObject : {
            virtuals: true,
        },
    }
);

export const ChatMessageModel = model('chatmessages', ChatMessageSchema);