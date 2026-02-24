import Post from './post.model.js';

export const createPost = async (req, res) => {
    try {

        const { title, content, category, parsedTags } = req.body;
        const userId = req.user.authId;
        const username = req.user.authorUsername;

        const mediaUrls = req.files ? req.files.map(file => file.path) : [];

        const post = new Post({
            title: title,
            content: content,
            category: category,
            tags: parsedTags,
            mediaUrls: mediaUrls,
            author: {
                authId: userId,
                authorUsername: username
            }
        });

        await post.save();

        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            data: post
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating post',
            error: error.message
        });
    }
}

export const getPosts = async (req, res) => {
    try {
        const { page = 1, limit = 10, isActive = true } = req.query;
        const filter = { isActive };

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { createdAt: -1 }
        };

        const posts = await Post.find(filter)
            .populate('category', 'name')
            .limit(options.limit)
            .skip((options.page - 1) * options.limit)
            .sort(options.sort);

        const total = await Post.countDocuments(filter);

        res.status(200).json({
            success: true,
            message: 'Posts retrieved successfully',
            data: posts,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalRecords: total,
                limit
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving posts',
            error: error.message
        });
    }
}

export const getPostById = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId).populate('category', 'name');

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Post retrieved successfully',
            data: post
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving post',
            error: error.message
        });
    }
}

export const updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const { title, content, category, parsedTags } = req.body;
        const mediaUrls = req.files ? req.files.map(file => file.path) : [];

        const post = await Post.findById(postId);

        if (!post || !post.isActive) {
            return res.status(404).json({ success: false, message: 'Post not found or inactive' });
        }

        if (post.author.authId !== req.user.authId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied: You can only update your own posts'
            });
        }

        post.title = title || post.title;
        post.content = content || post.content;
        post.category = category || post.category;
        post.tags = parsedTags;

        if (mediaUrls.length > 0) {
            post.mediaUrls = post.mediaUrls.concat(mediaUrls);
        }
        await post.save();
        res.status(200).json({
            success: true,
            message: 'Post updated successfully',
            data: post
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating post',
            error: error.message
        });
    }
}

export const changePostStatus = async (req, res) => {
    try {
        const postId = req.params.id;
        const { isActive } = req.body;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        const isAuthor = post.author.authId === req.user.authId;
        const isAdmin = req.user.role === 'ADMIN_ROLE';

        if (!isAuthor && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Access denied: You can only change the status of your own posts'
            });
        }

        // Para activar tiene que ser si o si administrador
        if (isActive && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Access denied: Only administrators can activate posts'
            });
        }

        const responseMessage = isAuthor
            ? `Post ${isActive ? 'activated' : 'deactivated'} successfully`
            : `Post status updated by an administrator.`;

        post.isActive = isActive;
        await post.save();
        res.status(200).json({ success: true, message: responseMessage, data: post });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating post status', error: error.message });
    }
}