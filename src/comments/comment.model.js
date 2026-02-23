'use strict';

import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Content is required'],
        trim: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: [true, 'Post ID is required']
    },
    parentCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },
    author: {
        authId: {
            type: String,
            required: [true, 'Author ID of post is required'],
        },
        authorUsername: {
            type: String,
            required: [true, 'Author username of post is required'],
        }
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
}
);

commentSchema.index({ postId: 1 });
commentSchema.index({ parentCommentId: 1 });
commentSchema.index({ 'author.authId': 1 });
commentSchema.index({ 'author.authorUsername': 1 });

export default mongoose.model('Comment', commentSchema);