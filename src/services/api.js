import { api } from "@mentorias/auth";

// Serviços de domínio do app. O `api` do @mentorias/auth já envia o token e renova a sessão em 401.
export const dashboardService = {
	get: () => api.get("/admin/dashboard"),
};

// -- Usado pelos services novos (dashboardService.js, usersService.js) --

// Enquanto USE_MOCK = true, os services usam os dados de src/mocks.
// Troque para false quando o back-end estiver pronto.
export const USE_MOCK = true;

// Reexporta o cliente autenticado para os services importarem daqui.
// Atenção: é axios — parâmetros vão em { params } e a resposta vem em .data.
export { api };

// Simula a demora da rede no mock.
export const esperar = (ms = 400) => new Promise((r) => setTimeout(r, ms));
