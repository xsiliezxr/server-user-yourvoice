import { parse } from 'dotenv';
import Category from './category.model'

export const createCategory = async (req, res) => {
    try {

        const categoryData = req.body;

        const category = new Category(categoryData);
        await category.save();

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: category

        });


    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating category',
            error: error.message
        });
    }
}

export const getCategories = async (req, res) => {
    try {
        const { page = 1, limit = 10, isActive = true } = req.query;
        const filter = { isActive };

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { createdAt: -1 }
        };

        const categories = await Category.paginate(filter, options);

        res.status(200).json({
            success: true,
            message: 'Categories retrieved successfully',
            data: categories
        });


    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving categories',
            error: error.message
        });
    }
}


export const getCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Category retrieved successfully',
            data: category
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving category',
            error: error.message
        });
    }
}

export const updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const updateData = req.body;
        const updatedCategory = await Category.findByIdAndUpdate(categoryId, updateData, { new: true, runValidators: true });

        if (!updatedCategory) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            data: updatedCategory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating category',
            error: error.message
        });
    }
}

export const changeCategoryStatus = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const { isActive } = req.body;

        const updatedCategory = await Category.findByIdAndUpdate(categoryId, { isActive }, { new: true });
        if (!updatedCategory) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Category status updated successfully',
            data: updatedCategory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating category status',
            error: error.message
        });
    }

}