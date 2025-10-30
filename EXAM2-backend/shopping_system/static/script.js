// === 產品資料 ===
const products = [
  {'name': 'T-Shirt',       'price': 25, 'gender': '男裝', 'category': '上衣',   'image_url': '.../static/img/T-Shirt.png'},
  {'name': 'Blouse',        'price': 30, 'gender': '女裝', 'category': '上衣',   'image_url': '.../static/img/Blouse.png'},
  {'name': 'Jeans',         'price': 50, 'gender': '通用', 'category': '褲/裙子', 'image_url': '.../static/img/Jeans.png'},
  {'name': 'Skirt',         'price': 40, 'gender': '女裝', 'category': '褲/裙子', 'image_url': '.../static/img/Skirt.png'},
  {'name': 'Sneakers',      'price': 60, 'gender': '通用', 'category': '鞋子',   'image_url': '.../static/img/Sneakers.png'},
  {'name': 'Leather Shoes', 'price': 80, 'gender': '男裝', 'category': '鞋子',   'image_url': '.../static/img/LeatherShoes.png'},
  {'name': 'Baseball Cap',  'price': 20, 'gender': '通用', 'category': '帽子',   'image_url': '.../static/img/BaseballCap.png'},
  {'name': 'Sun Hat',       'price': 25, 'gender': '女裝', 'category': '帽子',   'image_url': '.../static/img/SunHat.png'},
  {'name': 'Running Shoes', 'price': 85, 'gender': '通用', 'category': '鞋子',   'image_url': '.../static/img/RunningShoes.png'},
  {'name': 'Dress',         'price': 75, 'gender': '女裝', 'category': '上衣',   'image_url': '.../static/img/Dress.png'}
];

// === 狀態管理 ===
const rowState = new Map();

// === 工具：規整圖片路徑 ===
function normalizeImg(url = '') {
  return url.replace(/\/{2,}/g, '/').replace('../static', './static');
}

// === 渲染產品表格 ===
function display_products(products_to_display) {
  const tbody = document.querySelector('#products table tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  for (let i = 0; i < products_to_display.length; i++) {
    const p = products_to_display[i];
    const key = `${p.name}-${i}`;
    if (!rowState.has(key)) rowState.set(key, { checked: false, qty: 0 });

    const state = rowState.get(key);
    const price = Number(p.price) || 0;
    const total = price * (state.qty || 0);

    const product_info = `
      <tr data-key="${key}">
        <td><input type="checkbox" class="row-check" ${state.checked ? 'checked' : ''}></td>
        <td><img src="${normalizeImg(p.image_url)}" alt="${p.name}" style="width:56px;height:56px;object-fit:cover;border:1px solid #e5e7eb;border-radius:6px;"></td>
        <td>${p.name}</td>
        <td data-price="${price}">${price.toLocaleString()}</td>
        <td>${p.gender}</td>
        <td>${p.category}</td>
        <td>
          <div class="qty" style="display:inline-flex;align-items:center;gap:6px;">
            <button type="button" class="btn-dec" style="padding:2px 8px;" ${state.checked && state.qty>1 ? '' : 'disabled'}>-</button>
            <input type="number" class="qty-input" min="0" value="${state.qty}" style="width:64px;" ${state.checked ? '' : 'readonly'}>
            <button type="button" class="btn-inc" style="padding:2px 8px;" ${state.checked ? '' : 'disabled'}>+</button>
          </div>
        </td>
        <td class="row-total">${total.toLocaleString()}</td>
      </tr>
    `;
    tbody.insertAdjacentHTML('beforeend', product_info);
  }

  refreshSummary();
}

// === 更新列總價 ===
function updateRowTotal(tr) {
  const price = Number(tr.querySelector('[data-price]')?.dataset?.price || 0);
  const qty = Number(tr.querySelector('.qty-input')?.value || 0);
  const totalCell = tr.querySelector('.row-total');
  if (totalCell) totalCell.textContent = (price * qty).toLocaleString();
}

// === 更新合計與下單按鈕 ===
function refreshSummary() {
  const tbody = document.querySelector('#products table tbody');
  if (!tbody) return;

  let selectedCount = 0;
  let totalQty = 0;
  let totalPrice = 0;

  tbody.querySelectorAll('tr').forEach(tr => {
    const chk = tr.querySelector('.row-check');
    const qty = Number(tr.querySelector('.qty-input')?.value || 0);
    const price = Number(tr.querySelector('[data-price]')?.dataset?.price || 0);
    if (chk?.checked && qty > 0) {
      selectedCount += 1;
      totalQty += qty;
      totalPrice += qty * price;
    }
  });

  const btnOrder = document.getElementById('place-order');
  if (btnOrder) {
    if (selectedCount > 0 && totalQty > 0) {
      btnOrder.disabled = false;
      btnOrder.style.backgroundColor = '#2563eb';
      btnOrder.style.color = '#fff';
      btnOrder.style.cursor = 'pointer';
      btnOrder.style.opacity = '1';
    } else {
      btnOrder.disabled = true;
      btnOrder.style.backgroundColor = '#ccc';
      btnOrder.style.color = '#fff';
      btnOrder.style.cursor = 'not-allowed';
      btnOrder.style.opacity = '0.6';
    }
  }

  const summaryEl = document.getElementById('cart-summary');
  if (summaryEl) {
    summaryEl.textContent =
      `已選 ${selectedCount} 項、總數量 ${totalQty}、總金額 $${totalPrice.toLocaleString()}`;
  }
}

