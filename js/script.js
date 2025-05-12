       // Sample product data
        const products = [
            {
                id: 1,
                name: "Latest Smartphone",
                price: 799.99,
                image: "/api/placeholder/300/200",
                category: "smartphones"
            },
            {
                id: 2,
                name: "Pro Laptop",
                price: 1299.99,
                image: "/api/placeholder/300/200",
                category: "laptops"
            },
            {
                id: 3,
                name: "Wireless Earbuds",
                price: 149.99,
                image: "/api/placeholder/300/200",
                category: "accessories"
            },
            {
                id: 4,
                name: "Smart Watch",
                price: 249.99,
                image: "/api/placeholder/300/200",
                category: "accessories"
            }
        ];

        // Cart functionality
        let cart = [];
        const cartCount = document.querySelector('.cart-count');
        const cartItems = document.getElementById('cart-items');
        const cartTotalPrice = document.getElementById('cart-total-price');
        const cartIcon = document.getElementById('cartIcon');
        const cartModal = document.getElementById('cartModal');
        const closeModal = document.querySelector('.close-modal');
        const toast = document.getElementById('toast');

        // Mobile menu toggle
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');

        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Display featured products
        const featuredProducts = document.getElementById('featured-products');

        function displayProducts() {
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.classList.add('product-card');
                productCard.innerHTML = `
                    <div class="product-img">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${product.name}</h3>
                        <div class="product-price">$${product.price.toFixed(2)}</div>
                        <div class="product-actions">
                            <button class="btn" data-id="${product.id}">Add to Cart</button>
                            <a href="product-details.html?id=${product.id}" class="btn btn-secondary">View Details</a>
                        </div>
                    </div>
                `;
                featuredProducts.appendChild(productCard);
            });
        }

        // Add event listeners to add to cart buttons
        function setupEventListeners() {
            // Add to cart buttons
            document.querySelectorAll('.product-actions .btn:first-child').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = parseInt(e.target.getAttribute('data-id'));
                    addToCart(productId);
                });
            });

            // Cart icon opens modal
            cartIcon.addEventListener('click', () => {
                cartModal.style.display = 'flex';
            });

            // Close modal
            closeModal.addEventListener('click', () => {
                cartModal.style.display = 'none';
            });

            // Close modal when clicking outside
            window.addEventListener('click', (e) => {
                if (e.target === cartModal) {
                    cartModal.style.display = 'none';
                }
            });

            // Newsletter form
            document.getElementById('newsletter-form').addEventListener('submit', (e) => {
                e.preventDefault();
                const email = e.target.querySelector('input[type="email"]').value;
                if (email) {
                    showToast('Thank you for subscribing!');
                    e.target.reset();
                }
            });
        }

        // Add item to cart
        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            if (!product) return;

            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    ...product,
                    quantity: 1
                });
            }

            updateCart();
            showToast(`${product.name} added to cart!`);
        }

        // Update cart display
        function updateCart() {
            // Update cart count
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;

            // Update cart items in modal
            cartItems.innerHTML = '';
            if (cart.length === 0) {
                cartItems.innerHTML = '<p>Your cart is empty.</p>';
            } else {
                cart.forEach(item => {
                    const cartItem = document.createElement('div');
                    cartItem.classList.add('cart-item');
                    cartItem.innerHTML = `
                        <div class="cart-item-img">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="cart-item-details">
                            <div class="cart-item-title">${item.name}</div>
                            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                            <div class="cart-item-quantity">
                                <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                                <input type="number" class="quantity-input" value="${item.quantity}" min="1" readonly>
                                <button class="quantity-btn increase" data-id="${item.id}">+</button>
                            </div>
                        </div>
                        <button class="cart-item-remove" data-id="${item.id}">&times;</button>
                    `;
                    cartItems.appendChild(cartItem);
                });

                // Add event listeners for quantity buttons and remove buttons
                document.querySelectorAll('.quantity-btn.decrease').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const id = parseInt(e.target.getAttribute('data-id'));
                        decreaseQuantity(id);
                    });
                });

                document.querySelectorAll('.quantity-btn.increase').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const id = parseInt(e.target.getAttribute('data-id'));
                        increaseQuantity(id);
                    });
                });

                document.querySelectorAll('.cart-item-remove').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const id = parseInt(e.target.getAttribute('data-id'));
                        removeFromCart(id);
                    });
                });
            }

            // Update total price
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotalPrice.textContent = `$${total.toFixed(2)}`;

            // Save cart to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
        }

        // Increase item quantity
        function increaseQuantity(id) {
            const item = cart.find(item => item.id === id);
            if (item) {
                item.quantity += 1;
                updateCart();
            }
        }

        // Decrease item quantity
        function decreaseQuantity(id) {
            const item = cart.find(item => item.id === id);
            if (item) {
                item.quantity -= 1;
                if (item.quantity <= 0) {
                    removeFromCart(id);
                } else {
                    updateCart();
                }
            }
        }

        // Remove item from cart
        function removeFromCart(id) {
            cart = cart.filter(item => item.id !== id);
            updateCart();
        }

        // Show toast notification
        function showToast(message) {
            toast.textContent = message;
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }

        // Initialize
        function init() {
            // Load cart from localStorage
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                cart = JSON.parse(savedCart);
                updateCart();
            }

            displayProducts();
            setupEventListeners();
        }

        // Run initialization when DOM is loaded
        document.addEventListener('DOMContentLoaded', init);
   