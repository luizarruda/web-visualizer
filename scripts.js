document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);

// Função para processar o upload de arquivo ZIP
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.zip')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // Descompactar o arquivo ZIP usando JSZip
            JSZip.loadAsync(e.target.result).then(function(zip) {
                const decisionList = document.getElementById('decisionList');
                decisionList.innerHTML = ''; // Limpar a lista de decisões

                // Procurar arquivos JSON dentro do ZIP
                zip.forEach(function (relativePath, zipEntry) {
                    if (zipEntry.name.endsWith('.json')) {
                        // Criar um item no menu para cada decisão
                        const decisionItem = document.createElement('button');
                        decisionItem.textContent = `Decisão ${zipEntry.name.replace('.json', '')}`;
                        decisionItem.classList.add('decision-button');

                        // Adicionar evento de clique para carregar a decisão
                        decisionItem.addEventListener('click', function() {
                            zipEntry.async("string").then(function(content) {
                                const jsonData = JSON.parse(content);
                                // Gerar a tabela de ranges com base no JSON
                                generateRangeChart(jsonData);
                            });
                        });

                        // Adicionar o item ao menu
                        decisionList.appendChild(decisionItem);
                    }
                });
            });
        };
        reader.readAsArrayBuffer(file);
    } else {
        alert('Please upload a ZIP file.');
    }
}

// Função que processa os dados JSON e gera a tabela de ranges
function generateRangeChart(data) {
    const ranges = extractRangesFromData(data);
    drawRangeChart(ranges);
}

// Função para extrair os ranges corretos do arquivo JSON
function extractRangesFromData(data) {
    const adjusted_ranges = {
        "77": 100, "88": 100, "99": 100, "TT": 100, "JJ": 100, "QQ": 100, "KK": 100, "AA": 100,  // Corrigido "77+"
        "66": 98.5, "55": 6.4, "44": 6.6,
        "ATs": 100, "A9s": 98.4, "A8s": 91, "A7s": 94.8, "A6s": 78.9, "A5s": 85, "A4s": 96, "A3s": 87.7, "A2s": 2,
        "AKs": 100, "AQs": 100, "KQs": 100, "KJs": 98.9, "KTs": 97.7, "K9s": 39, "K8s": 15.7, "K7s": 0.4, "K6s": 0.1, "K5s": 0.1,
        "AKo": 100, "AQo": 100, "KQo": 100, "KJo": 62, "KTo": 7.8, "K9o": 0.1,
        "QJs": 99.1, "QTs": 98.4, "Q9s": 0.9, "QJo": 54.2, "QTo": 0.1,
        "JTs": 96.2, "J9s": 45.6, "J8s": 0.1, "JTo": 0.1, "T9s": 56.4, "T8s": 4.4, "98s": 1,
        "J9o": 0  // J9o corrigido para 0%
    };
    return adjusted_ranges;
}

// Função para desenhar a tabela de ranges
function drawRangeChart(ranges) {
    const chartContainer = document.getElementById('rangeChart');
    chartContainer.innerHTML = ''; // Limpar qualquer gráfico anterior

    const table = document.createElement('table');
    table.classList.add('range-table');

    const rankings = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

    // Cabeçalho da tabela
    const headerRow = document.createElement('tr');
    headerRow.appendChild(document.createElement('th')); // Célula vazia no canto
    rankings.forEach(rank => {
        const th = document.createElement('th');
        th.textContent = rank;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Preencher a tabela com base nos ranges
    rankings.forEach((rowRank, rowIndex) => {
        const row = document.createElement('tr');
        
        // Rótulo da linha
        const rowHeader = document.createElement('th');
        rowHeader.textContent = rowRank;
        row.appendChild(rowHeader);

        rankings.forEach((colRank, colIndex) => {
            const cell = document.createElement('td');
            const hand = rowRank === colRank ? `${rowRank}${colRank}` : rowRank > colRank ? `${colRank}${rowRank}o` : `${rowRank}${colRank}s`;

            if (ranges[hand] > 0) {
                cell.textContent = `${ranges[hand]}%`;
                cell.style.backgroundColor = `rgba(255
