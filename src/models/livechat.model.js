import {model, Schema} from 'mongoose';

export const ChatMessageSchema = new Schema(
    {
        messageID:{type: String, required: true,unique: true},
        role: {type: String, required: false},
        userName: {type: String, required: true},
        message: {type: String, required: true},
        
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