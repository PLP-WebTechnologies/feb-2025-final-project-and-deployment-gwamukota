// Products data - In a real application, this would come from an API
const allProducts = [
    {
        id: 1,
        name: "Latest Smartphone",
        price: 799.99,
        image: "/api/placeholder/300/200",
        category: "smartphones",
        description: "The  smartphone with advanced camera system and all-day battery life.",
        rating: 4.8,
        inStock: true
    },
    {
        id: 2,
        name: "Pro Laptop",
        price: 1299.99,
        image: "/api/placeholder/300/200",
        category: "laptops",
        description: "Powerful laptop for professionals with high-performance processor and stunning display.",
        rating: 4.7,
        inStock: true
    },
    {
        id: 3,
        name: "Wireless Earbuds",
        price: 149.99,
        image: "/api/placeholder/300/200",
        category: "accessories",
        description: "True wireless earbuds with noise cancellation and crystal-clear sound quality.",
        rating: 4.5,
        inStock: true
    },
    {
        id: 4,
        name: "Smart Watch",
        price: 249.99,
        image: "/api/placeholder/300/200",
        category: "accessories",
        description: "Track your fitness and stay connected with this feature-packed smartwatch.",
        rating: 4.6,
        inStock: true
    },
    {
        id: 5,
        name: "Budget Smartphone",
        price: 399.99,
        image: "/api/placeholder/300/200",
        category: "smartphones",
        description: "Affordable smartphone with great features for everyday use.",
        rating: 4.2,
        inStock: true
    },
    {
        id: 6,
        name: "Gaming Laptop",
        price: 1599.99,
        image: "/api/placeholder/300/200",
        category: "laptops",
        description: "High-performance gaming laptop with dedicated graphics and RGB keyboard.",
        rating: 4.9,
        inStock: false
    },
    {
        id: 7,
        name: "Bluetooth Speaker",
        price: 89.99,
        image: "/api/placeholder/300/200",
        category: "accessories",
        description: "Portable Bluetooth speaker with sound and waterproof design.",
        rating: 4.4,
        inStock: true
    },
    {
        id: 8,
        name: "Tablet Pro",
        price: 699.99,
        image: "/api/placeholder/300/200",
        category: "tablets",
        description: "Versatile tablet for work and entertainment with a stunning display.",
        rating: 4.7,
        inStock: true
    },
    {
        id: 9,
        name: "Wireless Charging Pad",
        price: 29.99,
        image: "/api/placeholder/300/200",
        category: "accessories",
        description: "Fast wireless charging for compatible devices with sleek design.",
        rating: 4.3,
        inStock: true
    },
    {
        id: 10,
        name: "Ultra HD Monitor",
        price: 349.99,
        image: "/api/placeholder/300/200",
        category: "monitors",
        description: "4K Ultra HD monitor with wide color gamut and minimal bezels.",
        rating: 4.6,
        inStock: true
    },
    {
        id: 11,
        name: "Mechanical Keyboard",
        price: 129.99,
        image: "/api/placeholder/300/200",
        category: "accessories",
        description: "Premium mechanical keyboard with customizable RGB lighting.",
        rating: 4.8,
        inStock: true
    },
    {
        id: 12,
        name: "Wi-Fi Router",
        price: 79.99,
        image: "/api/placeholder/300/200",
        category: "networking",
        description: "High-speed Wi-Fi router for seamless connectivity throughout your home.",
        rating: 4.5,
        inStock: false
    }
];

// Cart functionality from existing script
let cart = [];
const cartCount = document.querySelector('.cart-count');
const cartItems = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');
const cartIcon = document.getElementById('cartIcon');
const cartModal = document.getElementById('cartModal');
const closeModal = document.querySelector('.close-modal');
const toast = document.getElementById('toast');

// DOM elements for products page
const productsContainer = document.getElementById('products-container');
const categoryFilter = document.getElementById('category-filter');
const sortOptions = document.getElementById('sort-options');
const priceRangeMin = document.getElementById('price-range-min');
const priceRangeMax = document.getElementById('price-range-max');
const searchInput = document.getElementById('search-input');
const inStockOnly = document.getElementById('in-stock-only');
const clearFiltersBtn = document.getElementById('clear-filters');
const totalResults = document.getElementById('total-results');

// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const filterToggle = document.getElementById('filter-toggle');
const filtersContainer = document.querySelector('.filters-container');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

if (filterToggle) {
    filterToggle.addEventListener('click', () => {
        filtersContainer.classList.toggle('active');
    });
}

