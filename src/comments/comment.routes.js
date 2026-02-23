import { Router } from "express";
import { validateGetCommentsByPost, validateCreateComment, validateUpdateComment, validateChangeCommentStatus } from "../../middlewares/comment-validator.js";
import { createComment, getCommentsByPost, updateComment, changeCommentStatus } from "./comment.controller.js";

const router = Router();

router.post('/', 
    validateCreateComment,  
    createComment);

router.get('/post/:postId', 
    validateGetCommentsByPost,
    getCommentsByPost);

router.put('/:commentId', 
    validateUpdateComment, 
    updateComment);

router.patch('/:commentId',
    validateChangeCommentStatus,
    changeCommentStatus);

export default router;