import supertest from 'supertest';

import { createRecommendationMusic } from '../factories/generateMusicRecommendation';
import { prisma } from '../../src/database'
import app from '../../src/app'

const server = supertest(app);

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
});

describe("Testa POST /", () => {
    it("Testa com body correto -> deve retornar 201", async () => {
        const recommendation = createRecommendationMusic();

        const result = await server.post("/recommendations").send(recommendation);

        expect(result.status).toBe(201);
    });

    it("Testa com link que não é do youtube -> deve retornar 422", async () => {
        const recommendation = createRecommendationMusic();
        recommendation.youtubeLink = "https://google.com";

        const result = await server.post("/recommendations").send(recommendation);
    
        expect(result.status).toBe(422);
    });

    it("Testa com name duplicado -> deve retornar 409", async () => {
        const recommendation = createRecommendationMusic();
    
        await server.post("/recommendations").send(recommendation);
        const result = await server.post("/recommendations").send(recommendation);
    
        expect(result.status).toBe(409);
    });
});

describe("Testa GET /", () => {
    it("Testa corretamente -> deve retornar um array as 10 últimas recomendações de música", async () => {
        const recommendation = createRecommendationMusic();

        await server.post("/recommendations").send(recommendation);
        const { body } = await server.get("/recommendations").send();

        expect(body).toBeInstanceOf(Array);
        expect(body[0].name).toBe(recommendation.name);
        expect(body[0].youtubeLink).toBe(recommendation.youtubeLink);
    });
});

describe("Testa GET /random", () => {
    it("Testa sem músicas cadastradas -> deve retornar 404", async () => {
        const result = await server.get("/recommendations/random").send();

        expect(result.status).toBe(404);
    });

    it("Testa com músicas cadastradas -> deve retornar um objeto de música", async () => {
        const recommendation = createRecommendationMusic();

        await server.post("/recommendations").send(recommendation);

        const result = await server.get("/recommendations/random").send();

        expect(result.body).toBeInstanceOf(Object);
    });

    it("Testa com músicas cadastradas -> deve retornar um objeto de música", async () => {
        const recommendation1 = createRecommendationMusic();
        const recommendation2 = createRecommendationMusic();
        const recommendation3 = createRecommendationMusic();

        await prisma.recommendation.createMany({
            data: [
                { ...recommendation1, score: 7 }, 
                { ...recommendation2, score: -1 }, 
                { ...recommendation3, score: 50 }
            ]
        })

        const { body } = await server.get("/recommendations/random").send();

        expect(body).toBeInstanceOf(Object);
    });
});

describe("Testa GET /top/amount", () => {
    it("Testa corretamente -> deve retornar um array", async () => {
        const recommendation = createRecommendationMusic();

        await server.post("/recommendations").send(recommendation);
        const result = await server.get("/recommendations/top/1").send();

        expect(result.body).toBeInstanceOf(Array);
    });
});

describe("Testa GET /:id", () => {
    it("Testa com música existente -> deve retornar um objeto com a música", async () => {
        const recommendation = createRecommendationMusic();

        await server.post("/recommendations").send(recommendation);
        const createdRecommendation = await prisma.recommendation.findFirst({
            where: { name: recommendation.name },
        });

        const result = await server
            .get(`/recommendations/${createdRecommendation?.id}`)
            .send();

        expect(result.body).not.toBeFalsy();
        expect(createdRecommendation?.name).toBe(recommendation.name);
    });

    it("Testa com id não cadastrado no banco -> deve retornar 404", async () => {
        const result = await server.get("/recommendations/1").send();

        expect(result.status).toBe(404);
    });
});

describe("Testa POST /:id/upvote", () => {
    it("Testa com id existente -> deve retornar 200", async () => {
        const recommendation = createRecommendationMusic();

        await server.post("/recommendations").send(recommendation);
        const createdRecommendation = await prisma.recommendation.findFirst({
            where: { name: recommendation.name },
        });

        const result = await server.post(
            `/recommendations/${createdRecommendation?.id}/upvote`
        );

        const votedRecomendation = await prisma.recommendation.findFirst({
            where: { name: recommendation.name },
        });

        expect(result.status).toBe(200);
        expect(votedRecomendation?.score).toBe(createdRecommendation?.score || 0  + 1);
    });

    it("Testa com id não castrado no banco -> deve retornar 404", async () => {
        const result = await server.post(`/recommendations/1/upvote`);

        expect(result.status).toBe(404);
    });
});

describe("Testa POST /:id/downvote", () => {
    it("Testa com id existente e não deve deletar recomendação -> deve retornar 200", async () => {
        const recommendation = createRecommendationMusic();

        await server.post("/recommendations").send(recommendation);
        const createdRecommendation = await prisma.recommendation.findFirst({
            where: { name: recommendation.name },
        });

        const result = await server.post(
            `/recommendations/${createdRecommendation?.id}/downvote`
        );

        const votedRecomendation = await prisma.recommendation.findFirst({
            where: { name: recommendation.name },
        });

        expect(result.status).toBe(200);
        expect(votedRecomendation?.score).toBe(createdRecommendation?.score || 0 - 1);
    });

    it("Testa com id não castrado no banco -> deve retornar 404", async () => {
        const result = await server.post(`/recommendations/1/downvote`);

        expect(result.status).toBe(404);
    });

    it("Testa com id existente e deve deletar recomendação -> deve retornar 200", async () => {
        const recommendation = createRecommendationMusic();

        await server.post("/recommendations").send(recommendation);
        const createdRecommendation = await prisma.recommendation.findFirst({
            where: { name: recommendation.name },
        });

        for (let i = 0; i < 5; i++) {
            await server
                .post(`/recommendations/${createdRecommendation?.id}/downvote`)
                .send();
        }

        const result = await server
            .post(`/recommendations/${createdRecommendation?.id}/downvote`)
            .send();

        const deletedRecommendation = await prisma.recommendation.findFirst({
            where: { name: recommendation.name },
        });

        expect(result.status).toBe(200);
        expect(deletedRecommendation).toBeFalsy();
    });
});

describe("Testa DELETE /e2eReset ", () => {
    it("Deve retornar 200", async () => {
        const result = await server.delete("/recommendations/e2eReset").send();

        expect(result.status).toBe(200);
    });
});

afterAll(async () => {
    await prisma.$disconnect();
});
