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

function generateRangeChart(data) {
    // Função que processa os dados JSON e gera a tabela de ranges
    const ranges = extractRangesFromData(data);
    drawRangeChart(ranges);
}

function extractRangesFromData(data) {
    // Aqui você pode adaptar o processamento do JSON conforme o formato dos arquivos
    const mockRanges = {
        "AA": "raise", "AKs": "raise", "AQs": "raise", "A5s": "raise",
        "KK": "raise", "KQs": "raise", "KJs": "raise",
        "QQ": "raise", "QJs": "raise", "JJ": "raise",
        "TT": "raise", "99": "raise", "88": "raise",
        "76s": "fold", "65s": "raise", "54s": "fold"
    };
    return mockRanges;  // Substitua pela lógica correta baseada no conteúdo do JSON
}

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
            const hand = `${rowRank}${colRank}`;

            if (ranges[hand] === 'raise') {
                cell.style.backgroundColor = '#FFA500'; // Laranja para raise
            } else if (ranges[hand] === 'fold') {
                cell.style.backgroundColor = '#D3D3D3'; // Cinza para fold
            }

            row.appendChild(cell);
        });
        table.appendChild(row);
    });

    chartContainer.appendChild(table);
}
