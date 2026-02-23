import { Router } from 'express';
import { createPost, getPosts, getPostById, updatePost, changePostStatus } from './post.controller.js';
import { uploadPostMedia } from '../../middlewares/file-uploader.js';
import { cleanUploaderFileOnFinish } from '../../middlewares/delete-file-on-error.js';
import { validateCreatePost, validateGetPostById, parseTagsMiddleware, validateUpdatePost, validateChangePostStatus } from '../../middlewares/posts-validators.js';



const router = Router();

router.post(
    '/',
    uploadPostMedia.array('media', 5),
    cleanUploaderFileOnFinish,
    parseTagsMiddleware,
    validateCreatePost,
    createPost);

router.get('/',
    getPosts);
router.get('/:id', 
    validateGetPostById,
     getPostById);

router.put('/:id',
    uploadPostMedia.array('media', 5),
    cleanUploaderFileOnFinish,
    parseTagsMiddleware,
    validateUpdatePost,
    updatePost);

router.patch('/:id',
    validateChangePostStatus,
    changePostStatus);

export default router;

