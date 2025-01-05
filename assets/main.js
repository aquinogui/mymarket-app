
let products = [];
let budget = 0;
let purchaseHistory = [];
const productList = document.getElementById('productList');
const totalAmount = document.getElementById('totalAmount');
const applyDiscountBtn = document.getElementById('applyDiscountBtn');
const setBudgetBtn = document.getElementById('setBudgetBtn');
const savePurchaseBtn = document.getElementById('savePurchaseBtn');
const productModal = document.getElementById('productModal');
const productForm = document.getElementById('productForm');
const closeModal = document.getElementById('closeModal');
const darkModeToggle = document.getElementById('darkModeToggle');
const purchaseHistoryList = document.getElementById('purchaseHistory');
const budgetAlert = document.getElementById('budgetAlert');
const calculator = document.getElementById('calculator');
const calcDisplay = document.getElementById('calcDisplay');
const addToListBtn = document.getElementById('addToListBtn');
const productSearch = document.getElementById('productSearch');
const helpBtn = document.getElementById('helpBtn');
const shareListBtn = document.getElementById('shareListBtn');
const exportDataBtn = document.getElementById('exportDataBtn');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const userAccountBtn = document.getElementById('userAccountBtn');
const compareBtn = document.getElementById('compareBtn');
const priceInput = document.getElementById('priceInput');
const quantityInput = document.getElementById('quantityInput');
const unitSelect = document.getElementById('unitSelect');
const comparisonResult = document.getElementById('comparisonResult');
const editProfileBtn = document.getElementById('editProfileBtn');
const upgradeAccountBtn = document.getElementById('upgradeAccountBtn');
const quickAddForm = document.getElementById('quickAddForm');
const userAccountModal = document.getElementById('userAccountModal');
const userAccountModalContent = document.getElementById('userAccountModalContent');
const closeUserAccountModal = document.getElementById('closeUserAccountModal');

// Load data from local storage
function loadFromLocalStorage() {
    const storedProducts = localStorage.getItem('myMarketProducts');
    if (storedProducts) {
        products = JSON.parse(storedProducts);
        updateProductList();
    }

    const storedBudget = localStorage.getItem('myMarketBudget');
    if (storedBudget) {
        budget = parseFloat(storedBudget);
    }

    const storedHistory = localStorage.getItem('myMarketHistory');
    if (storedHistory) {
        purchaseHistory = JSON.parse(storedHistory);
        updatePurchaseHistory();
    }
}

// Save data to local storage
function saveToLocalStorage() {
    localStorage.setItem('myMarketProducts', JSON.stringify(products));
    localStorage.setItem('myMarketBudget', budget.toString());
    localStorage.setItem('myMarketHistory', JSON.stringify(purchaseHistory));
}

// Dark mode toggle
darkModeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
    updateSpendingChart();
});

// Quick Add Product
quickAddForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('quickAddName').value;
    const price = parseFloat(document.getElementById('quickAddPrice').value);
    const quantity = parseInt(document.getElementById('quickAddQuantity').value);
    const category = document.getElementById('quickAddCategory').value;

    const newProduct = { id: Date.now().toString(), name, price, quantity, category };
    products.push(newProduct);
    updateProductList();
    saveToLocalStorage();
    quickAddForm.reset();

    Swal.fire({
        icon: 'success',
        title: 'Produto Adicionado',
        text: 'O novo produto foi adicionado à sua lista!',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
    });
});

// Add/Edit Product
productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('productId').value;
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const quantity = parseInt(document.getElementById('productQuantity').value);
    const category = document.getElementById('productCategory').value;

    if (id) {
        // Edit existing product
        const index = products.findIndex(p => p.id === id);
        products[index] = { id, name, price, quantity, category };
        Swal.fire({
            icon: 'success',
            title: 'Produto Atualizado',
            text: 'O produto foi atualizado com sucesso!',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
        });
    } else {
        // Add new product
        const newProduct = { id: Date.now().toString(), name, price, quantity, category };
        products.push(newProduct);
        Swal.fire({
            icon: 'success',
            title: 'Produto Adicionado',
            text: 'O novo produto foi adicionado à sua lista!',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
        });
    }

    updateProductList();
    productModal.classList.add('hidden');
    productForm.reset();
    saveToLocalStorage();
});

