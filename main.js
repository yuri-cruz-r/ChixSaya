document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    
    // Check if the navToggle element exists before querying spans
    if (navToggle) {
        const spans = navToggle.querySelectorAll('span');
        
        navToggle.addEventListener('click', () => {
            const isOpen = mobileNav.classList.toggle('open');
            // keep the toggle button state in sync so we can style it (color change)
            navToggle.classList.toggle('open', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : 'auto';

            // Toggle animation for the burger icon
            if (isOpen) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    
    // 2. Contact Form Submission Handling
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();

            if (name === '' || email === '') {
                formMessage.textContent = 'Please fill out all required fields.';
                formMessage.style.backgroundColor = 'red';
                formMessage.style.color = 'white';
                formMessage.classList.remove('hidden');
                return;
            }

            formMessage.textContent = 'Thank you for contacting Chix Saya! We will respond shortly.';
            formMessage.style.backgroundColor = 'var(--color-secondary)';
            formMessage.style.color = 'var(--color-dark)';
            formMessage.classList.remove('hidden');

            this.reset();
            
            setTimeout(() => {
                formMessage.classList.add('hidden');
            }, 5000);
        });
    }
    

    // 3. Shopping Cart Functionality with Flavor Selection
    const cart = [];
    let currentItem = null; 
    
    const cartToggle = document.getElementById('cartToggle');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.getElementById('closeCart');
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const totalItems = document.getElementById('totalItems');
    const totalPrice = document.getElementById('totalPrice');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    // --- Product data (Array) ---
    const products = [
        { category: 'popular', name: '4pcs Wings & 1 Rice', desc: 'Solo meal with Chicken Wings (Choice of 1 Flavor) and rice.', price: 150, img: 'img/4pcs-rice.jpg', needsFlavor: true },
        { category: 'popular', name: 'Wings & Fries', desc: '4pcs Chicken Wings, paired with crispy fries.', price: 160, img: 'img/wings-fries.png', needsFlavor: true },

        { category: 'group', name: 'Group Meal A (12pcs Wings)', desc: '3-4 Pax. 12 portions of wings, with a platter of rice and one large dip', price: 499, img: 'img/12pcs-group.jpg', needsFlavor: true },
        { category: 'group', name: 'Group Meal B (12pcs Wings)', desc: '12 portions of wings, with a basket of our Fries and one large dip.', price: 540, img: 'img/12pcs-fries.jpg', needsFlavor: true },

        { category: 'wings', name: '12pcs Chicken Wings', desc: 'Box of Wings (3 Flavors of your Choice).', price: 369, img: 'img/12pcs.jpg', needsFlavor: true },
        { category: 'wings', name: '6pcs Chicken Wings', desc: '6pcs Chicken Wings (Choice of 1 Flavor).', price: 189, img: 'img/6pcs.jpg', needsFlavor: true },

        { category: 'snacks_pasta', name: 'French Fries w/ Dip', desc: 'Our signature seasoned fries with dipping sauce.', price: 69, img: 'img/fries-dip.jpg', needsFlavor: false },
        { category: 'snacks_pasta', name: 'Fries & Shots w/ Dip', desc: 'Our signature seasoned fries paired with bite size chicken with dipping sauce.', price: 160, img: 'img/fries-shots.jpg', needsFlavor: false },
        { category: 'snacks_pasta', name: 'Cheesy Nachos', desc: 'Crispy Nachos drizzled with cheese', price: 170, img: 'img/nachos.jpg', needsFlavor: false },
        { category: 'snacks_pasta', name: 'Chicken Alfredo', desc: 'Rich creamy pasta paired With chicken', price: 169, img: 'img/alfredo.jpg', needsFlavor: false },
        { category: 'snacks_pasta', name: 'Cheesy Spicy Buldak', desc: 'Tasty spicy buldak noodles covered in cheese', price: 210, img: 'img/buldak.jpg', needsFlavor: false },

        { category: 'bilao', name: 'Small Fiesta Size Bilao', desc: 'Perfect for small gatherings. Good for 8-10 people.', price: 799, img: 'img/bilao-small.jpg', needsFlavor: false },
        { category: 'bilao', name: 'Medium Fiesta Size Bilao', desc: 'Great for medium parties. Good for 12-15 people.', price: 1299, img: 'img/bilao-medium.jpg', needsFlavor: false },
        { category: 'bilao', name: 'Large Fiesta Size Bilao', desc: 'The ultimate party platter. Good for 20+ people.', price: 1399, img: 'img/bilao-large.jpg', needsFlavor: false },

        { category: 'others', name: 'Extra 3pcs Wings', desc: 'Add more wings to any meal.', price: 100, img: 'img/3pcs.jpg', needsFlavor: true },
        { category: 'others', name: 'Bottled Water', desc: 'Stay hydrated!', price: 20, img: 'img/water.jpg', needsFlavor: false },
        { category: 'others', name: 'Extra Rice', desc: 'Additional serving of rice.', price: 20, img: 'img/rice.jpg', needsFlavor: false },
         { category: 'others', name: 'Blue Lemonade', desc: 'Sweet lemonade.', price: 25, img: 'img/blue-lemon.jpg', needsFlavor: false },
        { category: 'others', name: 'Red Iced Tea', desc: 'Refreshing iced tea.', price: 25, img: 'img/juice.jpg', needsFlavor: false },
        { category: 'others', name: 'Hot Coffee', desc: 'Hot Coffee!', price: 70, img: 'img/coffee.jpg', needsFlavor: false }
    ];

    // Flavor data (For flavor list and flavor modal options)
    const flavors = [
        { name: 'Soy Garlic', emoji: '🫘', desc: 'Our signature blend - the perfect balance of savory soy and sweet garlic.' },
        { name: 'BBQ', emoji: '🍖', desc: 'Sweet, smoky, and tangy.' },
        { name: 'Buffalo Spicy', emoji: '🔥', desc: 'Classic buffalo heat with a spicy kick.' },
        { name: 'Creamy Chilli Cheese', emoji: '🧀', desc: 'Rich cheese sauce with a hint of chili.' },
        { name: 'Garlic Parmesan', emoji: '🧄', desc: 'Roasted garlic with authentic parmesan cheese.' },
        { name: 'Honey Ginger', emoji: '🍯', desc: 'Sweet honey with a warming ginger twist.' },
        { name: 'Soy Spicy', emoji: '😈', desc: 'A spicy flavor with emphasis on the salt.' },
        { name: 'Sweet Chilli', emoji: '🌶️', desc: 'Sweet and spicy.' },
        { name: 'Teriyaki', emoji: '🍗', desc: 'Japanese-style sweet and savory glaze.' },
        { name: 'Salted Egg', emoji: '🥚', desc: 'Creamy, savory, and rich, featuring authentic salted egg goodness.' },
        { name: 'Plain', emoji: '⚪', desc: 'Classic, simple, and delicious.' }
    ];

    function formatPrice(n) {
        return '₱' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function renderProducts() {
        const gridMap = {
            popular: document.getElementById('popularGrid'),
            group: document.getElementById('groupGrid'),
            wings: document.getElementById('wingsGrid'),
            snacks_pasta: document.getElementById('snacks_pastaGrid'),
            bilao: document.getElementById('bilaoGrid'),
            others: document.getElementById('othersGrid')
        };

        products.forEach(p => {
            const grid = gridMap[p.category];
            if (!grid) return;

            const card = document.createElement('div');
            card.className = 'product-card';

            const flavorAttr = p.needsFlavor ? ' data-needs-flavor="true"' : '';

            card.innerHTML = `\
                <div class="menu-img"><img class="product-image" src="${p.img}" alt="${p.name}"></div>\
                <div class="product-card-text">\
                    <h3>${p.name}</h3>\
                    <p>${p.desc}</p>\
                    <span class="price">${formatPrice(p.price)}</span>\
                </div>\
                <button class="add-to-cart cta-button" data-name="${p.name}" data-price="${p.price}"${flavorAttr}>Add to Cart</button>\
            `;

            grid.appendChild(card);
        });
    }

    // Render product cards
    renderProducts();

    // Render flavor list and flavor options
    function renderFlavors() {
        const flavorList = document.getElementById('flavorList');
        const flavorOptionsContainer = document.getElementById('flavorOptionsContainer');
        if (flavorList) {
            flavorList.innerHTML = flavors.map(f => `\
                <div class="flavor-item">\
                    <h4>${f.emoji} ${f.name}</h4>\
                    <p>${f.desc}</p>\
                </div>`).join('');
        }
        if (flavorOptionsContainer) {
            flavorOptionsContainer.innerHTML = flavors.map(f => `\
                <label class="flavor-option">\
                    <input type="radio" name="flavor" value="${f.name}">\
                    <span>${f.emoji} ${f.name}</span>\
                </label>`).join('');
        }
    }

    renderFlavors();

    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    const flavorModal = document.getElementById('flavorModal');
    const closeFlavorModal = document.getElementById('closeFlavorModal');
    const confirmFlavor = document.getElementById('confirmFlavor');
    let flavorOptions = document.querySelectorAll('input[name="flavor"]');

    const checkoutModal = document.getElementById('checkoutModal');
    const closeCheckoutModal = document.getElementById('closeCheckoutModal');
    const confirmCheckoutBtn = document.getElementById('confirmCheckoutBtn');

    if (cartToggle) {
        cartToggle.addEventListener('click', () => {
            cartSidebar.classList.add('open');
        });
    }

    if (closeCart) {
        closeCart.addEventListener('click', () => {
            cartSidebar.classList.remove('open');
        });
    }

    if (closeFlavorModal) {
        closeFlavorModal.addEventListener('click', () => {
            flavorModal.classList.remove('open');
            currentItem = null;
            clearFlavorSelection();
        });
    }

    if (flavorModal) {
        flavorModal.addEventListener('click', (e) => {
            if (e.target === flavorModal) {
                flavorModal.classList.remove('open');
                currentItem = null;
                clearFlavorSelection();
            }
        });
    }

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            const needsFlavor = this.getAttribute('data-needs-flavor') === 'true';

            if (needsFlavor) {
                currentItem = { name, price, button: this };
                flavorModal.classList.add('open');
            } else {
                addItemToCart(name, price, null, this);
            }
        });
    });

    if (confirmFlavor) {
        confirmFlavor.addEventListener('click', () => {
            const selectedFlavor = document.querySelector('input[name="flavor"]:checked');
            const flavorWarning = document.getElementById('flavorWarning');
            
            if (!selectedFlavor) {
                flavorWarning.classList.add('show');
                setTimeout(() => {
                    flavorWarning.classList.remove('show');
                }, 3000);
                return;
            }

            if (currentItem) {
                addItemToCart(
                    currentItem.name,
                    currentItem.price,
                    selectedFlavor.value,
                    currentItem.button
                );
                
                flavorModal.classList.remove('open');
                flavorWarning.classList.remove('show');
                currentItem = null;
                clearFlavorSelection();
            }
        });
    }
    
    function addItemToCart(name, price, flavor, button) {
        const itemName = flavor ? `${name} (${flavor})` : name;
        
        cart.push({ name: itemName, price, flavor });
        updateCart();


        const originalText = button.textContent;
        button.textContent = 'Added! ✓';
        button.style.backgroundColor = 'var(--color-secondary)';
        button.style.color = 'var(--color-dark)';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '';
            button.style.color = '';
        }, 1000);
    }

    function clearFlavorSelection() {
        flavorOptions.forEach(option => {
            option.checked = false;
        });
    }

   function updateCart() {
        cartCount.textContent = cart.length;
        totalItems.textContent = cart.length;

        const total = cart.reduce((sum, item) => sum + item.price, 0);
        totalPrice.textContent = total.toFixed(2);

        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        } else {
            const groupedItems = {};
            cart.forEach((item, index) => {
                if (!groupedItems[item.name]) {
                    groupedItems[item.name] = {
                        name: item.name,
                        price: item.price,
                        quantity: 0,
                        indices: []
                    };
                }
                groupedItems[item.name].quantity++;
                groupedItems[item.name].indices.push(index);
            });

            cartItems.innerHTML = Object.values(groupedItems).map(group => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${group.quantity}x ${group.name}</h4>
                        <span class="cart-item-price">₱${(group.price * group.quantity).toFixed(2)}</span>
                    </div>
                    <button class="remove-item" data-indices="${group.indices.join(',')}">🗑️</button>
                </div>
            `).join('');

            document.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', function() {
                    const indices = this.getAttribute('data-indices').split(',').map(i => parseInt(i));
                    indices.sort((a, b) => b - a).forEach(index => {
                        cart.splice(index, 1);
                    });
                    updateCart();
                });
            });
        }
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                const existingWarning = cartSidebar.querySelector('.cart-empty-warning');
                if (existingWarning) {
                    return;
                }
                
                const emptyWarning = document.createElement('div');
                emptyWarning.className = 'cart-empty-warning';
                emptyWarning.textContent = '⚠️ Your cart is empty!';
                const cartHeader = cartSidebar.querySelector('.cart-header');
                if (cartHeader) {
                     cartHeader.appendChild(emptyWarning);
                } else {
                     cartSidebar.prepend(emptyWarning);
                }
                
                setTimeout(() => {
                    emptyWarning.remove();
                }, 3000);
                return;
            }

            const total = cart.reduce((sum, item) => sum + item.price, 0);
            const checkoutItemsList = document.getElementById('checkoutItemsList');
            const checkoutTotal = document.getElementById('checkoutTotal');
            
            checkoutItemsList.innerHTML = Object.values(cart.reduce((acc, item) => {
                acc[item.name] = acc[item.name] || { name: item.name, price: item.price, quantity: 0 };
                acc[item.name].quantity++;
                return acc;
            }, {})).map(item => `
                <div class="checkout-item">
                    <span class="checkout-item-name">${item.quantity}x ${item.name}</span>
                    <span class="checkout-item-price">₱${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `).join('');
            
            checkoutTotal.textContent = total.toFixed(2);
            checkoutModal.classList.add('open');
        });
    }

    if (closeCheckoutModal) {
        closeCheckoutModal.addEventListener('click', () => {
            checkoutModal.classList.remove('open');
        });
    }

    if (checkoutModal) {
        checkoutModal.addEventListener('click', (e) => {
            if (e.target === checkoutModal) {
                checkoutModal.classList.remove('open');
            }
        });
    }

    if (confirmCheckoutBtn) {
        confirmCheckoutBtn.addEventListener('click', () => {
            cart.length = 0;
            updateCart();
            checkoutModal.classList.remove('open');
            cartSidebar.classList.remove('open');
            
            const successMsg = document.createElement('div');
            successMsg.className = 'checkout-success';
            successMsg.innerHTML = `
                <div class="checkout-success-content">
                    <div class="success-icon">✓</div>
                    <h3>Order Confirmed!</h3>
                    <p>Your order will be ready in 20-30 minutes.</p>
                </div>
            `;
            document.body.appendChild(successMsg);
            
            setTimeout(() => {
                successMsg.classList.add('show');
            }, 10);
            
            setTimeout(() => {
                successMsg.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(successMsg);
                }, 300);
            }, 3000);
        });
    }

    if (confirmCheckoutBtn) {
        confirmCheckoutBtn.addEventListener('click', () => {
            cart.length = 0;
            updateCart();
            checkoutModal.classList.remove('open');
            cartSidebar.classList.remove('open');
            
            const successMsg = document.createElement('div');
            successMsg.className = 'checkout-success';
            successMsg.innerHTML = `
                <div class="checkout-success-content">
                    <div class="success-icon">✓</div>
                    <h3>Order Confirmed!</h3>
                    <p>Your order will be ready in 20-30 minutes.</p>
                </div>
            `;
            document.body.appendChild(successMsg);
            
            setTimeout(() => {
                successMsg.classList.add('show');
            }, 10);
            
            setTimeout(() => {
                successMsg.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(successMsg);
                }, 300);
            }, 3000);
        });
    }
});