// Arquivo profile.js

document.addEventListener('DOMContentLoaded', function() {
    // Seleciona os ícones do rodapé
    const homeIcon = document.querySelector('footer i:nth-child(1)');
    const searchIcon = document.querySelector('footer i:nth-child(2)');
    const orderIcon = document.querySelector('footer i:nth-child(3)');
    const profileIcon = document.querySelector('footer i:nth-child(4)');
    const profilePic = document.getElementById('profilePic');
    const profileName = document.getElementById('profileName');

    // Verifica se os elementos foram encontrados no HTML
    if (homeIcon && searchIcon && orderIcon && profileIcon && profilePic && profileName) {
        // Adiciona eventos de clique aos ícones
        homeIcon.addEventListener('click', function() {
            window.location.href = 'index.html'; // Redireciona para a página inicial
        });

        searchIcon.addEventListener('click', function() {
            window.location.href = 'search.html'; // Redireciona para a página de pesquisa
        });

        orderIcon.addEventListener('click', function() {
            window.location.href = 'order.html'; // Redireciona para a página de pedidos
        });

        profileIcon.addEventListener('click', function() {
            window.location.href = 'profile.html'; // Redireciona para a página de perfil
        });

        // Exemplo de preenchimento dinâmico do perfil (substitua com dados reais)
        profilePic.src = 'caminho/para/sua/imagem.jpg'; // Caminho para a foto do usuário
        profileName.textContent = 'Nome do Usuário'; // Nome do usuário
    } else {
        console.error('Um ou mais ícones do rodapé ou elementos do perfil não foram encontrados.');
    }
});
