document.addEventListener('DOMContentLoaded', function () {
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('search');
  const searchIcon = document.getElementById('searchIcon');

  // Função para lidar com a pesquisa
  function handleSearch(event) {
      event.preventDefault();

      // Obtém o valor da pesquisa e converte para minúsculas
      const query = searchInput.value.trim().toLowerCase();

      // Verifica se o campo de pesquisa está vazio
      if (query === '') {
          return;
      }

      // Faz uma requisição para o arquivo JSON de conteúdos
      fetch('conteudos.json')
          .then(response => response.json())
          .then(contents => {
              // Filtra os conteúdos com base na consulta de pesquisa
              const filteredContents = contents.filter(content =>
                  content.title.toLowerCase().includes(query)
              );

              // Cria os parâmetros da URL com os resultados da pesquisa
              const searchParams = new URLSearchParams();
              searchParams.append('results', JSON.stringify(filteredContents));
              window.location.href = `conteudo.html?query=${encodeURIComponent(query)}`;
          })
          .catch(error => console.error('Erro ao carregar conteúdos:', error));
  }

  // Adiciona eventos de submit e click para o formulário de pesquisa e o ícone de pesquisa
  searchForm.addEventListener('submit', handleSearch);
  searchIcon.addEventListener('click', handleSearch);
});
