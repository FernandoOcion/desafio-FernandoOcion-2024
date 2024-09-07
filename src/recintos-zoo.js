class RecintosZoo {
	constructor() {
		this.recintos = [
			{
				numero: 1,
				bioma: "savana",
				tamanhoTotal: 10,
				animaisExistentes: [{ especie: "MACACO", quantidade: 3 }],
			},
			{ numero: 2, bioma: "floresta", tamanhoTotal: 5, animaisExistentes: [] },
			{
				numero: 3,
				bioma: "savana e rio",
				tamanhoTotal: 7,
				animaisExistentes: [{ especie: "GAZELA", quantidade: 1 }],
			},
			{ numero: 4, bioma: "rio", tamanhoTotal: 8, animaisExistentes: [] },
			{
				numero: 5,
				bioma: "savana",
				tamanhoTotal: 9,
				animaisExistentes: [{ especie: "LEAO", quantidade: 1 }],
			},
		];

		this.animais = {
			LEAO: { tamanho: 3, biomas: ["savana"], carnivoro: true },
			LEOPARDO: { tamanho: 2, biomas: ["savana"], carnivoro: true },
			CROCODILO: { tamanho: 3, biomas: ["rio"], carnivoro: true },
			MACACO: { tamanho: 1, biomas: ["savana", "floresta"], carnivoro: false },
			GAZELA: { tamanho: 2, biomas: ["savana"], carnivoro: false },
			HIPOPOTAMO: { tamanho: 4, biomas: ["savana", "rio"], carnivoro: false },
		};
	}

	analisaRecintos(animal, quantidade) {
		if (!this.animais[animal]) {
			return { erro: "Animal inválido" };
		}

		if (quantidade <= 0) {
			return { erro: "Quantidade inválida" };
		}

		const animalInfo = this.animais[animal];
		const recintosViaveis = [];

		for (const recinto of this.recintos) {
			const espacoOcupado = recinto.animaisExistentes.reduce(
				(acc, a) => acc + this.animais[a.especie].tamanho * a.quantidade,
				0,
			);
			const espacoLivre = recinto.tamanhoTotal - espacoOcupado;
			const especiesNoRecinto = new Set(
				recinto.animaisExistentes.map((a) => a.especie),
			);

			// Verificar bioma
			if (
				!animalInfo.biomas.includes(recinto.bioma.split(" e ")[0]) &&
				!animalInfo.biomas.includes(recinto.bioma.split(" e ")[1])
			) {
				continue;
			}

			// Regras específicas
			if (animalInfo.carnivoro && especiesNoRecinto.size > 0) {
				continue; // Carnívoros não podem misturar espécies
			}

			if (
				!animalInfo.carnivoro &&
				(especiesNoRecinto.has("LEAO") ||
					especiesNoRecinto.has("LEOPARDO") ||
					especiesNoRecinto.has("CROCODILO"))
			) {
				continue; // Não misturar com carnívoros
			}

			if (
				animal === "HIPOPOTAMO" &&
				recinto.bioma !== "savana e rio" &&
				especiesNoRecinto.size > 0
			) {
				continue; // Hipopótamo só aceita outras espécies no bioma correto
			}

			if (
				animal === "MACACO" &&
				quantidade === 1 &&
				espacoLivre >= animalInfo.tamanho &&
				especiesNoRecinto.size === 0
			) {
				continue; // Macaco não gosta de ficar sozinho
			}

			// Verificar espaço
			const espacoNecessario =
				(especiesNoRecinto.size > 0 ? 1 : 0) + animalInfo.tamanho * quantidade;

			if (espacoLivre >= espacoNecessario) {
				recintosViaveis.push(
					`Recinto ${recinto.numero} (espaço livre: ${espacoLivre - espacoNecessario} total: ${recinto.tamanhoTotal})`,
				);
			}
		}

		if (recintosViaveis.length === 0) {
			return { erro: "Não há recinto viável" };
		}

		return { recintosViaveis };
	}
}

export { RecintosZoo as RecintosZoo };
