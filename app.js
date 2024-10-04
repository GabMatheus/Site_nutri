// Variável que conterá os dados carregados do JSON
let foodData = [];
let searchField = document.getElementById('search');

// Sugestões dinâmicas no placeholder
const placeholders = [
    "Digite o nome de um alimento...",
    "Ex: Arroz, integral, cozido",
    "Ex: Feijão, carioca, cozido",
    "Ex: Macarrão, espaguete"
];
let placeholderIndex = 0;
setInterval(() => {
    searchField.placeholder = placeholders[placeholderIndex];
    placeholderIndex = (placeholderIndex + 1) % placeholders.length;
}, 3000); // Troca a cada 3 segundos

// Carregar o JSON assim que o site é carregado
fetch('TACO.json')
    .then(response => response.json())
    .then(data => {
        foodData = data;
    })
    .catch(error => console.error('Erro ao carregar o arquivo JSON:', error));

let clearTimeoutId; // Variável para armazenar o ID do timeout

// Função para buscar e exibir informações nutricionais
searchField.addEventListener('input', function() {
    const query = this.value.toLowerCase().trim(); // Verificar valor e remover espaços

    // Limpa o timeout anterior se o usuário digitar algo
    clearTimeout(clearTimeoutId);

    if (query.length === 0) {
        clearResults(); // Limpa os resultados se o campo estiver vazio
    } else {
        // Filtra os alimentos com base no que o usuário digitou
        const results = foodData.filter(item => item.description.toLowerCase().includes(query));
        if (results.length > 0) {
            displayResults(results);
        } else {
            clearResults(); // Limpa os resultados se não houver correspondências
        }
    }

    // Define um novo timeout para limpar os resultados após 30 segundos
    clearTimeoutId = setTimeout(() => {
        clearResults(); // Chama clearResults após 30 segundos de inatividade
    }, 12000); // 12 segundos
});

// Função para exibir resultados
function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Limpa os resultados anteriores

    if (results.length > 0) {
        // Animação de loading durante o carregamento dos resultados
        resultsDiv.innerHTML = '<p>Carregando...</p>';
        setTimeout(() => {
            resultsDiv.innerHTML = ''; // Limpa o "Carregando" após 500ms
            results.forEach(item => {
                const foodDiv = document.createElement('div');
                foodDiv.classList.add('food-info');
                foodDiv.innerHTML = `
                    <h3>${item.description}</h3>
                    <p><strong>Categoria:</strong> ${item.category}</p>
                    <p><strong>Proteínas:</strong> ${item.protein_g}g</p>
                    <p><strong>Carboidratos:</strong> ${item.carbohydrate_g}g</p>
                    <p><strong>Calorias:</strong> ${item.energy_kcal.toFixed(2)}kcal</p>
                    <p><strong>Lipídios:</strong> ${item.lipid_g}g</p>
                    <p><strong>Fibras:</strong> ${item.fiber_g}g</p>
                `;
                resultsDiv.appendChild(foodDiv);
            });
        }, 500); // Aguarda 500ms antes de exibir os resultados
    } else {
        resultsDiv.innerHTML = '<p>Nenhum alimento encontrado.</p>';
    }
}

// Função para limpar os resultados
function clearResults() {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Limpa os resultados completamente
}

document.getElementById('macro-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const calorias = parseFloat(document.getElementById('calorias').value);
    const percentProteinas = parseFloat(document.getElementById('percent-proteinas').value) / 100;
    const percentCarboidratos = parseFloat(document.getElementById('percent-carboidratos').value) / 100;
    const percentLipidios = parseFloat(document.getElementById('percent-lipidios').value) / 100;

    // Calcular gramas de cada macronutriente
    const proteinas = (calorias * percentProteinas) / 4; // 1g de proteína = 4 calorias
    const carboidratos = (calorias * percentCarboidratos) / 4; // 1g de carboidrato = 4 calorias
    const lipidios = (calorias * percentLipidios) / 9; // 1g de lipídio = 9 calorias

    // Exibir os resultados
    const macroResultsDiv = document.getElementById('macro-results');
    macroResultsDiv.innerHTML = `
        <h3>Resultados:</h3>
        <p><strong>Proteínas:</strong> ${proteinas.toFixed(2)}g</p>
        <p><strong>Carboidratos:</strong> ${carboidratos.toFixed(2)}g</p>
        <p><strong>Lipídios:</strong> ${lipidios.toFixed(2)}g</p>
    `;
});

//-----------------------------------//

const navLinks = document.querySelectorAll('nav ul li a');

// Adiciona um evento de clique a cada link
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault(); // Previne o comportamento padrão do link

        const targetId = this.getAttribute('href'); // Obtém o ID da seção de destino
        const targetSection = document.querySelector(targetId); // Seleciona a seção de destino

        // Rolagem suave até a seção de destino
        targetSection.scrollIntoView({
            behavior: 'smooth', // Comportamento de rolagem suave
            block: 'start' // Alinha a seção ao topo
        });
    });
});