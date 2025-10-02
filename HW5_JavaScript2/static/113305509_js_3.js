let round = 1;  
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
        return;
    }

    if (startTime === null) {
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 100);
    }

    count++;

    if(num > r){
        hint.textContent = "太大了";
    } else if(num < r){
        hint.textContent = "太小了";
    } else if(num === r){
        let timeUsed = timer.textContent;
        clearInterval(timerInterval);

        
        alert(`回合 ${round} 猜對了！共猜了 ${count} 次，耗時 ${timeUsed} 秒`);

        
        let record = document.createElement("p");
        record.textContent = ` 回合 ${round}：${count} 次，耗時 ${timeUsed} 秒`;
        record.style.color = "green";
        guessLog.appendChild(record);

        
        round++;
        count = 0;
        r = Math.floor(Math.random() * 101);
        startTime = null;  
        timer.textContent = "0.00";
        hint.textContent = "";
    }
});
