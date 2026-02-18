'use strict';

import mongoose from 'mongoose';

const categorySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Category name is required'],
            trim: true,
            maxLength: [100, 'Category name must be less than 100 characters'],
            unique: true,
        },
        description: {
            type: String,
            trim: true,
            maxLength: [500, 'Category description must be less than 500 characters'],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
);

categorySchema.index({ isActive: 1 });
categorySchema.index({ name: 1 });
categorySchema.index({ isActive: 1, name: 1 });

export default mongoose.model('Category', categorySchema);