// Array to hold cart items
let cart = [];

// Toggle Cart Sidebar Open/Close
function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar.style.right === '0px') {
        sidebar.style.right = '-400px';
    } else {
        sidebar.style.right = '0px';
    }
}

// Find all Add to Cart buttons and add click events
document.addEventListener('DOMContentLoaded', () => {
    const addButtons = document.querySelectorAll('.card button');
    
    addButtons.forEach(button => {
        if (button.textContent.includes('Add to Cart')) {
            button.addEventListener('click', (e) => {
                const card = e.target.closest('.card');
                
                // Get product details from the card
                const name = card.querySelector('h3').textContent;
                const priceText = card.querySelector('p').textContent;
                const price = parseFloat(priceText.replace('$', ''));
                const size = card.querySelector('select').value;
                const quantity = parseInt(card.querySelector('input[type="number"]').value) || 1;
                const imageSrc = card.querySelector('img').src;

                addToCart(name, price, size, quantity, imageSrc);
            });
        }
    });
});

// Add item to cart array with SweetAlert
function addToCart(name, price, size, quantity, image) {
    const existingItem = cart.find(item => item.name === name && item.size === size);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ name, price, size, quantity, image });
    }
    
    updateCartUI();
    
    // Open the cart sidebar automatically
    document.getElementById('cart-sidebar').style.right = '0px';

    // SweetAlert popup with standard concatenation (No backtick bugs!)
    swal({
        title: "Added to Cart!",
        text: quantity + "x " + name + " (" + size + ") has been added.",
        icon: "success",
        button: "Awesome",
    });
}

// Update the Cart visual display
function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalContainer = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="color: #888; text-align: center;">Your cart is empty.</p>';
        cartTotalContainer.textContent = '$0.00';
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        
        // This section uses standard strings to avoid syntax errors
        cartItemsContainer.innerHTML += 
            '<div style="display: flex; gap: 10px; align-items: center; border-bottom: 1px solid #222; padding-bottom: 10px;">' +
                '<img src="' + item.image + '" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">' +
                '<div style="flex-grow: 1;">' +
                    '<h4 style="margin: 0; font-size: 14px;">' + item.name + '</h4>' +
                    '<p style="margin: 2px 0; font-size: 12px; color: #aaa;">Size: ' + item.size + ' | Qty: ' + item.quantity + '</p>' +
                    '<p style="margin: 0; font-size: 12px; font-weight: bold;">$' + (item.price * item.quantity).toFixed(2) + '</p>' +
                '</div>' +
                '<button onclick="removeFromCart(' + index + ')" style="background: none; border: none; color: #ff4d4d; cursor: pointer; font-size: 14px;">Remove</button>' +
            '</div>';
    });
    
    cartTotalContainer.textContent = '$' + total.toFixed(2);
}

// Remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// Checkout action with SweetAlert
function startCheckout() {
    if (cart.length === 0) {
        swal({
            title: "Empty Cart!",
            text: "Please add some items to your cart before checking out.",
            icon: "warning",
            button: "Okay",
        });
        return;
    }

    swal({
        title: "Proceeding to Checkout?",
        text: "Your total is " + document.getElementById('cart-total').textContent + ". Ready to pay?",
        icon: "info",
        buttons: ["Cancel", "Yes, Let's Go!"],
    }).then((willCheckout) => {
        if (willCheckout) {
            swal("Redirecting...", "Sending you to the payment gateway!", "success");
        }
    });
}

// Crash-proof Search Bar Functionality
document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('search-input'); 
    
    if (searchBar) {
        searchBar.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            const cards = document.querySelectorAll('.card'); 

            cards.forEach(card => {
                // Safety check: Find the h3 tag
                const heading = card.querySelector('h3');
                
                // If the h3 exists, read its text and filter. If not, don't crash!
                if (heading) {
                    const productName = heading.textContent.toLowerCase();
                    if (productName.includes(searchTerm)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                } else {
                    // If a card doesn't have an h3, just keep it visible (or hide it)
                    card.style.display = searchTerm === '' ? 'block' : 'none';
                }
            });
        });
    }
});