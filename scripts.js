document.addEventListener('DOMContentLoaded', function() {
    // Configuração do Firebase
    var firebaseConfig = {
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

    // Seletores de elementos do DOM
    const productSelect = document.getElementById('productSelect');
    const orderForm = document.getElementById('orderForm');
    const orderList = document.getElementById('orderList');
    const orderTotal = document.getElementById('orderTotal');
    const completeOrder = document.getElementById('completeOrder');
    const searchIcon = document.getElementById('searchIcon');
    const homeIcon = document.getElementById('homeIcon');
    const orderIcon = document.getElementById('orderIcon');
    const profileIcon = document.getElementById('profileIcon');
    const userInfo = document.getElementById('userInfo');
    const loginForm = document.getElementById('loginForm');
    const cadastroForm = document.getElementById('cadastroForm');
    const showCadastroLink = document.getElementById('showCadastro');
    const showLoginLink = document.getElementById('showLogin');

    let products = [];
    let order = [];

    // Event listener para exibir formulário de cadastro
    if (showCadastroLink) {
        showCadastroLink.addEventListener('click', function(e) {
            e.preventDefault();
            loginForm.style.display = 'none';
            cadastroForm.style.display = 'block';
        });
    }

    // Event listener para exibir formulário de login
    if (showLoginLink) {
        showLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            cadastroForm.style.display = 'none';
            loginForm.style.display = 'block';
        });
    }

    // Event listener para login
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('emailLogin').value;
            const password = document.getElementById('passwordLogin').value;
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Login bem sucedido
                    console.log('Usuário logado:', userCredential.user.email);
                    window.location.href = 'index.html'; // Redireciona para a página principal
                })
                .catch((error) => {
                    var errorMessage = error.message;
                    console.error(errorMessage);
                    alert('Erro ao fazer login. Verifique suas credenciais.');
                });
        });
    }

    // Event listener para cadastro
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const nome = document.getElementById('nomeCadastro').value;
            const email = document.getElementById('emailCadastro').value;
            const password = document.getElementById('passwordCadastro').value;
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Cadastro bem sucedido
                    const user = userCredential.user;
                    return db.collection('users').doc(user.uid).set({
                        nome: nome,
                        email: email
                    });
                })
                .then(() => {
                    window.location.href = 'index.html'; // Redireciona para a página principal
                })
                .catch((error) => {
                    var errorMessage = error.message;
                    console.error(errorMessage);
                    alert('Erro ao cadastrar usuário. Verifique seus dados.');
                });
        });
    }

    // Função para carregar produtos do Firebase
    function loadProducts() {
        db.collection('products').get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const product = { id: doc.id, ...doc.data() };
                products.push(product);
                const option = document.createElement('option');
                option.value = product.id;
                option.textContent = `${product.name} - R$${product.price.toFixed(2)}`;
                productSelect.appendChild(option);
            });
        });
    }

    // Função para atualizar a lista de pedidos na interface
    function updateOrderList() {
        orderList.innerHTML = '';
        let total = 0;

        order.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${item.name} - R$${item.price.toFixed(2)} x ${item.quantity}
                <span class="actions">
                    <i class="material-icons add" data-id="${item.id}">add</i>
                    <i class="material-icons remove" data-id="${item.id}">remove</i>
                    <i class="material-icons delete" data-id="${item.id}">delete</i>
                </span>
            `;
            orderList.appendChild(li);
            total += item.price * item.quantity;
        });

        orderTotal.textContent = `Total: R$${total.toFixed(2)}`;
    }

    // Função para exibir informações do usuário
    function showUserInfo(user) {
        if (user) {
            db.collection('users').doc(user.uid).get().then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    userInfo.innerHTML = `
                        <p>Bem-vindo(a), ${userData.nome}!</p>
                        
                        

                        <p>Seja bem-vindo(a) a nossa Loja!</p>
                    `;
                } else {
                    console.log("Nenhum dado encontrado para o usuário.");
                }
            }).catch((error) => {
                console.log("Erro ao obter dados do usuário:", error);
            });
        } else {
            userInfo.innerHTML = `
                <p>Bem-vindo(a)!</p>
                <p>Por favor, faça login para acessar o sistema.</p>
            `;
        }
    }

    // Event listener para o formulário de adicionar pedido
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const productId = productSelect.value;
            const quantity = parseInt(document.getElementById('orderQuantity').value);
            const product = products.find(p => p.id === productId);

            if (product) {
                const existingOrderItem = order.find(item => item.id === productId);
                if (existingOrderItem) {
                    existingOrderItem.quantity += quantity;
                } else {
                    order.push({ ...product, quantity: quantity });
                }
                updateOrderList();
            }
        });
    }

    // Event listener para o botão de concluir pedido
    if (completeOrder) {
        completeOrder.addEventListener('click', function() {
            if (order.length > 0) {
                // Montar a mensagem para enviar via WhatsApp
                let message = `🛒 *Meu Pedido*\n\n`;

                order.forEach((item, index) => {
                    const subtotal = (item.price * item.quantity).toFixed(2);
                    message += `${index + 1}. *${item.name}* - R$${item.price.toFixed(2)} x ${item.quantity} = R$${subtotal}\n`;
                });

                message += `\n*Total*: R$${orderTotal.textContent.split(':')[1].trim()}`;

                // Número de telefone para enviar o pedido via WhatsApp
                const phoneNumber = '+5511988896517'; // Substitua pelo número desejado

                // Formatar a mensagem e o número de telefone para URL
                const encodedMessage = encodeURIComponent(message);
                const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

                // Abrir WhatsApp com a mensagem preenchida e o número de telefone
                window.open(whatsappURL, '_blank');
                
                // Limpar o pedido após enviar
                order = [];
                updateOrderList();
            } else {
                alert('Adicione produtos ao pedido antes de concluir.');
            }
        });
    }

    // Event listener para o ícone de busca
    if (searchIcon) {
        searchIcon.addEventListener('click', function() {
            const productListContainer = document.getElementById('productListContainer');
            if (productListContainer.style.display === 'none') {
                productListContainer.style.display = 'block';
            } else {
                productListContainer.style.display = 'none';
            }
        });
    }

    // Funções de redirecionamento dos ícones do rodapé
    function addNavigationListeners() {
        if (orderIcon) {
            orderIcon.addEventListener('click', function() {
                window.location.href = 'order.html';
            });
        }
        if (profileIcon) {
            profileIcon.addEventListener('click', function() {
                window.location.href = 'profile.html';
            });
        }
    }

    // Event listeners para ações nos itens do pedido
    orderList.addEventListener('click', function(e) {
        const target = e.target;
        const itemId = target.dataset.id;
        const orderItem = order.find(item => item.id === itemId);

        if (target.classList.contains('add')) {
            orderItem.quantity++;
        } else if (target.classList.contains('remove')) {
            orderItem.quantity--;
            if (orderItem.quantity === 0) {
                order = order.filter(item => item.id !== itemId);
            }
        } else if (target.classList.contains('delete')) {
            order = order.filter(item => item.id !== itemId);
        }
        updateOrderList();
    });

    // Event listener para o ícone de logout
if (logoutIcon) {
    logoutIcon.addEventListener('click', function() {
        firebase.auth().signOut().then(() => {
            // Redirecionar para a página de login após logout
            window.location.href = 'login.html';
        }).catch((error) => {
            console.error('Erro ao fazer logout:', error);
        });
    });
}


    // Verificar o estado de autenticação do usuário ao carregar a página
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // Usuário está autenticado
            showUserInfo(user);
        } else {
            // Usuário não está autenticado, redireciona para a página de login
            window.location.href = 'login.html';
        }
    });

    // Inicialização
    loadProducts();
    addNavigationListeners();
});
