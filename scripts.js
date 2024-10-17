// Função para processar o upload de arquivo ZIP
document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.zip')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // Descompactar o arquivo ZIP usando JSZip
            JSZip.loadAsync(e.target.result).then(function(zip) {
                const decisionList = document.getElementById('decisionList');
                decisionList.innerHTML = ''; // Limpar a lista de decisões

                // Procurar arquivos JSON dentro do ZIP e gerar subníveis
                zip.forEach(function (relativePath, zipEntry) {
                    if (zipEntry.name.endsWith('.json')) {
                        const jsonFileName = zipEntry.name.replace('.json', '');
                        // Criar um item no menu para cada node
                        const decisionItem = document.createElement('button');
                        decisionItem.textContent = `Node ${jsonFileName}`;
                        decisionItem.classList.add('decision-button');
                        
                        // Ao clicar, carregar o arquivo JSON correspondente ao node
                        decisionItem.addEventListener('click', function() {
                            zipEntry.async("string").then(function(content) {
                                const jsonData = JSON.parse(content);
                                generateRangeChart(jsonData); // Gerar o range específico daquele node
                            });
                        });
                        
                        // Adicionar ao menu
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

// Função que gera o range com base no JSON do node clicado
function generateRangeChart(data) {
    const ranges = extractRangesFromNodeData(data);  // Extrair o range daquele node
    drawRangeChart(ranges);
}

// Função para extrair os ranges do arquivo JSON de cada node
function extractRangesFromNodeData(data) {
    const extractedRanges = {};

    // Iterar sobre as informações das mãos no JSON e extrair as porcentagens e mãos correspondentes
    data.ranges.forEach(hand => {
        extractedRanges[hand.name] = hand.percentage;
    });

    return extractedRanges;
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

            if (ranges[hand]) {
                cell.textContent = `${ranges[hand]}%`;
                cell.style.backgroundColor = `rgba(255, 165, 0, ${ranges[hand] / 100})`;
            } else {
                cell.textContent = `0%`;
                cell.style.backgroundColor = 'lightgray';
            }

            row.appendChild(cell);
        });
        table.appendChild(row);
    });

    chartContainer.appendChild(table);
}
