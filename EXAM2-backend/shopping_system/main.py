from flask import Flask, request, jsonify, render_template, session, redirect, url_for
from datetime import datetime
import sqlite3
import logging
import re
import os

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'  # Session 必須

# ===== 資料庫連線 =====
def get_db_connection():
    db_path = os.path.join(os.path.dirname(__file__), 'shopping_data.db')
    if not os.path.exists(db_path):
        logging.error(f"Database file not found at {db_path}")
        return None
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

# ===== 註冊頁面 =====
@app.route('/page_register', methods=['GET', 'POST'])
def page_register():
    if request.method == 'POST':
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')

        # 驗證密碼長度
        if len(password) < 8:
            return jsonify({"status": "error", "message": "密碼至少需 8 個字元"})
        
        if not re.search(r'[A-Z]', password) or not re.search(r'[a-z]', password):
            return jsonify({"status": "error", "message": "密碼必須包含至少 1 個大寫與 1 個小寫英文字母"})

        # 驗證 Email 格式
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            return jsonify({"status": "error", "message": "Email 格式不正確"})

        conn = get_db_connection()
        if conn is None:
            return jsonify({"status": "error", "message": "資料庫連線失敗"})
        cursor = conn.cursor()

        # 檢查帳號是否存在
        cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
        user = cursor.fetchone()
        if user:
            conn.close()
            return jsonify({"status": "error", "message": "此名稱已被使用"})

        # 新增使用者
        cursor.execute(
            "INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
            (username, password, email)
        )
        conn.commit()
        conn.close()

        return jsonify({"status": "success", "message": "註冊成功"})
    return render_template('page_register.html')


# ===== 登入函式 =====
def login_user(username, password):
    conn = get_db_connection()
    if conn is not None:
        try:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT * FROM users WHERE username = ? AND password = ?",
                (username, password)
            )
            user = cursor.fetchone()
            if user:
                return {"status": "success", "message": "Login successful"}
            else:
                return {"status": "error", "message": "帳號或密碼錯誤"}
        except sqlite3.Error as e:
            logging.error(f"Database query error: {e}")
            return {"status": "error", "message": "發生錯誤"}
        finally:
            conn.close()
    else:
        return {"status": "error", "message": "資料庫連線錯誤"}


# ===== 登入頁面 =====
@app.route('/page_login', methods=['GET', 'POST'])
def page_login():
    if request.method == 'POST':
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        result = login_user(username, password)
        if result["status"] == "success":
            session['username'] = username
        return jsonify(result)
    return render_template('page_login.html')


# ===== 登出 =====
@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('page_login'))


# ===== 首頁 / 購物頁面 =====
@app.route('/')
def index():
    if 'username' not in session:
        return redirect(url_for('page_login'))
    username = session['username']
    return render_template('index.html', username=username)

@app.route('/place_order', methods=['POST'])
def place_order():
    if 'username' not in session:
        return jsonify({"status": "error", "message": "未登入"})

    data = request.get_json()
    order_items = data.get("items", [])

    if not order_items:
        return jsonify({"status": "error", "message": "沒有訂單資料"})

    conn = get_db_connection()
    cursor = conn.cursor()

    for item in order_items:
        cursor.execute("""
    INSERT INTO shop_list_table (`Product`, `Price`, `Number`, `Total Price`, `Date`, `Time`)
    VALUES (?, ?, ?, ?, DATE('now','localtime'), substr(TIME('now','localtime'), 1, 5))
""", (
    item['name'],
    item['price'],
    item['qty'],
    item['total']
))

    conn.commit()
    conn.close()

    return jsonify({"status": "success", "message": "下單成功"})

if __name__ == '__main__':
    app.run(debug=True)