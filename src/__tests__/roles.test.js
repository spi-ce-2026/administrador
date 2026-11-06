import { hasRole } from "../utils/roles";

describe("hasRole", () => {
	it("reconhece o papel numa lista separada por vírgula", () => {
		expect(hasRole({ role: "MENTEE,ADMIN" }, "ADMIN")).toBe(true);
	});

	it("aceita o prefixo ROLE_", () => {
		expect(hasRole({ role: "ROLE_MENTEE, ROLE_ADMIN" }, "ADMIN")).toBe(true);
	});

	it("recusa quem não tem o papel", () => {
		expect(hasRole({ role: "MENTEE,MENTOR" }, "ADMIN")).toBe(false);
	});

	it("recusa usuário ausente ou sem role", () => {
		expect(hasRole(null, "ADMIN")).toBe(false);
		expect(hasRole({}, "ADMIN")).toBe(false);
	});
});
