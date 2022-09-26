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

describe("Testa service upvote", () => {
    it("Testa com id inválido", () => {
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce(
            (): any => {
                return null;
            }
        );

        jest.spyOn(recommendationRepository,"updateScore").mockResolvedValueOnce(
            {
                id: 1,
                name: 'não passa',
                youtubeLink: 'https://www.youtube.com',
                score: 10
            }
        );

        const promise = recommendationService.upvote(1);

        expect(recommendationRepository.updateScore).not.toBeCalled();
        expect(promise).rejects.toEqual({
            type: "not_found",
            message: "",
        });
    });

    it("Testa com id válido", async () => {
        const recommendation = createCompleteRecommendationMusic();

        jest.spyOn(recommendationRepository, "find").mockImplementationOnce(
            (): any => {
                return recommendation;
            }
        );

        jest.spyOn(recommendationRepository,"updateScore").mockResolvedValueOnce(recommendation);

        await recommendationService.upvote(recommendation.id);

        expect(recommendationRepository.updateScore).toBeCalled();
    });
});

afterAll(async () => {
    await prisma.$disconnect();
  });