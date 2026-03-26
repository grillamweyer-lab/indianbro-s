document.addEventListener("DOMContentLoaded", function() {
    
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Fade up animations
    const revealElements = document.querySelectorAll(".gs_reveal");
    revealElements.forEach(function(elem) {
        gsap.fromTo(elem, 
            { autoAlpha: 0, y: 50 }, 
            { 
                duration: 1, 
                autoAlpha: 1, 
                y: 0, 
                ease: "power3.out",
                scrollTrigger: {
                    trigger: elem,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // Staggered Up elements
    const staggerUpElements = document.querySelectorAll(".gs_reveal_up");
    gsap.fromTo(staggerUpElements,
        { autoAlpha: 0, y: 50 },
        {
            duration: 0.8,
            autoAlpha: 1,
            y: 0,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: staggerUpElements[0],
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        }
    );

    // Hero Text animation
    const heroText = document.querySelectorAll(".gs_reveal_text");
    gsap.fromTo(heroText,
        { autoAlpha: 0, scale: 0.8, rotationX: -45 },
        { 
            duration: 1.5, 
            autoAlpha: 1, 
            scale: 1, 
            rotationX: 0, 
            ease: "elastic.out(1, 0.5)",
            delay: 0.2
        }
    );

    // Image Entrance
    const heroImg = document.querySelectorAll(".gs_reveal_img");
    gsap.fromTo(heroImg,
        { autoAlpha: 0, x: 100 },
        {
            duration: 1.5,
            autoAlpha: 1,
            x: 0,
            ease: "power3.out",
            delay: 0.4
        }
    );

    // Initialize VanillaTilt for elements that might be loaded dynamically
    VanillaTilt.init(document.querySelectorAll(".tilt-card"), {
        max: 15,
        speed: 400,
        glare: true,
        "max-glare": 0.2,
        perspective: 1000
    });
});

// Shopping Basket Logic
let cart = JSON.parse(localStorage.getItem('byteCart')) || [];

function saveCart() {
    localStorage.setItem('byteCart', JSON.stringify(cart));
    updateBasketUI();
}

// Menu Data for Combos
const menuData = {
    burgers: [
        { name: 'Goat Byte Original', price: 11.90, isGoat: true },
        { name: 'Spicy Goat Byte', price: 12.90, isGoat: true },
        { name: 'Masala Goat Byte', price: 13.90, isGoat: true },
        { name: 'Byte Classic', price: 9.90, isGoat: false },
        { name: 'Double Byte', price: 12.90, isGoat: false },
        { name: 'Smoky BBQ Byte', price: 11.90, isGoat: false },
        { name: 'Crispy Chicken Byte', price: 8.90, isGoat: false },
        { name: 'Spicy Chicken Byte', price: 9.90, isGoat: false },
        { name: 'Green Byte (Vegan)', price: 8.50, isGoat: false },
        { name: 'Falafel Byte', price: 9.00, isGoat: false }
    ],
    sides: {
        regular: ['Classic Fries', 'Peri Peri Fries', 'Sweet Potato Fries'],
        loaded: ['Cheese Melt Fries', 'GOAT Loaded Fries', 'BBQ Beef Loaded Fries']
    },
    drinks: ['Coca-Cola', 'Fanta', 'Sprite', 'Mineral Water']
};

// Combo Selection Logic
let currentCombo = null;

function openComboSelection(type, feeLabel) {
    const fee = parseFloat(feeLabel.replace('€', '').replace('+', ''));
    currentCombo = { type: type, fee: fee };
    
    const burgerSelect = document.getElementById('combo-burger');
    const sideSelect = document.getElementById('combo-side');
    const drinkSelect = document.getElementById('combo-drink');
    const title = document.getElementById('combo-title');

    // Filter Burgers
    burgerSelect.innerHTML = '';
    const filteredBurgers = type === 'goat' 
        ? menuData.burgers.filter(b => b.isGoat)
        : menuData.burgers;
    
    filteredBurgers.forEach(b => {
        const opt = document.createElement('option');
        opt.value = b.name;
        opt.innerText = `${b.name} (€${b.price.toFixed(2)})`;
        burgerSelect.appendChild(opt);
    });

    // Filter Sides
    sideSelect.innerHTML = '';
    const availableSides = type === 'loaded' ? menuData.sides.loaded : [...menuData.sides.regular, ...menuData.sides.loaded];
    availableSides.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s;
        opt.innerText = s;
        sideSelect.appendChild(opt);
    });

    // Drinks
    drinkSelect.innerHTML = '';
    menuData.drinks.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d;
        opt.innerText = d;
        drinkSelect.appendChild(opt);
    });

    title.innerText = type.toUpperCase().replace('_', ' ') + ' CONFIGURATOR';
    document.getElementById('combo-modal').classList.add('active');
}

function closeComboModal() {
    document.getElementById('combo-modal').classList.remove('active');
}

function confirmCombo() {
    const burgerName = document.getElementById('combo-burger').value;
    const side = document.getElementById('combo-side').value;
    const drink = document.getElementById('combo-drink').value;
    
    const burger = menuData.burgers.find(b => b.name === burgerName);
    const totalPrice = burger.price + currentCombo.fee;
    
    const fullName = `${currentCombo.type.toUpperCase()}: ${burgerName} + ${side} + ${drink}`;
    addToCart(fullName, `€${totalPrice.toFixed(2)}`);
    closeComboModal();
}

function addToCart(itemName, price) {
    // Standardize price parsing
    let numericPrice = typeof price === 'string' 
        ? parseFloat(price.replace('€', '').replace('+', '')) 
        : price;
        
    cart.push({ name: itemName, price: numericPrice });
    saveCart();
    
    // Show feedback
    const btn = event.currentTarget;
    const originalText = btn.innerText;
    btn.innerText = "Added! ✅";
    btn.style.background = "var(--primary)";
    btn.style.color = "#fff";
    
    setTimeout(() => {
        btn.innerText = originalText;
        btn.style.background = "";
        btn.style.color = "";
    }, 1500);

    // Open basket automatically on first item
    if (cart.length === 1) toggleBasket(true);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
}

function toggleBasket(show) {
    const drawer = document.getElementById('basket-drawer');
    if (show === true) drawer.classList.add('active');
    else if (show === false) drawer.classList.remove('active');
    else drawer.classList.toggle('active');
}

function updateBasketUI() {
    const itemsContainer = document.getElementById('basket-items');
    const badge = document.getElementById('basket-badge');
    const totalElement = document.getElementById('basket-total-amount');
    
    if (!itemsContainer) return;

    // Update Badge
    badge.innerText = cart.length;
    badge.style.display = cart.length > 0 ? 'flex' : 'none';

    // Update Items List
    itemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        const itemEl = document.createElement('div');
        itemEl.className = 'basket-item';
        itemEl.innerHTML = `
            <div class="basket-item-info">
                <h4>${item.name}</h4>
                <p>€${item.price.toFixed(2)}</p>
            </div>
            <button class="remove-item" onclick="removeFromCart(${index})">Remove</button>
        `;
        itemsContainer.appendChild(itemEl);
    });

    totalElement.innerText = `€${total.toFixed(2)}`;
}

