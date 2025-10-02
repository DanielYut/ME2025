let count = 0;
let r = Math.floor(Math.random() * 101);

let startTime = null;
let timerInterval = null;

function updateTimer() {
    if (startTime !== null) {
        let timePassed = ((Date.now() - startTime) / 1000).toFixed(2);
        document.getElementById("timer").textContent = timePassed;
    }
}

document.getElementById("guess").addEventListener("click", function(){
    let num = Number(document.getElementById("num").value);
    let hint = document.getElementById("hint");
    let timer = document.getElementById("timer");
    let guessLog = document.getElementById("guessLog"); 
    if(num > 100 || num < 0){
        hint.textContent = "輸入錯誤，請輸入 0~100 之間的數字";
    }else{
        if (startTime === null) {
            startTime = Date.now();
            timerInterval = setInterval(updateTimer, 100);
        }
        count++;

        let currentTime = timer.textContent;
        let now = new Date().toLocaleTimeString();

        
        let record = document.createElement("p");
        record.textContent = `第 ${count} 次：${currentTime} 秒 (${now})`;
        guessLog.appendChild(record);

        if(num > r){
            hint.textContent = "太大了";
        }else if(num < r){
            hint.textContent = "太小了";
        }else if(num = r){
            let timeUsed = document.getElementById("timer").textContent;
            clearInterval(timerInterval);
            alert(`你猜了${count}次 花${timeUsed}秒`);
            r = Math.floor(Math.random() * 101);
            count = 0;
        }
    }
});