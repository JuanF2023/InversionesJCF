// Archivo: modules/corporativo/infrastructure/http/routes/index.js
import { Router } from 'express';
import businessCategoriesRoutes from './businessCategories.routes.js';
import businessesRoutes from './businesses.routes.js';
import businessSummaryRoutes from './businessSummary.routes.js';
import businessTypesRoutes from './businessTypes.routes.js';
import usersRoutes from './users.routes.js';

const router = Router();

// Registrar todas las rutas del m¨®dulo corporativo
router.use('/business-categories', businessCategoriesRoutes);
router.use('/businesses', businessesRoutes);
router.use('/business-summary', businessSummaryRoutes);
router.use('/business-types', businessTypesRoutes);
router.use('/users', usersRoutes);

export default router;