// Update product list
function updateProductList() {
    productList.innerHTML = '';
    let total = 0;

    products.forEach(product => {
        const li = document.createElement('li');
        li.className = 'flex items-center justify-between border-b pb-2 animate-fade-in';
        li.innerHTML = `
            <div>
                <span class="font-semibold">${product.name}</span>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                    R$ ${product.price.toFixed(2)} x ${product.quantity} = R$ ${(product.price * product.quantity).toFixed(2)}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">${product.category}</div>
            </div>
            <div class="flex items-center">
                <button onclick="editProduct('${product.id}')" class="text-blue-500 hover:text-blue-700 mr-2 transition-colors duration-200">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="removeProduct('${product.id}')" class="text-red-500 hover:text-red-700 transition-colors duration-200">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        productList.appendChild(li);
        total += product.price * product.quantity;
    });

    totalAmount.textContent = `R$ ${total.toFixed(2)}`;
    checkBudget(total);
}

// Edit product
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productQuantity').value = product.quantity;
        document.getElementById('productCategory').value = product.category;
        openProductModal();
    }
}

// Remove product
function removeProduct(id) {
    Swal.fire({
        title: 'Tem certeza?',
        text: "Você não poderá reverter esta ação!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, remover!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            products = products.filter(p => p.id !== id);
            updateProductList();
            saveToLocalStorage();
            Swal.fire(
                'Removido!',
                'O produto foi removido da sua lista.',
                'success'
            )
        }
    })
}

// Apply discount/surcharge
applyDiscountBtn.addEventListener('click', () => {
    Swal.fire({
        title: 'Aplicar Desconto/Acréscimo',
        input: 'number',
        inputLabel: 'Digite a porcentagem (negativo para desconto, positivo para acréscimo)',
        inputPlaceholder: 'Ex: -10 para 10% de desconto',
        showCancelButton: true,
        confirmButtonText: 'Aplicar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
            if (!value) {
                return 'Você precisa inserir um valor!'
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const percentage = parseFloat(result.value);
            const factor = 1 + (percentage / 100);
            products = products.map(p => ({
                ...p,
                price: p.price * factor
            }));
            updateProductList();
            saveToLocalStorage();
            Swal.fire('Sucesso!', `${percentage > 0 ? 'Acréscimo' : 'Desconto'} de ${Math.abs(percentage)}% aplicado.`, 'success');
        }
    });
});

// Set budget
setBudgetBtn.addEventListener('click', () => {
    Swal.fire({
        title: 'Definir Orçamento',
        input: 'number',
        inputLabel: 'Digite o valor do orçamento',
        inputPlaceholder: 'Ex: 500',
        showCancelButton: true,
        confirmButtonText: 'Definir',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
            if (!value) {
                return 'Você precisa inserir um valor!'
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            budget = parseFloat(result.value);
            checkBudget(parseFloat(totalAmount.textContent.replace('R$ ', '')));
            saveToLocalStorage();
            Swal.fire('Sucesso!', `Orçamento definido para R$ ${budget.toFixed(2)}.`, 'success');
        }
    });
});

// Check budget
function checkBudget(total) {
    if (budget > 0) {
        const percentage = (total / budget) * 100;
        let message = '';
        let icon = '';

        if (percentage > 100) {
            message = `Você ultrapassou o limite do orçamento de R$ ${budget.toFixed(2)}!`;
            icon = 'error';
        } else if (percentage > 90) {
            message = `Você está próximo do limite do orçamento de R$ ${budget.toFixed(2)}!`;
            icon = 'warning';
        } else if (percentage > 75) {
            message = `Você já utilizou mais de 75% do seu orçamento de R$ ${budget.toFixed(2)}.`;
            icon = 'info';
        }

        if (message) {
            budgetAlert.classList.remove('hidden');
            budgetAlert.innerHTML = `
                <p class="font-bold">Alerta de Orçamento</p>
                <p>${message}</p>
                <div class="mt-2 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div class="bg-blue-600 h-2.5 rounded-full" style="width: ${Math.min(percentage, 100)}%"></div>
                </div>
            `;
            Swal.fire({
                title: 'Alerta de Orçamento',
                text: message,
                icon: icon,
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 5000,
                timerProgressBar: true,
            });
        } else {
            budgetAlert.classList.add('hidden');
        }
    }
}

// Save purchase to history
savePurchaseBtn.addEventListener('click', () => {
    const date = new Date().toLocaleString();
    const total = parseFloat(totalAmount.textContent.replace('R$ ', ''));
    const purchase = {
        date,
        total,
        itemCount: products.length,
        items: [...products]
    };
    purchaseHistory.unshift(purchase);
    updatePurchaseHistory();

    // Clear current purchase
    products = [];
    updateProductList();
    saveToLocalStorage();

    Swal.fire({
        title: 'Compra Salva!',
        text: `Sua compra de R$ ${total.toFixed(2)} foi salva no histórico.`,
        icon: 'success',
        confirmButtonText: 'OK'
    });

    updateSpendingChart();
});

function updatePurchaseHistory() {
    purchaseHistoryList.innerHTML = '';
    purchaseHistory.forEach((purchase, index) => {
        const historyItem = document.createElement('li');
        historyItem.className = 'border-b pb-2 animate-fade-in';
        historyItem.innerHTML = `
            <div class="flex justify-between items-center">
                <span class="font-semibold">${purchase.date}</span>
                <span class="text-primary dark:text-secondary">R$ ${purchase.total.toFixed(2)}</span>
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">${purchase.itemCount} itens</div>
            <button class="text-xs text-blue-500 hover:text-blue-700 mt-1" onclick="showPurchaseDetails(${index})">Ver detalhes</button>
        `;
        purchaseHistoryList.appendChild(historyItem);
    });
    saveToLocalStorage();
}

function showPurchaseDetails(index) {
    const purchase = purchaseHistory[index];
    let detailsHtml = '<div class="space-y-2">';
    purchase.items.forEach(item => {
        detailsHtml += `
            <div class="flex justify-between items-center">
                <span>${item.name}</span>
                <span>R$ ${item.price.toFixed(2)} x ${item.quantity}</span>
            </div>
        `;
    });
    detailsHtml += `
        <div class="border-t pt-2 mt-2">
            <div class="flex justify-between items-center font-bold">
                <span>Total:</span>
                <span>R$ ${purchase.total.toFixed(2)}</span>
            </div>
        </div>
    </div>`;

    Swal.fire({
        title: `Detalhes da Compra (${purchase.date})`,
        html: detailsHtml,
        icon: 'info',
        confirmButtonText: 'Fechar'
    });
}

// Calculator functionality
let currentCalc = '';

calculator.addEventListener('click', (e) => {
    if (e.target.classList.contains('calc-btn')) {
        const value = e.target.textContent;
        
        if (value === 'C') {
            currentCalc = '';
        } else if (value === '=') {
            try {
                currentCalc = eval(currentCalc).toString();
            } catch (error) {
                currentCalc = 'Error';
            }
        } else {
            currentCalc += value;
        }
        
        calcDisplay.value = currentCalc;
    }
});

addToListBtn.addEventListener('click', () => {
    const calculatedValue = parseFloat(calcDisplay.value);
    if (!isNaN(calculatedValue)) {
        document.getElementById('productPrice').value = calculatedValue.toFixed(2);
        openProductModal();
    }
});

// Open product modal
function openProductModal() {
    productModal.classList.remove('hidden');
    document.getElementById('productName').focus();
}

// Search functionality
productSearch.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        p.category.toLowerCase().includes(searchTerm)
    );
    updateFilteredProductList(filteredProducts);
});

// Update filtered product list
function updateFilteredProductList(filteredProducts) {
    productList.innerHTML = '';
    filteredProducts.forEach(product => {
        const li = document.createElement('li');
        li.className = 'flex items-center justify-between border-b pb-2 animate-fade-in';
        li.innerHTML = `
            <div>
                <span class="font-semibold">${product.name}</span>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                    R$ ${product.price.toFixed(2)} x ${product.quantity} = R$ ${(product.price * product.quantity).toFixed(2)}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">${product.category}</div>
            </div>
            <div class="flex items-center">
                <button onclick="editProduct('${product.id}')" class="text-blue-500 hover:text-blue-700 mr-2 transition-colors duration-200">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="removeProduct('${product.id}')" class="text-red-500 hover:text-red-700 transition-colors duration-200">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        productList.appendChild(li);
    });
}

