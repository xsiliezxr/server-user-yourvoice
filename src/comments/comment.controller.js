import Comment from './comment.model.js';
import Post from '../posts/post.model.js';

export const createComment = async (req, res) => {
    try {

        const { content, postId, parentCommentId } = req.body;
        const userId = req.user.authId;
        const username = req.user.authorUsername;

        // Validar que la publicación exista
        const postExists = await Post.findById(postId);
        if (!postExists || !postExists.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Si es una respuesta a un comentario, validar que el comentario exista
        if (parentCommentId) {
            const parentCommentExists = await Comment.findById(parentCommentId);
            if (!parentCommentExists || !parentCommentExists.isActive) {
                return res.status(404).json({
                    success: false,
                    message: 'The comment you are trying to reply to does not exist'
                });
            }

            // Validar que el comentario a responder sea de la misma publicación
            if (parentCommentExists.postId.toString() !== postId) {
                return res.status(400).json({
                    success: false,
                    message: 'Parent comment does not belong to the specified post'
                });
            }
        }

        const newComment = new Comment({
            content,
            postId,
            parentCommentId: parentCommentId || null,
            author: {
                authId: userId,
                authorUsername: username
            }
        });

        await newComment.save();

        res.status(201).json({
            success: true,
            message: 'Comment created successfully',
            comment: newComment
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating comment',
            error: error.message
        });
    }
};

export const getCommentsByPost = async (req, res) => {
    try {

        const { postId } = req.params;

        const post = await Post.findById(postId);
        if (!post || !post.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        const comments = await Comment.find({ postId, isActive: true }).sort({ createdAt: 1 }).lean();

        // Armar la estructura de comentarios anidados
        const commentMap = {};
        const commentsTree = [];

        // Iniciar cada comentario con un array de respuestas vacío
        comments.forEach(comment => {
            comment.replies = [];
            commentMap[comment._id] = comment;
        });

        // Asignar cada comentario a su padre o a la raíz
        comments.forEach(comment => {
            if (comment.parentCommentId) {
                const parent = commentMap[comment.parentCommentId.toString()];
                if (parent) {
                    parent.replies.push(comment); // Lo metemos dentro de las respuestas de su padre
                }
            } else {
                commentsTree.push(comment); // Es un comentario principal, va directo a la raíz
            }
        });

        res.status(200).json({
            success: true,
            message: 'Comments fetched successfully',
            comments: commentsTree
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching comments',
            error: error.message
        });
    }
};

export const updateComment = async (req, res) => {
    try {

        const commentId = req.params.commentId;
        const { content } = req.body;

        const comment = await Comment.findById(commentId);

        if (!comment || !comment.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        // Validar que solo el autor pueda editarlo
        if (comment.author.authId.toString() !== req.user.authId) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to edit this comment'
            });
        }

        comment.content = content || comment.content;
        await comment.save();

        res.status(200).json({
            success: true,
            message: 'Comment updated successfully',
            comment
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating comment',
            error: error.message
        });
    }

};

export const changeCommentStatus = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const { isActive } = req.body;
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ success: false, message: 'Comment not found' });
        }

        const isAuthor = comment.author.authId === req.user.authId;
        const isAdmin = req.user.role === 'ADMIN_ROLE';

        if (!isAuthor && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Access denied: You can only change the status of your own comments'
            });
        }

        // Para activar tiene que ser si o si administrador
        if (isActive && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Access denied: Only administrators can activate comments'
            });
        }

        const responseMessage = isAuthor
            ? `Comment ${isActive ? 'activated' : 'deactivated'} successfully`
            : `Comment status updated by an administrator.`;

        comment.isActive = isActive;
        await comment.save();
        res.status(200).json({ success: true, message: responseMessage, data: comment });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating comment status', error: error.message });
    }
}