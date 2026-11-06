import { api } from "@mentorias/auth";

// Serviços de domínio do app. O `api` do @mentorias/auth já envia o token e renova a sessão em 401.
export const dashboardService = {
	get: () => api.get("/admin/dashboard"),
};
