import { cloudinary } from "./file-uploader.js";

export const destroyUploadedFiles = async (req) => {
    const files = req.files || (req.file ? [req.file] : []);

    for (const file of files) {
        const publicId = file.public_id || file.filename;
        if (publicId) {
            await cloudinary.uploader.destroy(publicId);
            console.log(`Archivo Cloudinary eliminado: ${publicId}`);
        }
    }
}

export const cleanUploaderFileOnFinish = (req, res, next) => {
    if (req.file || (req.files && req.files.length > 0)) {
        res.on('finish', async () => {
            try {
                if (res.statusCode >= 400) {
                    await destroyUploadedFiles(req);
                }
            } catch (error) {
                console.error(`Error al limpiar archivos: ${error.message}`);
            }
        });
    }
    next();
};

export const deleteFileOnError = async (err, req, res, next) => {
    try {
        if (req.file || (req.files && req.files.length > 0)) {
            await destroyUploadedFiles(req);
        }
    } catch (error) {
        console.error(`Error al eliminar archivos (error handler): ${error.message}`);
    }
    return next(err);
};