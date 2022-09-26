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

        console.log(body)

        expect(body).toBeInstanceOf(Object);
    });
});

afterAll(async () => {
    await prisma.$disconnect();
});