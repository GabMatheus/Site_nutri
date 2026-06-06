// Banco de dados dos alimentos (carregado do JSON)
let dadosAlimentos = [];

// Elementos da interface
const campoBusca = document.getElementById('campoBusca');
const blocoResultados = document.getElementById('blocoResultados');

// Placeholders dinâmicos no campo de busca
const frasesPlaceholder = [
    "Digite o nome de um alimento...",
    "Ex: Arroz, integral, cozido",
    "Ex: Feijão, carioca, cozido",
    "Ex: Macarrão, espaguete"
];
let indexPlaceholder = 0;

// Troca o placeholder a cada 3 segundos
setInterval(() => {
    if (campoBusca) {
        campoBusca.placeholder = frasesPlaceholder[indexPlaceholder];
        indexPlaceholder = (indexPlaceholder + 1) % frasesPlaceholder.length;
    }
}, 3000);

// Carrega os alimentos do arquivo JSON
fetch('TACO.json')
    .then((resposta) => resposta.json())
    .then((dadosCarregados) => {
        dadosAlimentos = dadosCarregados;
    })
    .catch((erro) => {
        console.error('Erro ao carregar a lista de alimentos:', erro);
    });

let temporizadorLimpeza = null;

// Monitora o que o usuário digita no campo de busca
campoBusca.addEventListener('input', function () {
    const textoBuscado = this.value.toLowerCase().trim();
    clearTimeout(temporizadorLimpeza);

    if (textoBuscado.length === 0) {
        limparResultadosDaTela();
        return;
    }

    // Filtra os alimentos que contenham o texto digitado
    const resultadosFiltrados = [];
    for (let i = 0; i < dadosAlimentos.length; i++) {
        const item = dadosAlimentos[i];
        if (item.description.toLowerCase().includes(textoBuscado)) {
            resultadosFiltrados.push(item);
        }
    }

    if (resultadosFiltrados.length > 0) {
        mostrarResultadosNaTela(resultadosFiltrados);
    } else {
        limparResultadosDaTela();
        if (blocoResultados) {
            blocoResultados.innerHTML = '<p class="mensagem-sem-resultado">Nenhum alimento encontrado com esse nome.</p>';
        }
    }

    // Se o usuário ficar 15 segundos sem digitar, limpa os resultados
    temporizadorLimpeza = setTimeout(() => {
        limparResultadosDaTela();
        if (campoBusca) campoBusca.value = '';
    }, 15000);
});

// Exibe os cards dos alimentos na tela (máximo 10 resultados)
function mostrarResultadosNaTela(listaDeAlimentos) {
    if (!blocoResultados) return;
    blocoResultados.innerHTML = '';

    const limite = Math.min(listaDeAlimentos.length, 10);

    for (let i = 0; i < limite; i++) {
        const alimento = listaDeAlimentos[i];
        const card = document.createElement('div');
        card.classList.add('food-info');

        const categoria = alimento.category || 'Geral';
        const proteinas = alimento.protein_g ? alimento.protein_g.toFixed(1) : '0';
        const carboidratos = alimento.carbohydrate_g ? alimento.carbohydrate_g.toFixed(1) : '0';
        const gorduras = alimento.lipid_g ? alimento.lipid_g.toFixed(1) : '0';
        const calorias = alimento.energy_kcal ? alimento.energy_kcal.toFixed(0) : '0';

        card.innerHTML = `
            <h3>${alimento.description}</h3>
            <p><strong>Categoria:</strong> ${categoria}</p>
            <p><strong>Proteínas:</strong> ${proteinas}g</p>
            <p><strong>Carboidratos:</strong> ${carboidratos}g</p>
            <p><strong>Lipídios:</strong> ${gorduras}g</p>
            <p><strong>Calorias:</strong> ${calorias} kcal</p>
        `;
        blocoResultados.appendChild(card);
    }
}

// Limpa a área de resultados
function limparResultadosDaTela() {
    if (blocoResultados) {
        blocoResultados.innerHTML = '';
    }
}

// Menu mobile: abrir e fechar
const botaoMenuMobile = document.getElementById('botaoMenuMobile');
const menuPrincipal = document.getElementById('menuPrincipal');

