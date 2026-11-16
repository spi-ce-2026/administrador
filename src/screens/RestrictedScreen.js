import { useAuth } from "@mentorias/auth";

import EmptyState from "../components/EmptyState";

export default function RestrictedScreen() {
	const { user, logout } = useAuth();

	return (
		<EmptyState
			icon="🔒"
			title="Acesso restrito"
			message={`A conta ${user?.email ?? ""} não tem o papel de administrador. Entre com outra conta.`}
			actionLabel="Sair"
			onAction={logout}
		/>
	);
}
