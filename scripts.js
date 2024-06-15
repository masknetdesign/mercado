document.addEventListener('DOMContentLoaded', function() {
    const productForm = document.getElementById('productForm');
    const productNameInput = document.getElementById('productName');
    const productPriceInput = document.getElementById('productPrice');
    const productList = document.getElementById('productList');
    const productSelect = document.getElementById('productSelect');

    const orderForm = document.getElementById('orderForm');
    const orderQuantityInput = document.getElementById('orderQuantity');
    const orderList = document.getElementById('orderList');
    const orderTotalDisplay = document.getElementById('orderTotal');
    const completeOrderButton = document.getElementById('completeOrder');

    let products = [];
    let orders = [];

    // Adicionar evento para submeter o formulário de produto
    productForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const productName = productNameInput.value;
        const productPrice = parseFloat(productPriceInput.value);
        const mode = productForm.dataset.mode;

        // Verificar se estamos adicionando um novo produto ou editando um existente
        if (mode === 'edit') {
            const editIndex = parseInt(productForm.dataset.editIndex);
            if (productName && productPrice && editIndex >= 0) {
                // Atualizar o produto existente
                products[editIndex].name = productName;
                products[editIndex].price = productPrice;
                updateProductList();
                updateProductSelect();
                productForm.reset();
                productForm.removeAttribute('data-mode');
                productForm.removeAttribute('data-edit-index');
                productForm.querySelector('button[type="submit"]').textContent = 'Adicionar Produto';
            }
        } else {
            // Adicionar um novo produto
            if (productName && productPrice) {
                const product = { name: productName, price: productPrice };
                products.push(product);
                updateProductList();
                updateProductSelect();
                productForm.reset();
            }
        }
    });

    // Adicionar evento para clicar na lista de produtos para editar
    productList.addEventListener('click', function(e) {
        if (e.target.classList.contains('edit')) {
            const index = e.target.dataset.index;
            const product = products[index];
            productNameInput.value = product.name;
            productPriceInput.value = product.price;
            productForm.dataset.mode = 'edit';
            productForm.dataset.editIndex = index;
            productForm.querySelector('button[type="submit"]').textContent = 'Salvar Edição';
        }
    });

    // Adicionar evento para submeter o formulário de pedido
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const productIndex = productSelect.selectedIndex - 1;
        const orderQuantity = parseInt(orderQuantityInput.value);

        if (productIndex >= 0 && orderQuantity > 0) {
            const product = products[productIndex];
            const order = { ...product, quantity: orderQuantity };
            orders.push(order);
            updateOrderList();
            updateOrderTotal();
            orderForm.reset();
        }
    });

    // Adicionar eventos para manipulação da lista de pedidos
    orderList.addEventListener('click', function(e) {
        if (e.target.classList.contains('add')) {
            const index = e.target.dataset.index;
            orders[index].quantity++;
            updateOrderList();
            updateOrderTotal();
        } else if (e.target.classList.contains('subtract')) {
            const index = e.target.dataset.index;
            if (orders[index].quantity > 1) {
                orders[index].quantity--;
            } else {
                orders.splice(index, 1);
            }
            updateOrderList();
            updateOrderTotal();
        } else if (e.target.classList.contains('remove')) {
            const index = e.target.dataset.index;
            orders.splice(index, 1);
            updateOrderList();
            updateOrderTotal();
        }
    });

    // Adicionar evento para clicar no botão "Concluir Pedido"
    completeOrderButton.addEventListener('click', function() {
        if (orders.length === 0) {
            alert('Adicione produtos ao pedido antes de concluir.');
            return;
        }

        let message = 'Pedido de Mercado Online:%0A';
        let total = 0;
        orders.forEach((order) => {
            const itemTotal = order.price * order.quantity;
            total += itemTotal;
            message += `Produto: ${order.name} - Quantidade: ${order.quantity} - Total: R$${itemTotal.toFixed(2)}%0A`;
        });
        message += `Total do Pedido: R$${total.toFixed(2)}`;

        const whatsappUrl = `https://api.whatsapp.com/send?phone=SEU_NUMERO&text=${message}`;
        window.open(whatsappUrl, '_blank');
    });

    // Atualizar a lista de produtos na interface
    function updateProductList() {
        productList.innerHTML = '';
        products.forEach((product, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${product.name} - R$${product.price.toFixed(2)}
                <span class="actions">
                    <i class="material-icons edit" data-index="${index}">edit</i>
                </span>
            `;
            productList.appendChild(li);
        });
    }

    // Atualizar o menu de seleção de produtos no formulário de pedido
    function updateProductSelect() {
        productSelect.innerHTML = '<option value="">Selecione um Produto</option>';
        products.forEach((product, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = product.name;
            productSelect.appendChild(option);
        });
    }

    // Atualizar a lista de pedidos na interface
    function updateOrderList() {
        orderList.innerHTML = '';
        orders.forEach((order, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${order.name} - Quantidade: ${order.quantity} - Total: R$${(order.price * order.quantity).toFixed(2)}
                <span class="actions">
                    <i class="material-icons add" data-index="${index}">add_circle_outline</i>
                    <i class="material-icons subtract" data-index="${index}">remove_circle_outline</i>
                    <i class="material-icons remove" data-index="${index}">delete_outline</i>
                </span>
            `;
            orderList.appendChild(li);
        });
    }

    // Atualizar o total do pedido na interface
    function updateOrderTotal() {
        let total = 0;
        orders.forEach((order) => {
            total += order.price * order.quantity;
        });
        orderTotalDisplay.textContent = `Total: R$${total.toFixed(2)}`;
    }

});
