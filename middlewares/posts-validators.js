import { body, param } from 'express-validator';
import { checkValidators } from './checkValidators.js';
import { validateJWT } from './validate-JWT.js';
import { requireRole } from './validate-role.js';

export const validateCreatePost = [
    validateJWT,
    requireRole('USER_ROLE', 'ADMIN_ROLE'),
    body('title')
        .trim()
        .notEmpty()
        .withMessage('The title is required')
        .isLength({ min: 3, max: 150 })
        .withMessage('The title must be between 3 and 150 characters'),
    body('content')
        .trim()
        .notEmpty()
        .withMessage('The content is required'),
    body('category')
        .notEmpty()
        .withMessage('The category is required')
        .isMongoId()
        .withMessage('The category must be a valid MongoDB ID'),
    body('tags')
        .optional()
        .isString()
        .withMessage('The tags must be a string'),
    checkValidators,
];

export const validateGetPostById = [
    validateJWT,
    requireRole('USER_ROLE', 'ADMIN_ROLE'),
    param('id')
        .isMongoId()
        .withMessage('The post ID must be a valid MongoDB ID'),
    checkValidators
];

export const parseTagsMiddleware = (req, res, next) => {
    const { tags } = req.body;

    if (!tags) {
        req.body.parsedTags = [];
        return next();
    }

    if (Array.isArray(tags)) {
        req.body.parsedTags = tags;
        return next();
    }

    try {
        const parsed = JSON.parse(tags);
        if (Array.isArray(parsed)) {
            req.body.parsedTags = parsed;
            return next();
        }
    } catch (e) {
        req.body.parsedTags = tags.split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);
        return next();
    }

    req.body.parsedTags = [];
    next();
};

export const validateUpdatePost = [
    validateJWT,
    requireRole('USER_ROLE', 'ADMIN_ROLE'),
    param('id')
        .isMongoId()
        .withMessage('The post ID must be a valid MongoDB ID'),
    body('title')
        .optional()
        .trim()
        .notEmpty()
        .isLength({ min: 3, max: 150 })
        .withMessage('The title must be between 3 and 150 characters'),
    body('content')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('The content must not be empty'),
    body('category')
        .optional()
        .notEmpty()
        .withMessage('The category must not be empty')
        .isMongoId()
        .withMessage('The category must be a valid MongoDB ID'),
    body('tags')
        .optional()
        .isString()
        .withMessage('The tags must be a string'),
    checkValidators,
];

export const validateChangePostStatus = [
    validateJWT,
    requireRole('USER_ROLE', 'ADMIN_ROLE'),
    param('id')
        .isMongoId()
        .withMessage('The post ID must be a valid MongoDB ID'),
    body('isActive')
        .notEmpty()
        .withMessage('The status is required')
        .isBoolean()
        .withMessage('The status must be a boolean value')
        .toBoolean(),
    checkValidators,
];
        