function checkout() {
    if (cart.length === 0) {
        alert("Your basket is empty!");
        return;
    }

    const itemsSummary = cart.map(item => `- ${item.name} (€${item.price.toFixed(2)})`).join('\n');
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const finalOrder = `${itemsSummary}\n\nTotal: €${total.toFixed(2)}`;
    
    // Redirect to order page with full summary
    window.location.href = `order.html?items=${encodeURIComponent(finalOrder)}`;
}

// Initialize UI on load
document.addEventListener('DOMContentLoaded', () => {
    // Add Submit Animation to all forms
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.classList.add('btn-submitting');
            }
        });
    });

    // Add Basket HTML to body if not present
    if (!document.getElementById('basket-drawer')) {
        const basketHTML = `
            <button class="basket-float" onclick="toggleBasket()">
                🛒 <span class="basket-badge" id="basket-badge">0</span>
            </button>
            <div class="basket-drawer" id="basket-drawer">
                <div class="basket-header">
                    <h3>Your Basket</h3>
                    <button class="close-basket" onclick="toggleBasket(false)">✕</button>
                </div>
                <div class="basket-items" id="basket-items">
                    <!-- Items injected here -->
                </div>
                <div class="basket-footer">
                    <div class="basket-total">
                        <span>Total</span>
                        <span id="basket-total-amount">€0.00</span>
                    </div>
                    <button class="btn checkout-btn" onclick="checkout()">Check Out</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', basketHTML);
    }
    // Add Combo Modal HTML
    if (!document.getElementById('combo-modal')) {
        const modalHTML = `
            <div class="combo-modal" id="combo-modal">
                <div class="modal-content">
                    <h2 id="combo-title" class="modal-title">Configure Combo</h2>
                    <div class="select-group">
                        <label class="select-label">Choose Burger</label>
                        <select id="combo-burger" class="select-input">
                            <option>Goat Byte Original</option>
                            <option>Spicy Goat Byte</option>
                            <option>Masala Goat Byte</option>
                            <option>Byte Classic</option>
                            <option>Double Byte</option>
                        </select>
                    </div>
                    <div class="select-group">
                        <label class="select-label">Choose Side</label>
                        <select id="combo-side" class="select-input">
                            <option>Classic Fries</option>
                            <option>Peri Peri Fries</option>
                            <option>Sweet Potato Fries</option>
                        </select>
                    </div>
                    <div class="select-group">
                        <label class="select-label">Choose Drink</label>
                        <select id="combo-drink" class="select-input">
                            <option>Coca-Cola</option>
                            <option>Fanta</option>
                            <option>Sprite</option>
                            <option>Mineral Water</option>
                        </select>
                    </div>
                    <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                        <button class="btn btn-outline" style="flex: 1" onclick="closeComboModal()">Cancel</button>
                        <button class="btn" style="flex: 1" onclick="confirmCombo()">Add to Basket</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    updateBasketUI();
});

// Old Logic (Keeping openOrderPage for simple links if any)
function openOrderPage(itemName) {
    gsap.to("body", { opacity: 0, duration: 0.3, onComplete: () => {
        window.location.href = `order.html?item=${encodeURIComponent(itemName)}`;
    }});
}
