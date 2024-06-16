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

    const productForm = document.getElementById('productForm');
    const productIdInput = document.getElementById('productId');
    const productNameInput = document.getElementById('productName');
    const productPriceInput = document.getElementById('productPrice');
    const productList = document.getElementById('productList');
    const editPopup = document.getElementById('editPopup');
    const popupProductIdInput = document.getElementById('popupProductIdInput');
    const popupProductNameInput = document.getElementById('popupProductNameInput');
    const popupProductPriceInput = document.getElementById('popupProductPriceInput');
    const updateButton = document.getElementById('updateButton');
    const cancelButton = document.getElementById('cancelButton');

    let products = [];

    // Carregar produtos do Firebase na inicialização
    db.collection('products').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            products.push({ id: doc.id, ...doc.data() });
        });
        updateProductList();
    });

    // Event listener para o formulário de adicionar/editar produto
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const productId = productIdInput.value;
            const productName = productNameInput.value;
            const productPrice = parseFloat(productPriceInput.value);

            if (productId) {
                // Editar produto existente
                db.collection('products').doc(productId).update({
                    name: productName,
                    price: productPrice
                }).then(() => {
                    const productIndex = products.findIndex(product => product.id === productId);
                    products[productIndex] = { id: productId, name: productName, price: productPrice };
                    updateProductList();
                    productForm.reset();
                }).catch(error => {
                    console.error('Erro ao atualizar produto:', error);
                });
            } else {
                // Adicionar novo produto
                db.collection('products').add({
                    name: productName,
                    price: productPrice
                }).then(() => {
                    products.push({ name: productName, price: productPrice });
                    updateProductList();
                    productForm.reset();
                }).catch(error => {
                    console.error('Erro ao adicionar novo produto:', error);
                });
            }
        });
    }

    // Event listener para abrir o popup de edição
    if (productList) {
        productList.addEventListener('click', function(e) {
            if (e.target.classList.contains('edit')) {
                const productId = e.target.dataset.id;
                const product = products.find(product => product.id === productId);
                popupProductIdInput.value = productId;
                popupProductNameInput.value = product.name;
                popupProductPriceInput.value = product.price;
                editPopup.classList.add('active');
            } else if (e.target.classList.contains('delete')) {
                const productId = e.target.dataset.id;
                db.collection('products').doc(productId).delete().then(() => {
                    products = products.filter(product => product.id !== productId);
                    updateProductList();
                }).catch(error => {
                    console.error('Erro ao excluir o produto:', error);
                });
            }
        });
    }

    // Event listener para o botão de atualizar dentro do popup
    if (updateButton) {
        updateButton.addEventListener('click', function() {
            const productId = popupProductIdInput.value;
            const productName = popupProductNameInput.value;
            const productPrice = parseFloat(popupProductPriceInput.value);

            db.collection('products').doc(productId).update({
                name: productName,
                price: productPrice
            }).then(() => {
                const productIndex = products.findIndex(product => product.id === productId);
                products[productIndex] = { id: productId, name: productName, price: productPrice };
                updateProductList();
                editPopup.classList.remove('active');
            }).catch(error => {
                console.error('Erro ao atualizar produto:', error);
            });
        });
    }

    // Event listener para cancelar a edição
    if (cancelButton) {
        cancelButton.addEventListener('click', function() {
            editPopup.classList.remove('active');
        });
    }

    // Função para atualizar a lista de produtos na interface
    function updateProductList() {
        if (productList) {
            productList.innerHTML = '';
            products.forEach((product) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    ${product.name} - R$${product.price.toFixed(2)}
                    <span class="actions">
                        <i class="material-icons edit" data-id="${product.id}">edit</i>
                        <i class="material-icons delete" data-id="${product.id}">delete</i>
                    </span>
                `;
                productList.appendChild(li);
            });
        }
    }
});
