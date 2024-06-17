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
            window.location.href = 'orders.html'; // Redireciona para a página de pedidos
        });

        profileIcon.addEventListener('click', function() {
            window.location.href = 'profile.html'; // Redireciona para a página de perfil
        });

        // Configuração do Firebase
        const firebaseConfig = {
            apiKey: "AIzaSyBkrBLKuklZgPm1nz2G997ULiYycZMb9F8",
            authDomain: "avisoseeventos.firebaseapp.com",
            projectId: "avisoseeventos",
            storageBucket: "avisoseeventos.appspot.com",
            messagingSenderId: "247706769451",
            appId: "1:247706769451:web:ce31cd9d0ca22cd267b26e"
        };

        // Inicialização do Firebase
        firebase.initializeApp(firebaseConfig);
        const db = firebase.firestore();

        // Verifica o estado de autenticação do usuário ao carregar a página
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // Usuário está autenticado
                showUserInfo(user); // Exibe informações do usuário
                loadOrders(user.uid); // Carrega os pedidos do usuário
            } else {
                // Usuário não está autenticado, redireciona para a página de login
                window.location.href = 'login.html';
            }
        });

        // Função para exibir informações do usuário
        function showUserInfo(user) {
            db.collection('users').doc(user.uid).get().then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    profilePic.src = userData.photoURL || 'caminho/para/imagem-padrao.jpg'; // URL da foto do usuário
                    profileName.textContent = userData.nome || 'Nome do Usuário'; // Nome do usuário
                } else {
                    console.log("Nenhum dado encontrado para o usuário.");
                }
            }).catch((error) => {
                console.log("Erro ao obter dados do usuário:", error);
            });
        }

        // Função para carregar pedidos do usuário
        function loadOrders(userId) {
            db.collection('pedidos').where('userId', '==', userId).get().then((querySnapshot) => {
                const orderList = document.getElementById('orderList');
                orderList.innerHTML = ''; // Limpa a lista de pedidos antes de adicionar novos
                querySnapshot.forEach((doc) => {
                    const orderData = doc.data();
                    const li = document.createElement('li');
                    li.textContent = `Pedido ID: ${doc.id}, Total: R$${orderData.total.toFixed(2)}`;
                    orderList.appendChild(li);
                });
            }).catch((error) => {
                console.error('Erro ao carregar pedidos:', error);
            });
        }

    } else {
        console.error('Um ou mais ícones do rodapé ou elementos do perfil não foram encontrados.');
    }
});
