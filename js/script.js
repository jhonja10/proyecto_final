// script.js

// Array para almacenar los productos en el carrito
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Función para guardar el carrito en Local Storage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Función para agregar un producto al carrito
function addToCart(productId, productName, productPrice, productImage) {
    const existingProduct = cart.find(item => item.id === productId);

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        });
    }
    saveCart();
    updateCartDisplay();
    alert(`${productName} ha sido agregado al carrito!`);
}

// Función para remover un producto del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartDisplay();
}

// Función para actualizar la cantidad de un producto en el carrito
function updateQuantity(productId, newQuantity) {
    const product = cart.find(item => item.id === productId);
    if (product) {
        product.quantity = parseInt(newQuantity);
        if (product.quantity <= 0) {
            removeFromCart(productId); // Si la cantidad es 0 o menos, eliminar
        }
    }
    saveCart();
    updateCartDisplay();
}

// Función para calcular el total del carrito
function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Función para actualizar la vista del carrito (en la página del carrito)
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');

    if (!cartItemsContainer || !cartTotalElement) return; 

    cartItemsContainer.innerHTML = ''; // Limpia el contenedor

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-center">Tu carrito está vacío.</p>';
        cartTotalElement.textContent = '0.00';
        return;
    }

    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('d-flex', 'align-items-center', 'mb-3', 'border-bottom', 'pb-3');
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; margin-right: 15px;">
            <div>
                <h5>${item.name}</h5>
                <p class="mb-1">Precio: $${item.price.toFixed(2)}</p>
                <div class="input-group" style="width: 120px;">
                    <button class="btn btn-outline-secondary btn-sm" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <input type="number" class="form-control form-control-sm text-center" value="${item.quantity}" min="1" onchange="updateQuantity('${item.id}', this.value)">
                    <button class="btn btn-outline-secondary btn-sm" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                </div>
                <button class="btn btn-danger btn-sm mt-2" onclick="removeFromCart('${item.id}')">Eliminar</button>
            </div>
            <p class="ms-auto text-end">Subtotal: $${(item.price * item.quantity).toFixed(2)}</p>
        `;
        cartItemsContainer.appendChild(itemElement);
    });

    cartTotalElement.textContent = getCartTotal().toFixed(2);
}

// Función para manejar el proceso de compra (simulado)
function checkout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío. Agrega productos antes de comprar.');
        return;
    }
    alert(`Total a pagar: $${getCartTotal().toFixed(2)}. ¡Gracias por tu compra!`);
    cart = []; // Vacía el carrito después de la compra
    saveCart();
    updateCartDisplay();
}

// Event Listeners (Escuchadores de Eventos)
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar la visualización del carrito cuando la página cargue (útil para carrito.html)
    updateCartDisplay();

    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.dataset.id;
            const productName = event.target.dataset.name;
            const productPrice = parseFloat(event.target.dataset.price);
            const productImage = event.target.dataset.image;

            if (productId && productName && productPrice && productImage) {
                addToCart(productId, productName, productPrice, productImage);
            } else {
                console.error("Faltan datos en el botón 'add-to-cart-btn'.");
            }
        });
    });

    // Ejemplo: Botón de checkout en carrito.html
    const checkoutButton = document.getElementById('checkout-btn');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', checkout);
    }

    // Funcionalidad para el botón de ir al carrito desde cualquier página
    const viewCartButton = document.getElementById('view-cart-button');
    if (viewCartButton) {
        viewCartButton.addEventListener('click', () => {
            window.location.href = 'carrito.html';
        });
    }

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada
            alert('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.');
            contactForm.reset(); // Limpia el formulario
        });
    }

});