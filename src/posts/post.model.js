'use strict';

import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title of post is required'],
        trim: true,
        maxLength: [150, 'Title of post must be less than 150 characters']
    },
    content: {
        type: String,
        required: [true, 'Content of post is required'],
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category of post is required']
    },
    mediaUrls: [{
        type: String,
        trim: true
    }],
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
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
        default: true,
    }
}, {
    timestamps: true,
    versionKey: false
});

postSchema.index({ category: 1 });
postSchema.index({ 'author.authId': 1 });
postSchema.index({ 'author.authorUsername': 1 });
postSchema.index({ tags: 1 });
postSchema.index({ isActive: 1 });

export default mongoose.model('Post', postSchema);