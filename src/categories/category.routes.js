import { Router } from 'express';
import { changeCategoryStatus, createCategory, getCategoryById, getCategories, updateCategory } from './category.controller.js';

import { validateCreateCategory, validateUpdateCategory, validateCategoryStatusChange, validateGetCategoryById } from '../../middlewares/category-validators.js';



const router = Router();

router.post(
    '/',
    validateCreateCategory,
    createCategory);

router.get('/', getCategories);

router.get(`/:id`,
    validateGetCategoryById,
    getCategoryById);

router.put(`/:id`,
    validateUpdateCategory,
    updateCategory);

router.patch(`/:id`,
    validateCategoryStatusChange,
    changeCategoryStatus);

export default router;