if (botaoMenuMobile && menuPrincipal) {
    botaoMenuMobile.addEventListener('click', () => {
        menuPrincipal.classList.toggle('show');
    });
}

// Controle do carrossel de calculadoras
const trilhoCarrossel = document.getElementById('trilhoCarrossel');
let divsDoCarrossel = [];
let botoesBolinha = [];

if (trilhoCarrossel) {
    divsDoCarrossel = Array.from(trilhoCarrossel.getElementsByClassName('carousel-slide'));
}

const btnAnterior = document.getElementById('btnAnterior');
const btnProximo = document.getElementById('btnProximo');
const containerBolinhas = document.getElementById('containerBolinhas');

if (containerBolinhas) {
    botoesBolinha = Array.from(containerBolinhas.getElementsByClassName('dot'));
}

let posicaoAtual = 0;

// Muda o slide do carrossel
function alternarSlideDoCarrossel(novoIndex) {
    if (!trilhoCarrossel || divsDoCarrossel.length === 0) return;

    trilhoCarrossel.style.transform = `translateX(-${novoIndex * 100}%)`;

    // Atualiza classes ativas nos slides
    for (let i = 0; i < divsDoCarrossel.length; i++) {
        divsDoCarrossel[i].classList.remove('active');
        if (botoesBolinha[i]) botoesBolinha[i].classList.remove('active');
    }

    divsDoCarrossel[novoIndex].classList.add('active');
    if (botoesBolinha[novoIndex]) botoesBolinha[novoIndex].classList.add('active');

    posicaoAtual = novoIndex;
}

// Evento do botão próximo
if (btnProximo) {
    btnProximo.addEventListener('click', () => {
        let proximo = posicaoAtual + 1;
        if (proximo >= divsDoCarrossel.length) {
            proximo = 0;
        }
        alternarSlideDoCarrossel(proximo);
    });
}

// Evento do botão anterior
if (btnAnterior) {
    btnAnterior.addEventListener('click', () => {
        let anterior = posicaoAtual - 1;
        if (anterior < 0) {
            anterior = divsDoCarrossel.length - 1;
        }
        alternarSlideDoCarrossel(anterior);
    });
}

// Navegação pelas bolinhas
if (containerBolinhas) {
    containerBolinhas.addEventListener('click', (evento) => {
        const elemento = evento.target;
        if (elemento.classList && elemento.classList.contains('dot')) {
            const indice = parseInt(elemento.getAttribute('data-slide'), 10);
            if (!isNaN(indice)) {
                alternarSlideDoCarrossel(indice);
            }
        }
    });
}

// ========================
// CALCULADORAS
// ========================

// 1. Calculadora de Macronutrientes
const formularioMacro = document.getElementById('formularioMacro');
if (formularioMacro) {
    formularioMacro.addEventListener('submit', (evento) => {
        evento.preventDefault();

        const totalCalorias = parseFloat(document.getElementById('calorias').value);
        const percProteina = parseFloat(document.getElementById('porcentagemProteina').value) / 100;
        const percCarbo = parseFloat(document.getElementById('porcentagemCarbo').value) / 100;
        const percGordura = parseFloat(document.getElementById('porcentagemGordura').value) / 100;

        const soma = percProteina + percCarbo + percGordura;
        if (Math.abs(soma - 1) > 0.01) {
            alert('Atenção! A soma das porcentagens precisa dar 100%');
            return;
        }

        const proteinasG = (totalCalorias * percProteina) / 4;
        const carboidratosG = (totalCalorias * percCarbo) / 4;
        const gordurasG = (totalCalorias * percGordura) / 9;

        const divResultado = document.getElementById('resultadoMacro');
        if (divResultado) {
            divResultado.style.display = 'block';
            divResultado.innerHTML = `
                <h4 class="titulo-resultado">Metas diárias de macronutrientes</h4>
                <p class="resultado-item"><span class="resultado-icone">🍗</span> Proteínas: <strong>${proteinasG.toFixed(1)}g</strong> (${(totalCalorias * percProteina).toFixed(0)} kcal)</p>
                <p class="resultado-item"><span class="resultado-icone">🍞</span> Carboidratos: <strong>${carboidratosG.toFixed(1)}g</strong> (${(totalCalorias * percCarbo).toFixed(0)} kcal)</p>
                <p class="resultado-item"><span class="resultado-icone">🥑</span> Gorduras: <strong>${gordurasG.toFixed(1)}g</strong> (${(totalCalorias * percGordura).toFixed(0)} kcal)</p>
            `;
        }
    });
}

