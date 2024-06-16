// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function () {
    // Referências aos elementos da página
    const contentList = document.getElementById('content-list');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query') ? urlParams.get('query').toLowerCase() : '';
  
    // Exibe mensagem se não houver consulta de pesquisa
    if (!query) {
        contentList.innerHTML = '<p class="text-center text-gray-600">Nenhum resultado encontrado.</p>';
        loadingSpinner.style.display = 'none';
        return;
    }
  
    // Obter os resultados da pesquisa do arquivo JSON
    fetch('conteudos.json')
        .then(response => response.json())
        .then(contents => {
            // Filtra os conteúdos com base na consulta de pesquisa
            const filteredContents = contents.filter(content =>
                content.title.toLowerCase().includes(query) ||
                content.type.toLowerCase().includes(query) ||
                content.description.toLowerCase().includes(query) ||
                content.category.toLowerCase().includes(query)
            );
  
            // Esconde o spinner de carregamento
            loadingSpinner.style.display = 'none';
  
            // Exibe mensagem se nenhum resultado for encontrado
            if (filteredContents.length === 0) {
                contentList.innerHTML = '<p class="text-center text-gray-600">Nenhum resultado encontrado.</p>';
                return;
            }
  
            // Exibir os resultados na página
            filteredContents.forEach(content => {
                const contentItem = document.createElement('div');
  
                // Aumenta a largura do card em 1%
                contentItem.className = 'bg-white p-4 rounded shadow content-item w-full sm:w-96 md:w-80';
  
                let contentHtml = '';
  
                // Exibir conteúdo baseado no tipo
                switch (content.type) {
                    case 'video':
                        // Verifica se é um link do YouTube
                        if (content.src.includes('youtube.com')) {
                            const videoId = getYoutubeVideoId(content.src);
                            contentHtml = `<div class="relative" style="padding-bottom: calc(56.25% + 10%);">
                            <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen class="absolute top-0 left-0 w-full h-full"></iframe>
                            </div>
                              `;
                          } 
                          break;
                    case 'pdf':
                        contentHtml = `
                            <img src="${content.thumbnail || './img/icone-pdf.png'}" alt="${content.title}" class="w-full fixed-height object-cover">
                            <a href="${content.src}" download="${content.title}.pdf" class="block bg-blue-500 text-white px-4 py-2 rounded mt-2 text-center">Download</a>
                        `;
                        break;
                    case 'apresentacao':
                        contentHtml = `
                            <img src="${content.thumbnail || './img/icone-pptx.png'}" alt="${content.title}" class="w-full fixed-height object-cover">
                            <a href="${content.src}" download="${content.title}.pptx" class="block bg-blue-500 text-white px-4 py-2 rounded mt-2 text-center">Download</a>
                        `;
                        break;
                }
  
                // Adiciona o conteúdo ao item da lista
                contentItem.innerHTML = `
                    ${contentHtml}
                    <h2 class="text-xl font-bold mt-4">${content.title}</h2>
                    <p>${content.description}</p>
                `;
  
                // Adiciona o item à lista de conteúdos
                contentList.appendChild(contentItem);
            });
        })
        .catch(error => {
            console.error('Erro ao obter os resultados da pesquisa:', error);
            loadingSpinner.style.display = 'none';
            contentList.innerHTML = '<p class="text-center text-gray-600">Erro ao carregar os conteúdos.</p>';
        });
  
    // Função para obter o ID do vídeo do YouTube a partir do link
    function getYoutubeVideoId(url) {
        const regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }
  });
  