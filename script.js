
const WHATSAPP = "918766817272";
const menuItems = [('vegetarian', 'Vegetable Samosa', 'Crispy pastry stuffed with spiced potatoes, peas, and herbs.', 4.5, '🥟', 'Starters'), ('vegetarian', 'Onion Bhaji', 'Deep-fried onion fritters with chickpea flour and Indian spices.', 5.0, '🧅', 'Starters'), ('nonveg', 'Chicken Tikka', 'Tender boneless chicken marinated in yogurt and spices, grilled to perfection.', 7.5, '🍢', 'Starters'), ('vegetarian', 'Paneer Tikka', 'Grilled cottage cheese cubes with bell peppers and onions in tandoori spices.', 7.0, '🧀', 'Starters'), ('nonveg', 'Butter Chicken', 'Juicy chicken pieces in a creamy tomato butter gravy — mildly spiced and rich.', 10.5, '🍛', 'Mains'), ('nonveg', 'Tandoori Chicken', 'Chicken marinated overnight in yogurt and spices, roasted in tandoor style.', 8.5, '🍗', 'Mains'), ('nonveg', 'Fish Curry', 'Fish fillets in a coconut-based spicy curry with curry leaves and mustard seeds.', 11.5, '🐟', 'Mains'), ('nonveg', 'Chicken Biryani', 'Fragrant basmati rice cooked with marinated chicken, saffron, and spices.', 11.0, '🍚', 'Mains')];
let activeCategory = "All";
let cart = JSON.parse(localStorage.getItem("farmCafeCart") || "[]");

const menu = document.querySelector(".menu-grid");
const cartPanel = document.getElementById("cartPanel");
const backdrop = document.getElementById("backdrop");
const cartItemsEl = document.getElementById("cartItems");

function money(n) { return "₹" + n.toFixed(2); }

function renderMenu() {
  const filtered = activeCategory === "All" ? menuItems : menuItems.filter(i => i[6] === activeCategory);
  menu.innerHTML = filtered.map(i => `
    <article class="menu-card">
      <div class="food-icon">${i[5]}</div>
      <div class="item-content">
        <div class="item-top">
          <h3 class="item-name">${i[1]}</h3>
          <span class="type ${i[0]}">${i[0] === "vegetarian" ? "🟢 VEG" : "🔴 NON-VEG"}</span>
        </div>
        <p class="item-desc">${i[2]}</p>
        <div class="item-bottom">
          <span class="price">${money(i[3])}</span>
          <button class="add-btn" onclick="addToCart('${i[1]}')">+ Add</button>
        </div>
      </div>
    </article>`).join("");
}

window.addToCart = function(name) {
  const found = cart.find(x => x.name === name);
  if(found) found.qty++;
  else {
    const i = menuItems.find(x => x[1] === name);
    cart.push({name:i[1], price:i[3], qty:1});
  }
  saveCart();
}

function saveCart() {
  localStorage.setItem("farmCafeCart", JSON.stringify(cart));
  renderCart();
}

function renderCart() {
  const count = cart.reduce((s,x) => s+x.qty, 0);
  const total = cart.reduce((s,x) => s+x.price*x.qty, 0);
  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartTotal").textContent = money(total);
  if(!cart.length) {
    cartItemsEl.innerHTML = '<div class="empty">Your cart is empty ☕<br><small>Add something delicious!</small></div>';
    return;
  }
  cartItemsEl.innerHTML = cart.map((x,idx) => `
    <div class="cart-item">
      <div class="cart-item-top"><div><strong>${x.name}</strong><small>${money(x.price)} each</small></div><strong>${money(x.price*x.qty)}</strong></div>
      <div class="qty-controls">
        <button onclick="changeQty(${idx},-1)">−</button><b>${x.qty}</b><button onclick="changeQty(${idx},1)">+</button>
        <button onclick="removeItem(${idx})" style="margin-left:auto;width:auto;padding:0 10px;border-radius:8px">Remove</button>
      </div>
    </div>`).join("");
}

window.changeQty = function(idx,delta) {
  cart[idx].qty += delta;
  if(cart[idx].qty <= 0) cart.splice(idx,1);
  saveCart();
}
window.removeItem = function(idx) { cart.splice(idx,1); saveCart(); }

document.querySelectorAll("#categoryTabs button").forEach(btn => btn.addEventListener("click", () => {
  document.querySelector("#categoryTabs .active").classList.remove("active");
  btn.classList.add("active"); activeCategory = btn.dataset.category; renderMenu();
}));

function openCart() { cartPanel.classList.add("open"); backdrop.classList.add("show"); }
function closeCart() { cartPanel.classList.remove("open"); backdrop.classList.remove("show"); }
document.getElementById("cartBtn").onclick = openCart;
document.getElementById("closeCart").onclick = closeCart;
backdrop.onclick = closeCart;

const checkoutModal = document.getElementById("checkoutModal");
document.getElementById("checkoutBtn").onclick = () => {
  if(!cart.length) { alert("Your cart is empty!"); return; }
  closeCart(); checkoutModal.classList.add("show");
};
document.getElementById("closeModal").onclick = () => checkoutModal.classList.remove("show");

document.getElementById("sendWhatsapp").onclick = () => {
  const name = document.getElementById("customerName").value.trim();
  const table = document.getElementById("tableNumber").value.trim();
  const instructions = document.getElementById("instructions").value.trim();
  if(!name || !table) { alert("Please enter your name and table number."); return; }
  const total = cart.reduce((s,x) => s+x.price*x.qty,0);
  let message = `🌿 *FARM CAFE – NEW ORDER* 🌿\n\n👤 *Customer:* ${name}\n🪑 *Table:* ${table}\n\n🍽️ *ORDER DETAILS*\n`;
  cart.forEach((x,i) => message += `${i+1}. ${x.name} × ${x.qty} — ${money(x.price*x.qty)}\n`);
  message += `\n💰 *TOTAL: ${money(total)}*`;
  if(instructions) message += `\n\n📝 *Instructions:* ${instructions}`;
  message += `\n\nThank you for ordering from Farm Cafe! ☕`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`, "_blank");
};

renderMenu(); renderCart();
