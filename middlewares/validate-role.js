'use strict';

/**
 * Middleware para validar que el usuario tenga un rol específico
 * Debe ejecutarse después de validateJWT
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
        error: 'UNAUTHORIZED',
      });
    }

    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Cannot access this resource',
        error: 'FORBIDDEN',
        requiredRole: allowedRoles,
        yourRole: userRole,
      });
    }

    next();
  };
};