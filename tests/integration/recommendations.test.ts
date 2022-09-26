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

afterAll(async () => {
    await prisma.$disconnect();
});
