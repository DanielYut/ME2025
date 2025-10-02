window.onload = function() {
    const master = document.getElementById("master");
    const checkboxes = document.querySelectorAll(".item-chk");
    const qtyInputs = document.querySelectorAll(".qty");
    const totalSpan = document.getElementById("total");
    const checkoutBtn = document.getElementById("checkout");

    // 更新單品小計
    function updateSubtotal(row) {
        let price = parseInt(row.querySelector(".price").textContent.replace("$", ""));
        let qty = parseInt(row.querySelector(".qty").value);
        row.querySelector(".subtotal").textContent = "$" + (price * qty);
    }

    // 更新總金額
    function updateTotal() {
        let sum = 0;
        document.querySelectorAll("tbody tr").forEach(row => {
            let chk = row.querySelector(".item-chk");
            if(chk.checked){
                let sub = parseInt(row.querySelector(".subtotal").textContent.replace("$", ""));
                sum += sub;
            }
        });
        totalSpan.textContent = sum;
    }

    // blur 驗證輸入數字
    qtyInputs.forEach(input => {
        input.addEventListener("blur", function() {
            let row = this.closest("tr");
            let stock = parseInt(row.querySelector(".stock").textContent);
            let val = parseInt(this.value);
            if(isNaN(val) || val < 1) val = 1;
            if(val > stock) val = stock;
            this.value = val;
            updateSubtotal(row);
            updateTotal();
        });
    });

    // checkbox 點擊也更新 total
    checkboxes.forEach(chk => {
        chk.addEventListener("change", function() {
            updateTotal();
            // 同步更新 master 狀態
            master.checked = Array.from(checkboxes).every(c => c.checked);
        });
    });

    
};
