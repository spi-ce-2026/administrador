# UberHub Mentorias: app do administrador

App do administrador da plataforma UberHub Mentorias, em React Native (Expo SDK 57). Este repositório é o *starter*: o login e a navegação base estão prontos, e as telas de cada funcionalidade ficam para a equipe. O backend já está no ar; aqui só tem o app.

Pacote Android: `com.professorangoti.adminApp`. Os outros apps da plataforma são o [app do mentorado](https://github.com/spi-ce-2026/mentorado) e o [app do mentor](https://github.com/spi-ce-2026/mentor).

## O que já vem pronto

- Login com Google (Google Sign-In nativo → Firebase → `POST /auth/login`), sessão salva no AsyncStorage e restaurada ao abrir o app, e logout.
- Cliente HTTP (`api`) que envia o token em toda chamada e renova a sessão quando a API responde 401.
- Navegação base: Login, a tela "Acesso restrito" para quem não tem o papel `ADMIN` e as abas Início, Mentores, Vouchers, Usuários e Conta. As telas vazias indicam o caso de uso que entra em cada uma.
- Componentes `LoadingSpinner`, `EmptyState` e `ErrorDisplay`, e a tela Conta, com o usuário logado e o botão Sair.
- ESLint, Jest com React Native Testing Library, testes de exemplo e o CI no GitHub Actions.

A implementar: UC16 aprovar ou reprovar mentor, UC17 gerar vouchers, UC18 gerenciar vouchers, UC20 suspender ou reativar usuário, UC21 dashboard e UC22 tags. Os endpoints estão em [`docs/API.md`](docs/API.md), e os casos de uso e os mockups em [`docs/projeto`](docs/projeto).

## Pré-requisitos

- Node.js 20 ou mais recente.
- Android Studio com um emulador, ou um celular com depuração USB ativada.
- Uma conta Google de teste.

## Instalação

```bash
npm ci
cp .env.example .env                # preencha com os valores fornecidos pelo professor
npx expo prebuild -p android --clean
npx expo run:android
```

- O login Google não funciona no Expo Go. Use sempre `npx expo run:android`, que gera um *development build*.
- O app usa o backend de integração no Heroku, que já é o padrão do `app.config.js`. Só defina `EXPO_PUBLIC_API_BASE_URL` no `.env` se o professor indicar outro backend.
- O app precisa do `google-services.json`, que o professor fornece depois de registrar o pacote no Firebase. Coloque o arquivo na raiz do repositório.
- Só passa da tela "Acesso restrito" quem tem o papel `ADMIN`, que o professor atribui às contas da equipe.
- Depois de mudar o `.env`, reinicie o Metro limpando o cache: `npx expo start -c`.

## Usando o login nas telas

```js
import { useAuth } from "@mentorias/auth";

const { user, isAuthenticated, loading, login, logout } = useAuth();
```

| Campo | Conteúdo |
|---|---|
| `user` | Resposta de `GET /users/me`: `id`, `name`, `email`, `picture`, `role` (ex.: `"MENTEE,ADMIN"`) e `status` |
| `isAuthenticated` | `true` depois do login |
| `loading` | `true` enquanto o login está em andamento |
| `login()` | Abre o seletor de contas do Google e entra no backend |
| `logout()` | Sai do Google e do Firebase e apaga os tokens |

## Chamando a API

Coloque as chamadas em `src/services/api.js`, usando o `api` do pacote:

```js
import { api } from "@mentorias/auth";

export const tagService = {
	list: () => api.get("/tags"),
};
```

- O `api` já usa a URL do backend, o prefixo `/api/v1` e o token.
- Para mostrar um erro, use `showErrorAlert(error)` (exportado pelo pacote) ou o componente `ErrorDisplay`. Os dois leem o campo `error` da resposta.
- [`docs/API.md`](docs/API.md) lista os endpoints deste app, o formato dos erros e os comportamentos do backend que costumam travar quem escreve as telas.

## Estrutura

```
.
├── App.js            PaperProvider → AuthProvider → NavigationContainer → RootNavigator
├── app.config.js     configuração do Expo; lê o .env
├── src/
│   ├── components/   componentes reutilizáveis
│   ├── navigation/   RootNavigator: decide o que aparece com e sem login
│   ├── screens/      telas
│   ├── services/     chamadas à API
│   ├── theme.js      cor do app e nome exibido no login
│   └── __tests__/    testes
├── packages/auth/    pacote @mentorias/auth (login, sessão, cliente HTTP)
└── docs/             API.md e a especificação do projeto
```

`src/utils/roles.js` verifica se o usuário tem o papel `ADMIN`.

## O pacote `packages/auth`

É o mesmo pacote de login dos três apps, com uma cópia em cada repositório, ligada ao app por um npm workspace. Não o altere sem combinar com o professor: uma correção no login precisa ser aplicada nos três repositórios.

## Testes e lint

```bash
npm run lint                       # app
npm test                           # app
npm run lint -w @mentorias/auth    # pacote
npm test -w @mentorias/auth        # pacote
```

O CI roda os quatro em todo pull request, e o PR só entra com todos passando.

## Como contribuir

- Uma branch e um pull request por issue, a partir de `develop`, no formato `feature/<issue>-<descrição>`.
- Commits no padrão [Conventional Commits](https://www.conventionalcommits.org/), com o escopo `admin-app` (ex.: `feat(admin-app): tela de cadastro`).
- Cada PR é revisado por outra pessoa da equipe e só entra com o CI verde.
- O `.env` não vai para o Git; o `.env.example` lista as variáveis.

## Licença

Veja [LICENSE](LICENSE).