// Event listener for category buttons
document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const category = btn.textContent.trim();
        const filteredProducts = products.filter(p => p.category === category);
        updateFilteredProductList(filteredProducts);
    });
});

// Help button
helpBtn.addEventListener('click', () => {
    Swal.fire({
        title: 'Bem-vindo ao My Market Pro!',
        html: `
       <div class="text-left">
                <p class="mb-4">Aqui estão algumas dicas para usar o app:</p>
                <ul class="list-disc pl-5 space-y-2">
                    <li>Adicione produtos à sua lista de compras usando o formulário no topo</li>
                    <li>Use a barra de pesquisa para encontrar produtos rapidamente</li>
                    <li>Filtre produtos por categoria usando os botões coloridos</li>
                    <li>Defina um orçamento para controlar seus gastos</li>
                    <li>Aplique descontos ou acréscimos em sua compra</li>
                    <li>Salve suas compras no histórico para análise futura</li>
                    <li>Compartilhe sua lista de compras com amigos e família</li>
                    <li>Visualize suas estatísticas de gastos no gráfico</li>
                </ul>
                <p class="mt-4 text-bold">Aproveite sua experiência de compras inteligente!</p>
            </div>
        `,
        icon: 'info',
        confirmButtonText: 'Entendi!'
    });
});

