let count = 0;
let r = Math.floor(Math.random() * 101);

document.getElementById("guess").addEventListener("click", function(){
    let num = Number(document.getElementById("num").value);
    if(num > 100 || num < 0){
        alert("輸入錯誤")
    }else{
        count++;
        if(num > r){
            alert("太大了");
        }else if(num < r){
            alert("太小了");
        }else{
            alert("猜到了 你猜了"+count+"次");
            r = Math.floor(Math.random() * (N + 1)) + 1;
            count = 0;
        }
        
    }
});