import { jest } from "@jest/globals";

import { createCompleteRecommendationMusic } from '../factories/generateMusicRecommendation';
import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import { recommendationService } from "../../src/services/recommendationsService";
import { prisma } from '../../src/database'

beforeEach(async () => {
    jest.resetAllMocks();
    await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
});

describe("Testa service Insert", () => {
    it("Não deve criar uma recommendation com name repetido", () => {
        const recommendation = createCompleteRecommendationMusic();

        jest.spyOn(
            recommendationRepository,
            "findByName"
        ).mockImplementationOnce((): any => recommendation);

        const promise = recommendationService.insert(recommendation);

        expect(promise).rejects.toEqual({
            type: "conflict",
            message: "Recommendations names must be unique",
        });
    });

    it("Deve criar recommendation (name válido)", async () => {
        const recommendation = createCompleteRecommendationMusic();

        jest.spyOn(
            recommendationRepository,
            "findByName"
        ).mockImplementationOnce((): any => {
            return null;
        });

        jest.spyOn(recommendationRepository, "create").mockImplementationOnce(
            (): any => {}
        );

        await recommendationService.insert(recommendation);

        expect(recommendationRepository.create).toBeCalled();
    });
});

afterAll(async () => {
    await prisma.$disconnect();
  });