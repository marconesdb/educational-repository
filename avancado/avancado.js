document.addEventListener('DOMContentLoaded', function () {
    const contentGrid = document.getElementById('content-grid');

    // URL do arquivo conteudos.json
    const conteudosJsonUrl = '../conteudos.json';

    // Função para carregar e exibir o conteúdo do JSON
    function carregarConteudos() {
        fetch(conteudosJsonUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao carregar o arquivo JSON');
                }
                return response.json();
            })
            .then(results => {
                // Filtrar apenas os conteúdos da categoria 'iniciante'
                const conteudosAvancado = results.filter(content => content.category === 'avancado');

                // Limpar conteúdo existente, se houver
                contentGrid.innerHTML = '';

                // Iterar sobre os resultados filtrados e criar elementos HTML correspondentes
                conteudosAvancado.forEach(content => {
                    const contentItem = document.createElement('div');
                    contentItem.className = 'content-item';

                    let contentHtml = '';

                    // Verifica o tipo de conteúdo e gera o HTML correspondente
                    switch (content.type) {
                        case 'video':
                            const videoId = getYoutubeVideoId(content.src);
                            contentHtml = `
                                <div class="relative" style="padding-bottom: calc(56.25% + 10%);">
                                    <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen class="absolute top-0 left-0 w-full h-full"></iframe>
                                </div>
                            `;
                            break;
                        case 'pdf':
                            contentHtml = `
                                <img src="../img/icone-pdf.png" alt="${content.title}" class="w-full h-auto object-cover">
                                <a href="${content.src}" download="${content.title}.pdf" class="block bg-blue-500 text-white px-4 py-2 rounded mt-2 text-center">Download</a>
                            `;
                            break;
                        case 'apresentacao':
                            contentHtml = `
                                <img src="../img/icone-pptx.png" alt="${content.title}" class="w-full h-auto object-cover">
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

                    // Adiciona o item ao grid de conteúdos
                    contentGrid.appendChild(contentItem);
                });
            })
            .catch(error => {
                console.error('Erro ao carregar conteúdos:', error);
            });
    }

    // Função para obter o ID do vídeo do YouTube a partir do link
    function getYoutubeVideoId(url) {
        const regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    }

    // Chamar a função para carregar conteúdos ao carregar a página
    carregarConteudos();
});
