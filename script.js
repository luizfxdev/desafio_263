// script.js
document.addEventListener('DOMContentLoaded', function () {
  const convertBtn = document.getElementById('convert-btn');
  const returnBtn = document.getElementById('return-btn');
  const scriptInput = document.getElementById('script-input');
  const resultDiv = document.getElementById('result');
  const calculationDiv = document.getElementById('calculation');

  // Função para encontrar a palavra mais frequente
  function findMostFrequentWord(text) {
    // Remove pontuação e converte para minúsculas
    const cleanText = text.replace(/[^\p{L}\s]/gu, '').toLowerCase();

    // Divide o texto em palavras e remove strings vazias
    const words = cleanText.split(/\s+/).filter(word => word.length > 0);

    // Filtra palavras com mais de 3 letras
    const filteredWords = words.filter(word => word.length > 3);

    // Se não há palavras válidas, retorna resultado vazio
    if (filteredWords.length === 0) {
      return {
        mostFrequent: '',
        maxCount: 0,
        wordCount: {}
      };
    }

    // Conta a frequência de cada palavra exata e registra a primeira ocorrência
    const wordCount = {};
    const firstOccurrence = {};

    filteredWords.forEach((word, index) => {
      if (!wordCount[word]) {
        wordCount[word] = 0;
        firstOccurrence[word] = index; // Registra a posição da primeira ocorrência
      }
      wordCount[word]++;
    });

    // Encontra a palavra mais frequente
    let maxCount = 0;
    const wordsWithMaxCount = [];

    // Primeiro, encontra a frequência máxima
    for (const word in wordCount) {
      if (wordCount[word] > maxCount) {
        maxCount = wordCount[word];
      }
    }

    // Depois, coleta todas as palavras com frequência máxima
    for (const word in wordCount) {
      if (wordCount[word] === maxCount) {
        wordsWithMaxCount.push({
          word: word,
          index: firstOccurrence[word]
        });
      }
    }

    // Verifica se há empate (mais de uma palavra com frequência máxima)
    let mostFrequent = '';
    let hasTie = false;

    if (wordsWithMaxCount.length > 1) {
      hasTie = true;
      mostFrequent = 'Empate de Palavras';
    } else {
      mostFrequent = wordsWithMaxCount[0].word;
    }

    return {
      mostFrequent,
      maxCount,
      wordCount,
      hasTie
    };
  }

  // Função para exibir o resultado e os cálculos
  function displayResult(result) {
    if (result.mostFrequent === '') {
      resultDiv.innerHTML =
        '<span style="color: #ff6b6b;">Nenhuma palavra válida encontrada (palavras devem ter mais de 3 letras).</span>';
      calculationDiv.innerHTML = '';
      return;
    }

    if (result.hasTie) {
      resultDiv.innerHTML = `Resultado: <span class="highlight">"Empate de Palavras"</span> (${result.maxCount} ocorrência(s) cada)`;
    } else {
      resultDiv.innerHTML = `Palavra mais frequente: <span class="highlight">"${result.mostFrequent}"</span> (aparece ${result.maxCount} vezes)`;
    }

    // Ordena as palavras por frequência (decrescente) e depois por ordem alfabética
    const sortedWords = Object.entries(result.wordCount).sort((a, b) => {
      if (b[1] !== a[1]) {
        return b[1] - a[1]; // Por frequência (decrescente)
      }
      return a[0].localeCompare(b[0]); // Por ordem alfabética em caso de empate
    });

    let calculationHTML = '<h3>Contagem de Palavras:</h3>';

    sortedWords.forEach(([word, count]) => {
      // Destaca todas as palavras que empataram com a frequência máxima
      const isHighlighted =
        (result.hasTie && count === result.maxCount) || (!result.hasTie && word === result.mostFrequent)
          ? 'highlight'
          : '';
      calculationHTML += `
                <div class="word-count">
                    <span class="${isHighlighted}">${word}</span>
                    <span>${count} ocorrência(s)</span>
                </div>
            `;
    });

    calculationDiv.innerHTML = calculationHTML;
  }

  // Event listener para o botão Converter
  convertBtn.addEventListener('click', function () {
    const text = scriptInput.value.trim();

    if (text === '') {
      resultDiv.innerHTML = '<span style="color: #ff6b6b;">Por favor, insira um texto para analisar.</span>';
      calculationDiv.innerHTML = '';
      return;
    }

    const result = findMostFrequentWord(text);
    displayResult(result);
  });

  // Event listener para o botão Retornar
  returnBtn.addEventListener('click', function () {
    scriptInput.value = '';
    resultDiv.innerHTML = '';
    calculationDiv.innerHTML = '';
  });

  // Texto de exemplo para facilitar o teste
  const exampleText =
    'No condado de Hawkins, doze crianças desapareceram no último verão. Onze delas foram encontradas, mas uma ainda está perdida. Elas estavam jogando no bosque quando tudo aconteceu.';
  scriptInput.value = exampleText;
});
