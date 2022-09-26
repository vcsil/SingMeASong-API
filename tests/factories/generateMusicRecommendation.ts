import { faker } from '@faker-js/faker';
import { Recommendation } from '@prisma/client';

import { CreateRecommendationData } from '../../src/services/recommendationsService'


const randomLinks: any = {
    1: {
        "name": 'G.A - Contagem 💋 ft. Veigh, Jaya luuck, Danzo (clipe oficial)',
        "youtubeLink": 'https://youtu.be/wk8ITY76Xn0'
    },
    2: {
        "name": 'Diario De Um Detento Racionais Mcs (Clip Oficial)',
        "youtubeLink": 'https://youtu.be/er-bYI9-3hM'
    },
    3: {
        "name": 'BC Raff "Oficial de Justiça No Portão" [VIDEO CLIPE OFICIAL]',
        "youtubeLink":  'https://youtu.be/17HYcPw602c'
    },
    4: {
        "name": '03. Don L - Aquela Fé (feat. Nego Gallo)',
        "youtubeLink": 'https://youtu.be/ZYKJZBGIqnM'
    },
    5: {
        "name": 'Fazendinha Sessions #1 Ana Castela, Luan Pereira, Us Agroboy, Léo e Raphael',
        "youtubeLink": 'https://youtu.be/bLXDwBOJQWk'
    },
    6: {
        "name": 'Guilherme e Benuto feat @Hugo e Guilherme - Haja Colírio | DVD Deu Rolo',
        "youtubeLink": 'https://youtu.be/qjxNM9qF3LA'
    },
    7: {
        "name": 'Marília Mendonça - O Que Falta Em Você Sou Eu - Vídeo Oficial do DVD',
        "youtubeLink": 'https://youtu.be/CxKRaR6kFYs'
    },
    8: {
        "name": 'Milionário e José Rico - Decida - Jogo Do Amor - Tribunal Do Amor - Meu Martírio (ao vivo)',
        "youtubeLink": 'https://youtu.be/t8FLEIFIAfQ'
    },
    9: {
        "name": 'DENGO - João Gomes (Digo ou Não Digo)',
        "youtubeLink": 'https://youtu.be/mqYjyQG11GQ'
    },
    10: {
        "name": 'O POETA MÚSICA NOVA PULA CORNO - COM GRAVE', 
        "youtubeLink": 'https://youtu.be/iyvl6mnsUqQ'
    },
    11: {
        "name": 'Parangolé - Rebolation',
        "youtubeLink": 'https://youtu.be/X9P2d5lF2l4'
    },
    12: {
        "name": 'Praieiro | DVD Jammil De Todas As Praias',
        "youtubeLink": 'https://youtu.be/u_qdaqosDB0',
    },
    13: {
        "name": 'O Mundo é um moinho | Cartola',
        "youtubeLink": 'https://youtu.be/dB6mPGLj2J8'
    },
    14: {
        "name": 'Leia o Livro Universo em Desencanto',
        "youtubeLink": 'https://youtu.be/hBCUuSr-0Nk'
    },
    15: {
        "name": 'Originais do Samba - Tragédia no Fundo do Mar (O Assassinato do Camarão) Com o Mussum / 1975',
        "youtubeLink": 'https://youtu.be/rNxCVupr-jI'
    },
    16: {
        "name": 'Sujeito de Sorte - Belchior',
        "youtubeLink": 'https://youtu.be/oy5w9mWrzBg'
    },
    17: {
        "name": 'Raimundos - Quero ver o Oco',
        "youtubeLink": 'https://youtu.be/TQ7V5tbX-DM'
    },
    18: {
        "name": 'NX Zero - Razões E Emoções',
        "youtubeLink": 'https://youtu.be/rh_lqF8kBwc'
    },
    19: {
        "name": 'Charlie Brown Jr - Zoio De Lula',
        "youtubeLink": 'https://youtu.be/MjvrVEmSgqY'
    },
    20: {
        "name": 'Matanza - Clube dos Canalhas',
        "youtubeLink": 'https://youtu.be/YrAoTDttMNc'
    },
}

function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

export function createRecommendationMusic(): CreateRecommendationData {
    const idx = getRandomInt(1, 20);

    const { name, youtubeLink } = randomLinks[idx];

    return { name: name + ' ' + faker.datatype.number(999), youtubeLink}
}

export function createCompleteRecommendationMusic(): Recommendation {
    const { name, youtubeLink } = createRecommendationMusic();
    const completeRecommendation = {
        id: faker.datatype.number(),
        name,
        youtubeLink,
        score: faker.datatype.number(100)
    }

    return completeRecommendation;
}

