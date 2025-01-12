document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const sidebar = document.getElementById('sidebar');
    const navButtons = document.querySelectorAll('.nav-button');
    const sections = document.querySelectorAll('main > section');
    const productList = document.getElementById('productList');
    const totalAmount = document.getElementById('totalAmount');
    const purchaseHistory = document.getElementById('purchaseHistory');
    const addProductModal = document.getElementById('addProductModal');
    const myListModal = document.getElementById('myListModal');
    const budgetModal = document.getElementById('budgetModal');
    const discountModal = document.getElementById('discountModal');
    const taxModal = document.getElementById('taxModal');
    const shareModal = document.getElementById('shareModal');
    const exportModal = document.getElementById('exportModal');
    const helpModal = document.getElementById('helpModal');
    const userModal = document.getElementById('userModal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const addProductForm = document.getElementById('addProductForm');
    const myListForm = document.getElementById('myListForm');
    const myListItems = document.getElementById('myListItems');
    const myListModalItems = document.getElementById('myListModalItems');
    const budgetForm = document.getElementById('budgetForm');
    const discountForm = document.getElementById('discountForm');
    const taxForm = document.getElementById('taxForm');
    const calcDisplay = document.getElementById('calcDisplay');
    const addToListBtn = document.getElementById('addToListBtn');
    const calculator = document.getElementById('calculator');
    const productSearch = document.getElementById('product-search');
    const applyDiscountBtn = document.getElementById('applyDiscountBtn');
    const applyTaxBtn = document.getElementById('applyTaxBtn');
    const setBudgetBtn = document.getElementById('setBudgetBtn');
    const savePurchaseBtn = document.getElementById('savePurchaseBtn');
    const shareListBtn = document.getElementById('shareListBtn');
    const exportDataBtn = document.getElementById('exportDataBtn');
    const openUserModal = document.getElementById('openUserModal');
    const openHelpModal = document.getElementById('openHelpModal');
    const quickAddProduct = document.getElementById('quickAddProduct');
    const quickViewList = document.getElementById('quickViewList');
    const openMyListModal = document.getElementById('openMyListModal');
    const purchaseModal = document.getElementById('purchaseModal');
    const editProductModal = document.getElementById('editProductModal');
    const editProductForm = document.getElementById('editProductForm');

    // Estado
    let products = JSON.parse(localStorage.getItem('products')) || [];
    let myList = JSON.parse(localStorage.getItem('myList')) || [];
    let purchases = JSON.parse(localStorage.getItem('purchases')) || [];
    let budget = parseFloat(localStorage.getItem('budget')) || 0;
    let currentTotal = 0;

    // Navegação
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.dataset.target;
            if (target === 'home') {
                sections.forEach(section => {
                    section.classList.remove('hidden');
                });
            } else {
                sections.forEach(section => {
                    section.classList.toggle('hidden', section.id !== target);
                });
            }
        });
    });

    // Funções de atualização da UI
    function updateProductList() {
        productList.innerHTML = '';
        let total = 0;
        products.forEach((product, index) => {
            const li = createProductListItem(product, index);
            productList.appendChild(li);
            total += product.price * product.quantity;
        });
        totalAmount.textContent = `R$ ${total.toFixed(2)}`;
        document.getElementById('itemCount').textContent = products.length;
        document.getElementById('estimatedTotal').textContent = total.toFixed(2);
        document.getElementById('currentBudget').textContent = budget.toFixed(2);
        checkBudget(total);
        currentTotal = total;
        saveToLocalStorage();
    }

    function createProductListItem(product, index) {
        const li = document.createElement('li');
        li.className = 'flex items-center justify-between bg-dark-300 p-4 rounded-lg transition-all duration-200 hover:bg-dark-100 animate-slide-in';
        li.innerHTML = `
            <div class="flex items-center">
                <span class="text-2xl mr-3">${product.emoji}</span>
                <div>
                    <h3 class="font-semibold text-gray-100">${product.name}</h3>
                    <p class="text-sm text-gray-400">${product.category}</p>
                </div>
            </div>
            <div class="flex items-center space-x-4">
                <span class="font-semibold text-gray-100">R$ ${product.price.toFixed(2)}</span>
                <div class="flex items-center space-x-2">
                    <button class="text-gray-400 hover:text-primary-400 transition-colors duration-200 decrease-quantity" data-index="${index}">
                        <i class="fas fa-minus-circle"></i>
                    </button>
                    <span class="text-gray-100 quantity">${product.quantity}</span>
                    <button class="text-gray-400 hover:text-primary-400 transition-colors duration-200 increase-quantity" data-index="${index}">
                        <i class="fas fa-plus-circle"></i>
                    </button>
                </div>
                <button class="text-gray-400 hover:text-primary-400 transition-colors duration-200 edit-product" data-index="${index}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="text-gray-400 hover:text-red-500 transition-colors duration-200 remove-product" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        return li;
    }

    function createMyListItem(item, index) {
        const li = document.createElement('li');
        li.className = 'flex items-center justify-between bg-dark-300 p-3 rounded-lg hover:bg-dark-100 transition-all duration-200 cursor-pointer';
        li.dataset.index = index;
        li.innerHTML = `
            <div class="flex items-center flex-1">
                <input type="checkbox" class="mr-2 cursor-pointer" ${item.checked ? 'checked' : ''} data-index="${index}">
                <div class="flex items-center flex-1" data-action="edit">
                    <span class="text-lg mr-2">${item.emoji}</span>
                    <span class="flex-1">${item.name} (${item.quantity}x)</span>
                </div>
            </div>
            <div class="flex items-center space-x-3">
                <button class="text-gray-400 hover:text-primary-400 transition-colors duration-200 edit-list-item p-1" data-index="${index}" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="text-gray-400 hover:text-primary-400 transition-colors duration-200 add-to-shopping-list p-1" data-index="${index}" title="Adicionar à Lista de Compras">
                    <i class="fas fa-cart-plus"></i>
                </button>
                <button class="text-gray-400 hover:text-red-500 transition-colors duration-200 remove-item p-1" data-index="${index}" title="Remover">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        li.addEventListener('click', (e) => {
            if (!e.target.closest('button') && !e.target.closest('input[type="checkbox"]')) {
                openEditListItemModal(index);
            }
        });

        const buttons = li.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });

        const checkbox = li.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        return li;
    }

    function setupListItemEvents() {
        document.querySelectorAll('#myListItems input[type="checkbox"], #myListModalItems input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const index = parseInt(e.target.dataset.index);
                myList[index].checked = e.target.checked;
                updateMyList();
            });
        });

        document.querySelectorAll('.edit-list-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.closest('[data-index]').dataset.index);
                openEditListItemModal(index);
            });
        });

        document.querySelectorAll('.add-to-shopping-list').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.closest('[data-index]').dataset.index);
            });
        });

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.closest('[data-index]').dataset.index);
                myList.splice(index, 1);
                updateMyList();
                showAlert('Item removido com sucesso!', 'success');
            });
        });
    }

    function updateMyList() {
        myListItems.innerHTML = '';
        myListModalItems.innerHTML = '';
        myList.forEach((item, index) => {
            const li = createMyListItem(item, index);
            myListItems.appendChild(li.cloneNode(true));
            myListModalItems.appendChild(li);
        });
        setupListItemEvents();
        saveToLocalStorage();
    }

    function updatePurchaseHistory() {
        purchaseHistory.innerHTML = '';
        purchases.forEach((purchase, index) => {
            const li = document.createElement('li');
            li.className = 'bg-dark-300 p-4 rounded-lg transition-all duration-200 hover:bg-dark-100 cursor-pointer animate-slide-in';
            li.innerHTML = `
                <div class="flex justify-between items-center">
                    <span class="font-semibold text-gray-100">Compra #${purchase.id}</span>
                    <span class="text-sm text-gray-400">${purchase.date}</span>
                </div>
                <p class="mt-2 text-gray-300">Total: R$ ${purchase.total.toFixed(2)}</p>
                <div class="flex justify-between items-center mt-2">
                    <p class="text-sm text-primary-400 cursor-pointer view-details" data-index="${index}">Ver detalhes</p>
                    <button class="text-red-500 hover:text-red-600 transition-colors duration-200 delete-purchase" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            purchaseHistory.appendChild(li);
        });

        // Add event listeners for view details and delete buttons
        purchaseHistory.querySelectorAll('.view-details').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                showPurchaseDetails(index);
            });
        });

        purchaseHistory.querySelectorAll('.delete-purchase').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.closest('.delete-purchase').dataset.index;
                deletePurchase(index);
            });
        });
    }

    function updateSpendingChart() {
        const ctx = document.getElementById('spendingChart').getContext('2d');
        const monthlyData = getMonthlySpendingData();
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: monthlyData.map(d => d.month),
                datasets: [{
                    label: 'Gastos Mensais',
                    data: monthlyData.map(d => d.total),
                    backgroundColor: 'rgba(123, 94, 154, 0.7)',
                    borderColor: 'rgba(123, 94, 154, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value, index, values) {
                                return 'R$ ' + value.toFixed(2);
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'R$ ' + context.parsed.y.toFixed(2);
                            }
                        }
                    }
                }
            }
        });

        updateSpendingSummary(monthlyData);
    }

    function updateSpendingSummary(monthlyData) {
        const summaryList = document.getElementById('spendingSummary');
        
        summaryList.innerHTML = '';
        const totalSpending = monthlyData.reduce((sum, month) => sum + month.total, 0);
        const averageSpending = totalSpending / monthlyData.length;
        const highestMonth = monthlyData.reduce((max, month) => month.total > max.total ? month : max);
        const lowestMonth = monthlyData.reduce((min, month) => month.total < min.total ? month : min);

        const summaryItems = [
            { label: 'Total Gasto', value: `R$ ${totalSpending.toFixed(2)}` },
            { label: 'Média Mensal', value: `R$ ${averageSpending.toFixed(2)}` },
            { label: 'Mês com Maior Gasto', value: `${highestMonth.month}: R$ ${highestMonth.total.toFixed(2)}` },
            { label: 'Mês com Menor Gasto', value: `${lowestMonth.month}: R$ ${lowestMonth.total.toFixed(2)}` }
        ];

        summaryItems.forEach(item => {
            const li = document.createElement('li');
            li.className = 'flex justify-between items-center';
            li.innerHTML = `
                <span class="text-gray-300">${item.label}:</span>
                <span class="font-semibold text-primary-300">${item.value}</span>
            `;
            summaryList.appendChild(li);
        });
    }

    function getMonthlySpendingData() {
        const monthlyData = {};
        purchases.forEach(purchase => {
            const date = new Date(purchase.date);
            const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
            if (!monthlyData[monthYear]) {
                monthlyData[monthYear] = 0;
            }
            monthlyData[monthYear] += purchase.total;
        });

        return Object.entries(monthlyData).map(([month, total]) => ({ month, total }));
    }

    // Event Listeners
    addProductForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addProductToList(addProductForm);
        closeModal(addProductModal);
    });

    myListForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addItemToMyList();
        closeModal(myListModal);
    });

    productList.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;

        const index = button.dataset.index;
        if (index !== undefined) {
            if (button.classList.contains('decrease-quantity')) {
                if (products[index].quantity > 1) {
                    products[index].quantity--;
                }
            } else if (button.classList.contains('increase-quantity')) {
                products[index].quantity++;
            } else if (button.classList.contains('remove-product')) {
                products.splice(index, 1);
            }
            updateProductList();
        }
    });

    myListItems.addEventListener('click', handleMyListItemClick);
    myListModalItems.addEventListener('click', handleMyListItemClick);

    function handleMyListItemClick(e) {
        const checkbox = e.target.closest('input[type="checkbox"]');
        const addToShoppingListBtn = e.target.closest('.add-to-shopping-list');
        const removeItemBtn = e.target.closest('.remove-item');

        if (checkbox) {
            const index = checkbox.dataset.index;
            myList[index].checked = checkbox.checked;
            saveToLocalStorage();
            updateMyList();
        } else if (addToShoppingListBtn) {
            const index = parseInt(addToShoppingListBtn.dataset.index);
            const item = myList[index];
            
            // Adiciona diretamente ao array de produtos
            if (item) {
                products.push({
                    name: item.name,
                    price: 0,
                    quantity: item.quantity || 1,
                    category: item.category || 'Geral',
                    emoji: item.emoji || '🛒'
                });
                updateProductList();
                saveToLocalStorage();
                showAlert('Produto adicionado à lista de compras!', 'success');
            }
        } else if (removeItemBtn) {
            const index = removeItemBtn.dataset.index;
            myList.splice(index, 1);
            updateMyList();
            showAlert('Item removido da sua lista!', 'success');
        }
    }

    purchaseHistory.addEventListener('click', (e) => {
        const viewDetailsBtn = e.target.closest('.view-details');
        const deletePurchaseBtn = e.target.closest('.delete-purchase');
        
        if (viewDetailsBtn) {
            const index = viewDetailsBtn.dataset.index;
            showPurchaseDetails(index);
        } else if (deletePurchaseBtn) {
            const index = deletePurchaseBtn.dataset.index;
            deletePurchase(index);
        }
    });

    productSearch.addEventListener('input', () => {
        const searchTerm = productSearch.value.toLowerCase();
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
        updateProductList(filteredProducts);
    });

    applyDiscountBtn.addEventListener('click', () => showModal(discountModal));
    applyTaxBtn.addEventListener('click', () => showModal(taxModal));
    setBudgetBtn.addEventListener('click', () => showModal(budgetModal));
    savePurchaseBtn.addEventListener('click', savePurchase);
    shareListBtn.addEventListener('click', shareList);
    exportDataBtn.addEventListener('click', () => showModal(exportModal));

    openHelpModal.addEventListener('click', () => showModal(helpModal));
    openUserModal.addEventListener('click', () => showModal(userModal));
    openMyListModal.addEventListener('click', () => showModal(myListModal));

    quickAddProduct.addEventListener('click', () => showModal(addProductModal));
    quickViewList.addEventListener('click', () => {
        updateMyList();
        showModal(myListModal);
    });

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            closeModal(button.closest('.fixed'));
        });
    });

    // Calculadora Inteligente
    calculator.addEventListener('click', (e) => {
        if (e.target.classList.contains('calc-btn')) {
            const value = e.target.textContent;
            if (value === 'C') {
                calcDisplay.value = '';
            } else if (value === '=') {
                try {
                    calcDisplay.value = eval(calcDisplay.value);
                } catch (error) {
                    calcDisplay.value = 'Error';
                }
            } else {
                calcDisplay.value += value;
            }
        }
    });

    addToListBtn.addEventListener('click', () => {
        const result = parseFloat(calcDisplay.value);
        if (!isNaN(result)) {
            addProductForm.price.value = result.toFixed(2);
            showModal(addProductModal);
        }
    });

    // Funções auxiliares
    function addProductToList(form) {
        const name = form.name?.value || form.name;
        const price = parseFloat(form.price?.value || 0);
        const quantity = parseInt(form.quantity?.value || 1);
        const category = form.category?.value || 'Geral';
        const emoji = form.category?.selectedOptions?.[0]?.textContent.split(' ')[0] || '🛒';

        if (name) {
            products.push({ 
                name, 
                price: price || 0, 
                quantity: quantity || 1, 
                category: category || 'Geral', 
                emoji: emoji || '🛒' 
            });
            updateProductList();
            if (form.reset) form.reset();
            showAlert('Produto adicionado com sucesso!', 'success');
        } else {
            showAlert('Por favor, insira pelo menos o nome do produto.', 'error');
        }
    }

    function addItemToMyList() {
        const name = myListForm.name.value;
        const quantity = parseInt(myListForm.quantity.value) || 1;
        const category = myListForm.category.value || 'Geral';
        const emoji = myListForm.category.selectedOptions[0]?.textContent.split(' ')[0] || '🛒';

        if (name) {
            myList.push({ name, quantity, category, emoji, checked: false });
            updateMyList();
            myListForm.reset();
            showAlert('Item adicionado à sua lista!', 'success');
        } else {
            showAlert('Por favor, insira pelo menos o nome do item.', 'error');
        }
    }

    function showModal(modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    function closeModal(modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }

    function showAlert(message, type) {
        const alertContainer = document.getElementById('alertContainer');
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert p-4 rounded-lg text-white ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} animate-fade-in`;
        alertDiv.textContent = message;
        alertContainer.appendChild(alertDiv);
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }

    function saveToLocalStorage() {
        localStorage.setItem('products', JSON.stringify(products));
        localStorage.setItem('myList', JSON.stringify(myList));
        localStorage.setItem('purchases', JSON.stringify(purchases));
        localStorage.setItem('budget', budget.toString());
    }

    function showPurchaseDetails(index) {
        const purchase = purchases[index];
        const details = document.getElementById('purchaseDetails');
        details.innerHTML = `
            <p class="mb-2"><strong>Data:</strong> ${purchase.date}</p>
            <p class="mb-2"><strong>Total:</strong> R$ ${purchase.total.toFixed(2)}</p>
            <h4 class="font-semibold mb-2">Itens:</h4>
            <ul class="space-y-2">
                ${purchase.items.map(item => `
                    <li class="flex justify-between">
                        <span>${item.emoji} ${item.name}</span>
                        <span>R$ ${(item.price * item.quantity).toFixed(2)} (${item.quantity}x)</span>
                    </li>
                `).join('')}
            </ul>
        `;
        showModal(purchaseModal);
    }

    function deletePurchase(index) {
        purchases.splice(index, 1);
        updatePurchaseHistory();
        saveToLocalStorage();
        showAlert('Compra removida com sucesso!', 'success');
    }

    function savePurchase() {
        if (products.length === 0) {
            showAlert('Adicione produtos à lista antes de salvar a compra.', 'error');
            return;
        }
        const purchase = {
            id: purchases.length + 1,
            date: new Date().toLocaleDateString(),
            total: currentTotal,
            items: [...products]
        };
        purchases.push(purchase);
        products = [];
        updateProductList();
        updatePurchaseHistory();
        showAlert('Compra salva com sucesso!', 'success');
        saveToLocalStorage();
    }

    function shareList() {
        const listText = products.map(p => `${p.emoji} ${p.name} (${p.quantity}x) - R$ ${(p.price * p.quantity).toFixed(2)}`).join('\n');
        const shareText = `Minha lista de compras:\n\n${listText}\n\nTotal: R$ ${currentTotal.toFixed(2)}`;
        
        document.getElementById('shareText').value = shareText;
        showModal(shareModal);
    }

    document.getElementById('copyShareTextBtn').addEventListener('click', () => {
        const shareText = document.getElementById('shareText');
        shareText.select();
        document.execCommand('copy');
        showAlert('Lista copiada para a área de transferência!', 'success');
    });

    document.getElementById('exportExcelBtn').addEventListener('click', () => {
        const data = [
            ['Nome', 'Preço', 'Quantidade', 'Categoria', 'Total'],
            ...products.map(p => [p.name, p.price, p.quantity, p.category, p.price * p.quantity])
        ];
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Lista de Compras');
        XLSX.writeFile(wb, 'my_market_pro_data.xlsx');
        showAlert('Dados exportados para Excel com sucesso!', 'success');
        closeModal(exportModal);
    });

    document.getElementById('exportJSONBtn').addEventListener('click', () => {
        const data = {
            products: products,
            purchases: purchases,
            budget: budget
        };
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "my_market_pro_data.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        showAlert('Dados exportados para JSON com sucesso!', 'success');
        closeModal(exportModal);
    });

    // Implementação das novas funcionalidades
    budgetForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newBudget = parseFloat(budgetForm.budget.value);
        if (!isNaN(newBudget) && newBudget >= 0) {
            budget = newBudget;
            updateProductList();
            closeModal(budgetModal);
            showAlert('Orçamento definido com sucesso!', 'success');
        } else {
            showAlert('Por favor, insira um valor numérico válido.', 'error');
        }
    });

    discountForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const discountPercentage = parseFloat(discountForm.discount.value);
        if (!isNaN(discountPercentage) && discountPercentage >= 0 && discountPercentage <= 100) {
            applyDiscount(discountPercentage);
            closeModal(discountModal);
            showAlert('Desconto aplicado com sucesso!', 'success');
        } else {
            showAlert('Por favor, insira um valor percentual válido entre 0 e 100.', 'error');
        }
    });

    taxForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taxPercentage = parseFloat(taxForm.tax.value);
        if (!isNaN(taxPercentage) && taxPercentage >= 0) {
            applyTax(taxPercentage);
            closeModal(taxModal);
            showAlert('Acréscimo aplicado com sucesso!', 'success');
        } else {
            showAlert('Por favor, insira um valor percentual válido.', 'error');
        }
    });

    function applyDiscount(percentage) {
        products.forEach(product => {
            product.price -= (product.price * (percentage / 100));
        });
        updateProductList();
    }

    function applyTax(percentage) {
        products.forEach(product => {
            product.price += (product.price * (percentage / 100));
        });
        updateProductList();
    }

    function checkBudget(total) {
        if (budget > 0 && total > budget) {
            showAlert('Você ultrapassou o orçamento!', 'warning');
        }
    }

    // Adicionar função para abrir o modal de edição
    function openEditProductModal(index) {
        const product = products[index];
        document.getElementById('editProductIndex').value = index;
        document.getElementById('editProductName').value = product.name;
        document.getElementById('editProductPrice').value = product.price;
        document.getElementById('editProductQuantity').value = product.quantity;
        document.getElementById('editProductCategory').value = product.category;
        showModal(editProductModal);
    }

    // Adicionar evento de clique para o botão de editar
    productList.addEventListener('click', (e) => {
        if (e.target.closest('.edit-product')) {
            const index = e.target.closest('.edit-product').dataset.index;
            openEditProductModal(index);
        }
    });

    // Adicionar evento de submit para o formulário de edição
    editProductForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const index = parseInt(document.getElementById('editProductIndex').value);
        const name = document.getElementById('editProductName').value;
        const price = parseFloat(document.getElementById('editProductPrice').value);
        const quantity = parseInt(document.getElementById('editProductQuantity').value);
        const category = document.getElementById('editProductCategory').value;
        const emoji = document.getElementById('editProductCategory').selectedOptions[0]?.textContent.split(' ')[0] || '🛒';

        if (name && !isNaN(price) && !isNaN(quantity) && quantity > 0) {
            products[index] = {
                name,
                price,
                quantity,
                category,
                emoji
            };
            updateProductList();
            closeModal(editProductModal);
            showAlert('Produto atualizado com sucesso!', 'success');
        } else {
            showAlert('Por favor, preencha todos os campos corretamente.', 'error');
        }
    });

    // Adicionar função para abrir o modal de edição para itens da lista
    function openEditListItemModal(index) {
        const item = myList[index];
        document.getElementById('editProductIndex').value = index;
        document.getElementById('editProductName').value = item.name;
        document.getElementById('editProductQuantity').value = item.quantity;
        document.getElementById('editProductCategory').value = item.category;
        // Limpar o preço já que não é usado na lista
        document.getElementById('editProductPrice').value = '';
        showModal(editProductModal);
    }

    // Adicionar evento de clique para o botão de editar na lista
    myListItems.addEventListener('click', (e) => {
        if (e.target.closest('.edit-list-item')) {
            const index = e.target.closest('.edit-list-item').dataset.index;
            openEditListItemModal(index);
        }
    });

    myListModalItems.addEventListener('click', (e) => {
        if (e.target.closest('.edit-list-item')) {
            const index = e.target.closest('.edit-list-item').dataset.index;
            openEditListItemModal(index);
        }
    });

    // Modificar o evento de submit do formulário de edição para suportar lista
    editProductForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const index = parseInt(document.getElementById('editProductIndex').value);
        const name = document.getElementById('editProductName').value;
        const price = parseFloat(document.getElementById('editProductPrice').value);
        const quantity = parseInt(document.getElementById('editProductQuantity').value);
        const category = document.getElementById('editProductCategory').value;
        const emoji = document.getElementById('editProductCategory').selectedOptions[0]?.textContent.split(' ')[0] || '🛒';

        // Verifica se está editando um item da lista ou um produto
        if (document.activeElement.closest('#myListItems, #myListModalItems')) {
            if (name && !isNaN(quantity) && quantity > 0) {
                myList[index] = {
                    name,
                    quantity,
                    category,
                    emoji,
                    checked: myList[index].checked || false
                };
                updateMyList();
                closeModal(editProductModal);
                showAlert('Item da lista atualizado com sucesso!', 'success');
            } else {
                showAlert('Por favor, preencha todos os campos corretamente.', 'error');
            }
        } else {
            // Lógica existente para edição de produtos
            if (name && !isNaN(price) && !isNaN(quantity) && quantity > 0) {
                products[index] = {
                    name,
                    price,
                    quantity,
                    category,
                    emoji
                };
                updateProductList();
                closeModal(editProductModal);
                showAlert('Produto atualizado com sucesso!', 'success');
            } else {
                showAlert('Por favor, preencha todos os campos corretamente.', 'error');
            }
        }
    });

    // Inicialização
    updateProductList();
    updateMyList();
    updatePurchaseHistory();
    updateSpendingChart();
});
