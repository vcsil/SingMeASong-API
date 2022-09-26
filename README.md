# <p align = "center"> Sing Me A Song </p>

<p align="center">
   <img src="https://notion-emojis.s3-us-west-2.amazonaws.com/prod/svg-twitter/1f399-fe0f.svg" width=180/>
</p>

## :clipboard: Descrição

Já pediu para alguém alguma recomendação de música? Chegou a hora de transformar isso em código. Nessa semana, você vai construir a rede Sing me a Song. Ou melhor, os testes desta rede!

Sing me a song é uma aplicação para recomendação anônima de músicas. Quanto mais as pessoas curtirem uma recomendação, maior a chance dela ser recomendada para outras pessoas 🙂

---

## :computer: Tecnologias e Conceitos

-   REST APIs
-   Node.js
-   JavaScript
-   TypeScript
-   PostgreSQL
-   React
-   Prisma
-   Jest
-   Cypress
-   Eslint & Prettier

---

## :rocket: Rotas

```yml
POST /recommendations
    - Rota para cadastrar uma nova recomendação
    - headers: {}
    - body: {
        "name": "Lorem ipsum",
        "youtubeLink": "https://www.youtube.com/watch?v=vik-PASUVuE"
        }
```

```yml
POST /recommendations/:id/upvote
    - Rota para dar upvote na recomendação
    - headers: {}
    - body: {}
```

```yml
POST /recommendations/:id/downvote
    - Rota para dar downvote na recomendação
    - headers: {}
    - body: {}
```

```yml
GET /recommendations
    - Rota para listar as 10 últimas recomendações
    - headers: {}
    - body: {}
```

```yml
GET /recommendations/:id
    - Rota para buscar uma recomendação pelo id
    - headers: {}
    - body: {}
```

```yml
GET /recommendations/random
    - Rota para buscar uma recomendação aleatória
    - headers: {}
    - body: {}
```

```yml
GET /recommendations/top/:amount
    - Rota para buscar as top X (:amount) músicas com maior número de upvotes, ordenadas por pontuação.
    - headers: {}
    - body: {}
```

---

## 🏁 Rodando a aplicação

Certifique-se que voce tem a ultima versão estável do [Node.js](https://nodejs.org/en/download/) e [npm](https://www.npmjs.com/) rodando localmente. Não se esqueça também de preencher corretamente o arquivo '.env'.

Primeiro, faça o clone desse repositório na sua maquina:

```
git clone https://github.com/vcsil/SingMeASong-API.git
```

Depois, rode o seguinte comando para instalar as dependencias.

```
npm install
```

Em seguida, configure o seu banco de dados com prisma.

```
npx prisma migrate dev
```

Finalizado o processo, é só inicializar o servidor

```
npm run dev (na pasta back-end)
```
