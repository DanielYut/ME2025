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
    if(num > 100 || num < 0){
        alert("輸入錯誤")
    }else{
        if (startTime === null) {
            startTime = Date.now();
            timerInterval = setInterval(updateTimer, 100);
        }
        count++;
        if(num > r){
            alert("太大了");
        }else if(num < r){
            alert("太小了");
        }else{
            clearInterval(timerInterval);
            alert("猜到了 你猜了"+count+"次");
            r = Math.floor(Math.random() * 101);
            count = 0;
        }
    }
});