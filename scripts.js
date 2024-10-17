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
        "77": 100, "88": 100, "