// 2. Calculadora de IMC
const formularioImc = document.getElementById('formularioImc');
if (formularioImc) {
    formularioImc.addEventListener('submit', (evento) => {
        evento.preventDefault();

        const peso = parseFloat(document.getElementById('pesoImc').value);
        const altura = parseFloat(document.getElementById('alturaImc').value);
        const imc = peso / (altura * altura);

        let classificacao = '';
        if (imc < 18.5) {
            classificacao = 'Abaixo do peso ideal';
        } else if (imc < 25) {
            classificacao = 'Peso normal (parabéns!)';
        } else if (imc < 30) {
            classificacao = 'Sobrepeso';
        } else {
            classificacao = 'Obesidade';
        }

        const divResultado = document.getElementById('resultadoImc');
        if (divResultado) {
            divResultado.style.display = 'block';
            divResultado.innerHTML = `
                <h4 class="titulo-resultado">Resultado do seu IMC</h4>
                <p class="resultado-item"><strong>Valor do IMC:</strong> ${imc.toFixed(2)}</p>
                <p class="resultado-item"><strong>Classificação:</strong> ${classificacao}</p>
            `;
        }
    });
}

// 3. Calculadora de Consumo de Água
const formularioAgua = document.getElementById('formularioAgua');
if (formularioAgua) {
    formularioAgua.addEventListener('submit', (evento) => {
        evento.preventDefault();

        const peso = parseFloat(document.getElementById('pesoAgua').value);
        const praticaAtividade = document.getElementById('atividadeAgua').value;

        let quantidadeMl = peso * 35; // 35ml por kg
        if (praticaAtividade === 'sim') {
            quantidadeMl += 700;
        }

        const litros = quantidadeMl / 1000;
        const copos250ml = Math.round(quantidadeMl / 250);

        const divResultado = document.getElementById('resultadoAgua');
        if (divResultado) {
            divResultado.style.display = 'block';
            divResultado.innerHTML = `
                <h4 class="titulo-resultado">Água recomendada por dia</h4>
                <p class="resultado-item resultado-destaque"><strong>${litros.toFixed(2)} litros</strong> por dia</p>
                <p class="resultado-item resultado-observacao">Isso equivale a cerca de ${copos250ml} copos de 250ml</p>
            `;
        }
    });
}

// 4. Calculadora de Déficit / Superávit Calórico
const formularioBalanco = document.getElementById('formularioBalanco');
if (formularioBalanco) {
    formularioBalanco.addEventListener('submit', (evento) => {
        evento.preventDefault();

        const gastoTotal = parseFloat(document.getElementById('gastoMetabolico').value);
        const objetivo = document.getElementById('objetivoTreino').value;

        let metaCalorica = 0;
        let explicacao = '';

        if (objetivo === 'deficit') {
            metaCalorica = gastoTotal - 400;
            explicacao = 'Para um emagrecimento saudável, aplicamos um déficit de 400 kcal no seu gasto diário.';
        } else {
            metaCalorica = gastoTotal + 300;
            explicacao = 'Para ganho de massa muscular, adicionamos 300 kcal ao seu gasto diário.';
        }

        const divResultado = document.getElementById('resultadoBalanco');
        if (divResultado) {
            divResultado.style.display = 'block';
            divResultado.innerHTML = `
                <h4 class="titulo-resultado">Meta calórica sugerida</h4>
                <p class="resultado-item resultado-meta-principal"><strong>${metaCalorica.toFixed(0)} kcal/dia</strong></p>
                <p class="resultado-item resultado-explicacao">${explicacao}</p>
            `;
        }
    });
}