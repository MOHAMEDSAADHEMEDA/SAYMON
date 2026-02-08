// إدارة سلة المشتريات

function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContent = document.getElementById('cart-content');
    
    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="empty-cart">
                <h2>🛒 سلتك فارغة</h2>
                <p>لم تضف أي منتجات إلى السلة حتى الآن</p>
                <button class="back-btn" onclick="window.location.href='shop.html'">← العودة للمتجر</button>
            </div>
        `;
        return;
    }

    // عرض ملخص السلة
    const cartSummary = `
        <div class="cart-summary">
            <p>📦 عدد المنتجات: ${cart.length}</p>
            <p>الإجمالي: <strong id="total-price">جاري الحساب...</strong></p>
        </div>
    `;

    // بناء جدول السلة
    let tableHTML = `
        <table class="cart-table">
            <thead>
                <tr>
                    <th>الرقم</th>
                    <th>اسم المنتج</th>
                    <th>تاريخ الإضافة</th>
                    <th>الإجراء</th>
                </tr>
            </thead>
            <tbody>
    `;

    cart.forEach((item, index) => {
        const date = new Date(item.addedAt).toLocaleString('ar-EG');
        tableHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${date}</td>
                <td>
                    <button class="remove-btn" onclick="removeFromCart('${item.id}', ${index})">🗑️ إزالة</button>
                </td>
            </tr>
        `;
    });

    tableHTML += `
            </tbody>
        </table>
    `;

    const actionButtons = `
        <div style="text-align: center;">
            <button class="back-btn" onclick="window.location.href='shop.html'">← العودة للمتجر</button>
            <button class="checkout-btn" onclick="checkout()">✅ إتمام الشراء</button>
        </div>
    `;

    cartContent.innerHTML = cartSummary + tableHTML + actionButtons;
}

function removeFromCart(productId, index) {
    if (confirm('هل تريد إزالة هذا المنتج من السلة؟')) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
    }
}

function checkout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('❌ السلة فارغة!');
        return;
    }

    const message = `
تفاصيل الشراء:
────────────
📦 عدد المنتجات: ${cart.length}
المنتجات:
${cart.map((item, i) => `${i + 1}. ${item.name}`).join('\n')}
────────────
شكراً لتسوقك معنا! 🎉

(ميزة الدفع قيد التطوير)
    `;
    alert(message);
}

// تحميل السلة عند فتح الصفحة
document.addEventListener('DOMContentLoaded', loadCart);