// Share list button
shareListBtn.addEventListener('click', () => {
    const listText = products.map(p => `${p.name} - R$ ${p.price.toFixed(2)} x ${p.quantity}`).join('\n');
    const shareData = {
        title: 'Minha Lista de Compras',
        text: `Confira minha lista de compras:\n\n${listText}\n\nTotal: ${totalAmount.textContent}`,
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData)
            .then(() => Swal.fire('Sucesso', 'Lista compartilhada com sucesso!', 'success'))
            .catch((error) => Swal.fire('Erro', 'Ocorreu um erro ao compartilhar a lista.', 'error'));
    } else {
        // Fallback for browsers that don't support Web Share API
        const socialShareUrls = {
            whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareData.text)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}&quote=${encodeURIComponent(shareData.text)}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`,
        };

        Swal.fire({
            title: 'Compartilhar Lista',
            html: `
                <div class="flex justify-center space-x-4">
                    <a href="${socialShareUrls.whatsapp}" target="_blank" class="text-green-500 hover:text-green-700">
                        <i class="fab fa-whatsapp fa-2x"></i>
                    </a>
                    <a href="${socialShareUrls.facebook}" target="_blank" class="text-blue-500 hover:text-blue-700">
                        <i class="fab fa-facebook fa-2x"></i>
                    </a>
                    <a href="${socialShareUrls.twitter}" target="_blank" class="text-blue-400 hover:text-blue-600">
                        <i class="fab fa-twitter fa-2x"></i>
                    </a>
                </div>
            `,
            showConfirmButton: false,
        });
    }
});

// Export data button
exportDataBtn.addEventListener('click', () => {
    const data = {
        products: products,
        purchaseHistory: purchaseHistory,
        budget: budget
    };

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Create sheets
    const productsSheet = XLSX.utils.json_to_sheet(products);
    const historySheet = XLSX.utils.json_to_sheet(purchaseHistory.map(p => ({
        date: p.date,
        total: p.total,
        itemCount: p.itemCount
    })));

    // Add sheets to workbook
    XLSX.utils.book_append_sheet(wb, productsSheet, "Produtos");
    XLSX.utils.book_append_sheet(wb, historySheet, "Histórico de Compras");

    // Save the workbook
    XLSX.writeFile(wb, "my_market_pro_data.xlsx");

    Swal.fire('Sucesso', 'Dados exportados com sucesso!', 'success');
});

// Clear history button
clearHistoryBtn.addEventListener('click', () => {
    Swal.fire({
        title: 'Tem certeza?',
        text: "Você não poderá recuperar o histórico depois de limpar!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, limpar!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            purchaseHistory = [];
            updatePurchaseHistory();
            updateSpendingChart();
            Swal.fire(
                'Limpo!',
                'Seu histórico de compras foi limpo.',
                'success'
            )
        }
    });
});

// User account button
userAccountBtn.addEventListener('click', () => {
    openUserAccountModal();
});

// Open user account modal
function openUserAccountModal() {
    userAccountModalContent.innerHTML = `
        <h4 class="text-lg font-semibold mb-4">Informações da Conta</h4>
        <p><strong>Nome:</strong> ${simulatedUser.name}</p>
        <p><strong>Email:</strong> ${simulatedUser.email}</p>
        <p><strong>Plano:</strong> ${simulatedUser.plan}</p>
        <h4 class="text-lg font-semibold mt-6 mb-4">Configurações da Conta</h4>
        <div class="space-y-2">
            <button id="changePasswordBtn" class="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200">
                Alterar Senha
            </button>
            <button id="notificationSettingsBtn" class="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-200">
                Configurações de Notificação
            </button>
            <button id="privacySettingsBtn" class="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors duration-200">
                Configurações de Privacidade
            </button>
        </div>
        <h4 class="text-lg font-semibold mt-6 mb-4">Suporte</h4>
        <button id="contactSupportBtn" class="w-full bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors duration-200">
            Contatar Suporte
        </button>
    `;
    userAccountModal.classList.remove('hidden');

    // Add event listeners for the new buttons
    document.getElementById('changePasswordBtn').addEventListener('click', changePassword);
    document.getElementById('notificationSettingsBtn').addEventListener('click', notificationSettings);
    document.getElementById('privacySettingsBtn').addEventListener('click', privacySettings);
    document.getElementById('contactSupportBtn').addEventListener('click', contactSupport);
}

// Close user account modal
closeUserAccountModal.addEventListener('click', () => {
    userAccountModal.classList.add('hidden');
});

// Change password function
function changePassword() {
    Swal.fire({
        title: 'Alterar Senha',
        html: `
            <input type="password" id="oldPassword" class="swal2-input" placeholder="Senha Atual">
            <input type="password" id="newPassword" class="swal2-input" placeholder="Nova Senha">
            <input type="password" id="confirmPassword" class="swal2-input" placeholder="Confirmar Nova Senha">
        `,
        focusConfirm: false,
        preConfirm: () => {
            const oldPassword = document.getElementById('oldPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            if (!oldPassword || !newPassword || !confirmPassword) {
                Swal.showValidationMessage('Por favor, preencha todos os campos');
            }
            if (newPassword !== confirmPassword) {
                Swal.showValidationMessage('As novas senhas não coincidem');
            }
            return { oldPassword, newPassword, confirmPassword }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // Here you would typically send this to your backend to process
            Swal.fire('Sucesso!', 'Sua senha foi alterada.', 'success');
        }
    });
}

// Notification settings function
function notificationSettings() {
    Swal.fire({
        title: 'Configurações de Notificação',
        html: `
            <div class="flex items-center justify-between mb-4">
                <label for="emailNotifications">Notificações por Email</label>
                <input type="checkbox" id="emailNotifications" class="swal2-checkbox">
            </div>
            <div class="flex items-center justify-between mb-4">
                <label for="pushNotifications">Notificações Push</label>
                <input type="checkbox" id="pushNotifications" class="swal2-checkbox">
            </div>
            <div class="flex items-center justify-between">
                <label for="smsNotifications">Notificações por SMS</label>
                <input type="checkbox" id="smsNotifications" class="swal2-checkbox">
            </div>
        `,
        focusConfirm: false,
        preConfirm: () => {
            return {
                email: document.getElementById('emailNotifications').checked,
                push: document.getElementById('pushNotifications').checked,
                sms: document.getElementById('smsNotifications').checked
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // Here you would typically send this to your backend to process
            Swal.fire('Sucesso!', 'Suas preferências de notificação foram atualizadas.', 'success');
        }
    });
}

// Privacy settings function
function privacySettings() {
    Swal.fire({
        title: 'Configurações de Privacidade',
        html: `
            <div class="flex items-center justify-between mb-4">
                <label for="shareData">Compartilhar dados de uso anônimos</label>
                <input type="checkbox" id="shareData" class="swal2-checkbox">
            </div>
            <div class="flex items-center justify-between">
                <label for="thirdPartyAccess">Permitir acesso de terceiros</label>
                <input type="checkbox" id="thirdPartyAccess" class="swal2-checkbox">
            </div>
        `,
        focusConfirm: false,
        preConfirm: () => {
            return {
                shareData: document.getElementById('shareData').checked,
                thirdPartyAccess: document.getElementById('thirdPartyAccess').checked
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // Here you would typically send this to your backend to process
            Swal.fire('Sucesso!', 'Suas configurações de privacidade foram atualizadas.', 'success');
        }
    });
}

// Contact support function
function contactSupport() {
    Swal.fire({
        title: 'Contatar Suporte',
        html: `
            <textarea id="supportMessage" class="swal2-textarea" placeholder="Descreva seu problema ou dúvida aqui"></textarea>
        `,
        focusConfirm: false,
        preConfirm: () => {
            const message = document.getElementById('supportMessage').value;
            if (!message) {
                Swal.showValidationMessage('Por favor, descreva seu problema ou dúvida');
            }
            return { message }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // Here you would typically send this to your backend to process
            Swal.fire('Mensagem Enviada!', 'Nossa equipe de suporte entrará em contato em breve.', 'success');
        }
    });
}

// Price comparison
compareBtn.addEventListener('click', () => {
    const price = parseFloat(priceInput.value);
    const quantity = parseFloat(quantityInput.value);
    const unit = unitSelect.value;
    
    if (isNaN(price) || isNaN(quantity)) {
        comparisonResult.innerHTML = '<p class="text-red-500">Por favor, insira valores válidos.</p>';
        return;
    }

    const unitPrice = price / quantity;
    comparisonResult.innerHTML = `
        <p class="font-semibold text-lg mb-2">Preço por ${unit}: R$ ${unitPrice.toFixed(2)}</p>
    `;

    // Compare with existing products
    const cheaperProducts = products.filter(p => p.price < unitPrice);
    if (cheaperProducts.length > 0) {
        comparisonResult.innerHTML += `
            <p class="mb-2">Produtos mais baratos encontrados:</p>
            <ul class="list-disc pl-5 space-y-1">
                ${cheaperProducts.map(p => `
                    <li class="text-sm">
                        ${p.name} - R$ ${p.price.toFixed(2)}/${unit}
                        <span class="text-green-600 ml-2">${((unitPrice - p.price) / unitPrice * 100).toFixed(2)}% mais barato</span>
                    </li>
                `).join('')}
            </ul>
        `;
    } else {
        comparisonResult.innerHTML += '<p class="text-green-600 mt-2">Este é o melhor preço na sua lista!</p>';
    }

    // Add animation
    comparisonResult.classList.add('animate-fade-in');
    setTimeout(() => comparisonResult.classList.remove('animate-fade-in'), 500);
});

// Spending analysis chart
function updateSpendingChart() {
    const ctx = document.getElementById('spendingChart').getContext('2d');
    const labels = purchaseHistory.slice(0, 5).map(p => p.date);
    const data = purchaseHistory.slice(0, 5).map(p => p.total);

    if (window.myChart instanceof Chart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Gastos por Compra',
                data: data,
                backgroundColor: 'rgba(52, 152, 219, 0.6)',
                borderColor: 'rgba(52, 152, 219, 1)',
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
                }
            }
        }
    });

    // Update total spent this month and average spending
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthPurchases = purch

aseHistory.filter(p => {
        const purchaseDate = new Date(p.date);
        return purchaseDate.getMonth() === currentMonth && purchaseDate.getFullYear() === currentYear;
    });

    const totalSpentThisMonth = thisMonthPurchases.reduce((total, p) => total + p.total, 0);
    const averageSpending = purchaseHistory.length > 0 ? purchaseHistory.reduce((total, p) => total + p.total, 0) / purchaseHistory.length : 0;

    document.getElementById('monthTotal').textContent = `R$ ${totalSpentThisMonth.toFixed(2)}`;
    document.getElementById('averageSpending').textContent = `R$ ${averageSpending.toFixed(2)}`;
}

// Edit profile button
editProfileBtn.addEventListener('click', () => {
    Swal.fire({
        title: 'Editar Perfil',
        html: `
            <input type="text" id="editName" class="swal2-input" placeholder="Nome" value="${simulatedUser.name}">
            <input type="email" id="editEmail" class="swal2-input" placeholder="Email" value="${simulatedUser.email}">
        `,
        focusConfirm: false,
        preConfirm: () => {
            const name = document.getElementById('editName').value;
            const email = document.getElementById('editEmail').value;
            if (!name || !email) {
                Swal.showValidationMessage('Por favor, preencha todos os campos');
            }
            return { name, email }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            simulatedUser.name = result.value.name;
            simulatedUser.email = result.value.email;
            updateUserInfo();
            Swal.fire('Sucesso!', 'Seu perfil foi atualizado.', 'success');
        }
    });
});

// Upgrade account button
upgradeAccountBtn.addEventListener('click', () => {
    Swal.fire({
        title: 'Atualizar Conta',
        html: `
            <p>Escolha seu novo plano:</p>
            <select id="planSelect" class="swal2-select">
                <option value="basic">Básico - R$ 9,99/mês</option>
                <option value="pro">Pro - R$ 19,99/mês</option>
                <option value="premium">Premium - R$ 29,99/mês</option>
            </select>
        `,
        focusConfirm: false,
        preConfirm: () => {
            return document.getElementById('planSelect').value;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            simulatedUser.plan = result.value;
            updateUserInfo();
            Swal.fire('Sucesso!', `Sua conta foi atualizada para o plano ${result.value}.`, 'success');
        }
    });
});

// Simulated user data
let simulatedUser = {
    name: "Usuário Exemplo",
    email: "usuario@exemplo.com",
    plan: "Básico"
};

// Update user info
function updateUserInfo() {
    document.getElementById('userName').textContent = simulatedUser.name;
    document.getElementById('userEmail').textContent = simulatedUser.email;
    document.getElementById('userPlan').textContent = simulatedUser.plan;
}

// Initialize
loadFromLocalStorage();
updateProductList();
updatePurchaseHistory();
updateSpendingChart();
updateUserInfo();

// Check for dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    document.documentElement.classList.add('dark');
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === productModal) {
        productModal.classList.add('hidden');
    }
    if (e.target === userAccountModal) {
        userAccountModal.classList.add('hidden');
    }
});

// Close modal buttons
closeModal.addEventListener('click', () => {
    productModal.classList.add('hidden');
});
