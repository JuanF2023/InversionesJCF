// client/src/services/api/monthlyProduction.api.js
import { apiGet } from "@/features/corporativo/access/api/api.js";

// Tu backend expone: /api/monthly-production/total
export const getMonthlyProduction = () =>
  apiGet("/monthly-production/total");

