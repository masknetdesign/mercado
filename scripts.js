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
const userInfo = document.getElementById('userInfo');
const logoutIcon = document.getElementById('logoutIcon');
const footerIcons = document.querySelectorAll('.footer-icon');
const addressModal = document.getElementById('addressModal');
const addressForm = document.getElementById('addressForm');
let products = [];
let order = [];

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
<<<<<<< HEAD
            addressModal.style.display = 'flex'; // Exibe o modal de endereço
=======
            // Calcular o total do pedido
            let total = order.reduce((acc, item) => acc + item.price * item.quantity, 0);

            // Obter o usuário autenticado
            const user = firebase.auth().currentUser;

            // Verificar se o usuário está autenticado
            if (user) {
                // Criar um novo documento na coleção "pedidos"
                db.collection('pedidos').add({
                    userId: user.uid,
                    products: order,
                    total: total,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                }).then(() => {
                    // Montar a mensagem para enviar via WhatsApp
                    let message = `🛒 *Meu Pedido*\n\n`;

                    order.forEach((item, index) => {
                        const subtotal = (item.price * item.quantity).toFixed(2);
                        message += `${index + 1}. *${item.name}* - R$${item.price.toFixed(2)} x ${item.quantity} = R$${subtotal}\n`;
                    });

                    message += `\n*Total*: R$${total.toFixed(2)}`;

                    // Número de telefone para enviar o pedido via WhatsApp
                    const phoneNumber = '+5511962964464'; // Substitua pelo número desejado

                    // Formatar a mensagem e o número de telefone para URL
                    const encodedMessage = encodeURIComponent(message);
                    const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

                    // Abrir WhatsApp com a mensagem preenchida e o número de telefone
                    window.open(whatsappURL, '_blank');

                    // Limpar o pedido após enviar
                    order = [];
                    updateOrderList();
                    alert('Pedido concluído com sucesso!');
                }).catch((error) => {
                    console.error('Erro ao criar pedido:', error);
                    alert('Erro ao criar pedido. Por favor, tente novamente.');
                });
            } else {
                console.error('Usuário não autenticado.');
                alert('Você precisa estar logado para concluir o pedido.');
            }
>>>>>>> 1e3c1b8c82c3e89c59999befd827c6c592a7435a
        } else {
            alert('Adicione produtos ao pedido antes de concluir.');
        }
    });
}

// Event listener para o formulário de endereço
if (addressForm) {
    addressForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const street = document.getElementById('street').value;
        const houseNumber = document.getElementById('houseNumber').value;
        const neighborhood = document.getElementById('neighborhood').value;
        const postalCode = document.getElementById('postalCode').value;

        // Calcular o total do pedido
        let total = order.reduce((acc, item) => acc + item.price * item.quantity, 0);

        // Obter o usuário autenticado
        const user = firebase.auth().currentUser;

        // Verificar se o usuário está autenticado
        if (user) {
            // Criar um novo documento na coleção "pedidos"
            db.collection('pedidos').add({
                userId: user.uid,
                products: order,
                total: total,
                address: {
                    name: name,
                    street: street,
                    houseNumber: houseNumber,
                    neighborhood: neighborhood,
                    postalCode: postalCode
                },
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
                // Montar a mensagem para enviar via WhatsApp
                let message = `🛒 *Meu Pedido*\n\n`;

                order.forEach((item, index) => {
                    const subtotal = (item.price * item.quantity).toFixed(2);
                    message += `${index + 1}. *${item.name}* - R$${item.price.toFixed(2)} x ${item.quantity} = R$${subtotal}\n`;
                });

                message += `\n*Total*: R$${total.toFixed(2)}\n\n📍 *Endereço de Entrega*\n`;
                message += `Nome: ${name} --->  Rua: ${street}, Nº: ${houseNumber}, Bairro: ${neighborhood}, CEP: ${postalCode}`;

                // Número de telefone para enviar o pedido via WhatsApp
                const phoneNumber = '+5511962964464'; // Substitua pelo número desejado

                // Formatar a mensagem e o número de telefone para URL
                const encodedMessage = encodeURIComponent(message);
                const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

                // Abrir WhatsApp com a mensagem preenchida e o número de telefone
                window.open(whatsappURL, '_blank');

                // Limpar o pedido após enviar
                order = [];
                updateOrderList();
                alert('Pedido concluído com sucesso!');
                addressModal.style.display = 'none'; // Fecha o modal de endereço
            }).catch((error) => {
                console.error('Erro ao criar pedido:', error);
                alert('Erro ao criar pedido. Por favor, tente novamente.');
            });
        } else {
            console.error('Usuário não autenticado.');
            alert('Você precisa estar logado para concluir o pedido.');
        }
    });
}

// Event listener para o ícone de logout
if (logoutIcon) {
    logoutIcon.addEventListener('click', function() {
        firebase.auth().signOut().then(() => {
            window.location.href = 'login.html';
        }).catch((error) => {
            console.error('Erro ao fazer logout:', error);
        });
    });
}

// Event listeners para ações nos ícones do footer
footerIcons.forEach(icon => {
    icon.addEventListener('click', function() {
        const iconName = icon.id;
        handleFooterNavigation(iconName);
    });
});

document.getElementById('homeIcon').addEventListener('click', function() {
    window.location.href = 'index.html';
});

document.getElementById('orderIcon').addEventListener('click', function() {
    window.location.href = 'orders.html';
});

document.getElementById('profileIcon').addEventListener('click', function() {
    window.location.href = 'profile.html';
});

function handleFooterNavigation(iconName) {
    switch (iconName) {
        case 'orderIcon':
            window.location.href = 'orders.html';
            break;
        case 'profileIcon':
            window.location.href = 'profile.html';
            break;
        case 'homeIcon':
            window.location.href = 'index.html';
            break;
        default:
            console.log('Ícone não reconhecido.');
    }
}

function updateOrderList() {
    orderList.innerHTML = '';
    let total = 0;

    order.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${item.name} - R$${item.price.toFixed(2)} x ${item.quantity}
            <span class="actions">
                <i class="material-icons add" data-id="${item.id}" onclick="increaseQuantity(${index})">add</i>
                <i class="material-icons remove" data-id="${item.id}" onclick="decreaseQuantity(${index})">remove</i>
                <i class="material-icons delete" data-id="${item.id}" onclick="deleteItem(${index})">delete</i>
            </span>
        `;
        orderList.appendChild(li);
        total += item.price * item.quantity;
    });

    orderTotal.textContent = `Total: R$${total.toFixed(2)}`;
}

function increaseQuantity(index) {
    order[index].quantity++;
    updateOrderList();
}

function decreaseQuantity(index) {
    if (order[index].quantity > 1) {
        order[index].quantity--;
    } else {
        order.splice(index, 1);
    }
    updateOrderList();
}

function deleteItem(index) {
    order.splice(index, 1);
    updateOrderList();
}

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

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        showUserInfo(user);
    } else {
        window.location.href = 'login.html';
    }
});

loadProducts();
