import { body, param } from 'express-validator';
import { checkValidators } from './checkValidators.js';
import { validateJWT } from './validate-JWT.js';
import { requireRole } from './validate-role.js';

export const validateCreateCategory = [
    validateJWT,
    requireRole('ADMIN_ROLE'),
    body('name')
        .trim()
        .notEmpty()
        .withMessage('The name is required')
        .isLength({ min: 3, max: 100 }),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('The description is required')
        .isLength({ min: 3, max: 255 }),
    checkValidators,
];

export const validateUpdateCategory = [
    validateJWT,
    requireRole('ADMIN_ROLE'),
    param('id')
        .isMongoId()
        .withMessage('Invalid category ID'),
    body('name')
        .optional()
        .trim()
        .notEmpty()
        .isLength({ min: 3, max: 100 })
        .withMessage('The name must be between 3 and 100 characters'),
    body('description')
        .optional()
        .trim()
        .notEmpty()
        .isLength({ min: 3, max: 255 })
        .withMessage('The description must be between 3 and 255 characters'),
    checkValidators,
]

export const validateCategoryStatusChange = [
    validateJWT,
    requireRole('ADMIN_ROLE'),
    param('id')
        .isMongoId()
        .withMessage('Invalid category ID'),
    body('isActive')
        .isBoolean()
        .withMessage('The isActive field must be a boolean value'),
    checkValidators,
]

export const validateGetCategoryById = [
    validateJWT,
    param('id')
        .isMongoId()
        .withMessage('Invalid category ID'),
    checkValidators,
]