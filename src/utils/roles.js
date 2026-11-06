// O campo role de GET /users/me guarda os papéis separados por vírgula, com ou sem o prefixo ROLE_ (ex.: "MENTEE,ADMIN").
export function hasRole(user, role) {
	if (!user?.role) return false;
	return user.role
		.split(",")
		.map(r => r.trim().replace(/^ROLE_/, ""))
		.includes(role);
}
