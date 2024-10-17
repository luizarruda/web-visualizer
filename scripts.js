// Função para processar o upload do arquivo JSON
document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const jsonData = JSON.parse(e.target.result);
            // Gerar a tabela de ranges com base no arquivo JSON
            generateRangeChart(jsonData);
        };
        reader.readAsText(file);
    }
}

function generateRangeChart(data) {
    const selectedTreeLevel = document.getElementById('treeLevel').value;
    const selectedPosition = document.getElementById('position').value;

    // Extrair os ranges do JSON com base no nível da gametree e posição
    const ranges = extractRangesFromData(data, selectedTreeLevel, selectedPosition);

    // Exibir a tabela de ranges
    drawRangeChart(ranges);
}

function extractRangesFromData(data, treeLevel, position) {
    // Esta função extrai os ranges do arquivo JSON com base na seleção do usuário
    // Use o campo `data` para acessar o conteúdo JSON
    // Para fins de exemplo, retornamos um objeto fictício
    const mockRanges = {
        "AA": "raise", "AKs": "raise", "AQs": "raise", "A5s": "raise",
        "KK": "raise", "KQs": "raise", "KJs": "raise",
        "QQ": "raise", "QJs": "raise", "JJ": "raise",
        "TT": "raise", "99": "raise", "88": "raise",
        "76s": "fold", "65s": "raise", "54s": "fold"
    };
    return mockRanges;
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
