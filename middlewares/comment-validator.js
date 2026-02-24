import { body, param } from 'express-validator';
import { checkValidators } from './checkValidators.js';
import { validateJWT } from './validate-JWT.js';
import { requireRole } from './validate-role.js';

export const validateGetCommentsByPost = [
    validateJWT,
    requireRole('USER_ROLE', 'ADMIN_ROLE'),
    param('postId')
        .isMongoId()
        .withMessage('The post ID must be a valid MongoDB ID'),
    checkValidators
];

export const validateCreateComment = [
    validateJWT,
    requireRole('USER_ROLE', 'ADMIN_ROLE'),
    body('content')
        .isString()
        .withMessage('Content must be a string')
        .isLength({ min: 1 })
        .withMessage('Content cannot be empty'),
    body('postId')
        .isMongoId()
        .withMessage('The post ID must be a valid MongoDB ID'),
    body('parentCommentId')
        .optional()
        .isMongoId()
        .withMessage('The parent comment ID must be a valid MongoDB ID'),
    checkValidators
];

export const validateUpdateComment = [
    validateJWT,
    requireRole('USER_ROLE', 'ADMIN_ROLE'),
    param('commentId')
        .isMongoId()
        .withMessage('The comment ID must be a valid MongoDB ID'),
    body('content')
        .isString()
        .withMessage('Content must be a string')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Content cannot be empty'),
    checkValidators
];

export const validateChangeCommentStatus = [
    validateJWT,
    requireRole('USER_ROLE', 'ADMIN_ROLE'),
    param('commentId')
        .isMongoId()
        .withMessage('The comment ID must be a valid MongoDB ID'),
    body('isActive')
        .isBoolean()
        .withMessage('isActive must be a boolean value'),
    checkValidators
];