// Display products
function displayProducts(products) {
    productsContainer.innerHTML = '';
    
    if (products.length === 0) {
        productsContainer.innerHTML = '<div class="no-results">No products found matching your criteria. Try adjusting your filters.</div>';
        totalResults.textContent = '0 products found';
        return;
    }
    
    totalResults.textContent = `${products.length} products found`;
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        
        const stockBadge = product.inStock 
            ? '<span class="stock-badge in-stock">In Stock</span>' 
            : '<span class="stock-badge out-of-stock">Out of Stock</span>';
            
        const ratingStars = generateRatingStars(product.rating);
        
        productCard.innerHTML = `
            <div class="product-img">
                <img src="${product.image}" alt="${product.name}">
                ${stockBadge}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">${ratingStars}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <p class="product-description">${product.description}</p>
                <div class="product-actions">
                    <button class="btn ${!product.inStock ? 'disabled' : ''}" data-id="${product.id}" ${!product.inStock ? 'disabled' : ''}>
                        ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                    <a href="product-details.html?id=${product.id}" class="btn btn-secondary">View Details</a>
                </div>
            </div>
        `;
        productsContainer.appendChild(productCard);
    });
    
    // Add event listeners to add to cart buttons
    document.querySelectorAll('.product-actions .btn:not(.disabled)').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Generate rating stars
function generateRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let starsHTML = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<span class="star full">★</span>';
    }
    
    // Half star
    if (halfStar) {
        starsHTML += '<span class="star half">★</span>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<span class="star empty">☆</span>';
    }
    
    return `${starsHTML} <span class="rating-number">(${rating})</span>`;
}

// Filter products
function filterProducts() {
    let filteredProducts = [...allProducts];
    
    // Filter by category
    const selectedCategory = categoryFilter.value;
    if (selectedCategory && selectedCategory !== 'all') {
        filteredProducts = filteredProducts.filter(product => 
            product.category === selectedCategory
        );
    }
    
    // Filter by price range
    const minPrice = parseFloat(priceRangeMin.value) || 0;
    const maxPrice = parseFloat(priceRangeMax.value) || Number.MAX_SAFE_INTEGER;
    filteredProducts = filteredProducts.filter(product => 
        product.price >= minPrice && product.price <= maxPrice
    );
    
    // Filter by search term
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    }
    
    // Filter by stock status
    if (inStockOnly.checked) {
        filteredProducts = filteredProducts.filter(product => product.inStock);
    }
    
    // Sort products
    const sortBy = sortOptions.value;
    switch (sortBy) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        default:
            // Default sort by popularity (ID in this case)
            filteredProducts.sort((a, b) => a.id - b.id);
    }
    
    displayProducts(filteredProducts);
}

// Populate category filter dropdown
function populateCategories() {
    const categories = [...new Set(allProducts.map(product => product.category))];
    categories.sort();
    
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categoryFilter.appendChild(option);
    });
    
    // Check if URL has category parameter
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    if (categoryParam) {
        categoryFilter.value = categoryParam;
    }
}

// Set price range min and max values
function setPriceRange() {
    const prices = allProducts.map(product => product.price);
    const minPrice = Math.floor(Math.min(...prices));
    const maxPrice = Math.ceil(Math.max(...prices));
    
    priceRangeMin.min = minPrice;
    priceRangeMin.max = maxPrice;
    priceRangeMin.value = minPrice;
    priceRangeMin.placeholder = `Min ($${minPrice})`;
    
    priceRangeMax.min = minPrice;
    priceRangeMax.max = maxPrice;
    priceRangeMax.value = maxPrice;
    priceRangeMax.placeholder = `Max ($${maxPrice})`;
}

// Clear all filters
function clearFilters() {
    categoryFilter.value = 'all';
    sortOptions.value = 'popular';
    
    const prices = allProducts.map(product => product.price);
    priceRangeMin.value = Math.floor(Math.min(...prices));
    priceRangeMax.value = Math.ceil(Math.max(...prices));
    
    searchInput.value = '';
    inStockOnly.checked = false;
    
    filterProducts();
}

// Add to cart
function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
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

    // Initialize filters
    populateCategories();
    setPriceRange();
    
    // Set up event listeners for filters
    categoryFilter.addEventListener('change', filterProducts);
    sortOptions.addEventListener('change', filterProducts);
    priceRangeMin.addEventListener('input', filterProducts);
    priceRangeMax.addEventListener('input', filterProducts);
    searchInput.addEventListener('input', filterProducts);
    inStockOnly.addEventListener('change', filterProducts);
    clearFiltersBtn.addEventListener('click', clearFilters);

    // Display all products initially
    filterProducts();
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', init);