// === 綁定表格事件（勾選 / ± /輸入數量）===
(function bindTableEvents() {
  const tbody = document.querySelector('#products table tbody');
  if (!tbody) return;

  tbody.addEventListener('change', (e) => {
    const tr = e.target.closest('tr');
    if (!tr) return;
    const key = tr.getAttribute('data-key');
    const st = rowState.get(key);

    if (e.target.classList.contains('row-check')) {
      st.checked = e.target.checked;

      const input = tr.querySelector('.qty-input');
      const btnDec = tr.querySelector('.btn-dec');
      const btnInc = tr.querySelector('.btn-inc');

      if (st.checked) {
        if (st.qty === 0) st.qty = 1;
        input.value = st.qty;
        input.readOnly = false;
        btnInc.disabled = false;
        btnDec.disabled = st.qty <= 1;
      } else {
        st.qty = 0;
        input.value = 0;
        input.readOnly = true;
        btnInc.disabled = true;
        btnDec.disabled = true;
      }

      rowState.set(key, st);
      updateRowTotal(tr);
      refreshSummary();
    }
  });

  tbody.addEventListener('click', (e) => {
    const tr = e.target.closest('tr');
    if (!tr) return;
    const key = tr.getAttribute('data-key');
    const st = rowState.get(key);
    const input = tr.querySelector('.qty-input');
    const btnDec = tr.querySelector('.btn-dec');
    const btnInc = tr.querySelector('.btn-inc');

    if (e.target.classList.contains('btn-dec')) {
      st.qty = Math.max(1, st.qty - 1);
      input.value = st.qty;
      btnDec.disabled = st.qty <= 1;
    }
    if (e.target.classList.contains('btn-inc')) {
      st.qty += 1;
      input.value = st.qty;
      btnDec.disabled = st.qty <= 1;
    }

    rowState.set(key, st);
    updateRowTotal(tr);
    refreshSummary();
  });

  tbody.addEventListener('input', (e) => {
    if (!e.target.classList.contains('qty-input')) return;
    const tr = e.target.closest('tr');
    const key = tr.getAttribute('data-key');
    const st = rowState.get(key);

    let v = Math.max(1, Number(e.target.value || 1));
    e.target.value = v;
    st.qty = v;

    const btnDec = tr.querySelector('.btn-dec');
    btnDec.disabled = v <= 1;

    rowState.set(key, st);
    updateRowTotal(tr);
    refreshSummary();
  });
})();

// === 確保下單按鈕存在 ===
(function ensureOrderButton() {
  if (!document.getElementById('place-order')) {
    const wrap = document.createElement('div');
    wrap.className = 'footer-actions';
    wrap.style.position = 'fixed';
    wrap.style.left = '12px';
    wrap.style.bottom = '12px';
    wrap.style.background = '#fff';
    wrap.style.border = '1px solid #e5e7eb';
    wrap.style.borderRadius = '8px';
    wrap.style.padding = '10px 12px';
    wrap.style.boxShadow = '0 6px 18px rgba(0,0,0,.06)';
    wrap.style.zIndex = '20';

    const btn = document.createElement('button');
    btn.id = 'place-order';
    btn.textContent = '下單';
    btn.disabled = true;
    btn.style.background = '#2563eb';
    btn.style.color = '#fff';
    btn.style.border = 'none';
    btn.style.padding = '8px 14px';
    btn.style.borderRadius = '6px';
    btn.style.cursor = 'pointer';

    const span = document.createElement('span');
    span.id = 'cart-summary';
    span.style.marginLeft = '12px';
    span.style.color = '#475569';

    wrap.appendChild(btn);
    wrap.appendChild(span);
    document.body.appendChild(wrap);

    // 綁定下單
    btn.addEventListener('click', async () => {
    const tbody = document.querySelector('#products table tbody');
    const orderItems = [];
    let totalSum = 0;

    tbody.querySelectorAll('tr').forEach(tr => {
      const chk = tr.querySelector('.row-check');
      if (!chk?.checked) return;
      const qty = Number(tr.querySelector('.qty-input')?.value || 0);
      if (qty <= 0) return;;
      const name = tr.children[2]?.textContent?.trim() || '';
      const price = Number(tr.querySelector('[data-price]')?.dataset?.price || 0);
      const total = price * qty;
      orderItems.push({ name, price, qty, total });
      totalSum += total;
    });

    if (!orderItems.length) return alert("請選擇商品");

    // ✅ 依照作業格式 alert
    const now = new Date();
    const dateStr = now.toLocaleDateString('zh-TW'); 
    const timeStr = now.toLocaleTimeString('zh-TW', { hour12: false });

    let msg = `${dateStr} ${timeStr}，已成功下單：\n\n`;
    orderItems.forEach(item => {
      msg += `${item.name}: ${item.price} NT/件 x${item.qty} 共 ${item.total} NT\n`;
    });
    msg += `\n此單花費總金額：${totalSum} NT`;

    alert(msg);

    // ✅ 送到 Flask
    const res = await fetch("/place_order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: orderItems })
    });

    const data = await res.json();
    if (data.status === "success") {
      location.reload(); // 清畫面
    }
  });
  }
})();

// === 首次渲染 ===
document.addEventListener('DOMContentLoaded', () => {
  display_products(products);
});
