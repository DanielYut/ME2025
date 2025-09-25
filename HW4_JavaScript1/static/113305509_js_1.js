let N = 98;
let r = Math.floor(Math.random() * (N + 1)) + 1; 

document.getElementById("guess").addEventListener("click", function(){
    let num = Number(document.getElementById("num").value);
    if(num > 100 || num < 0){
        alert("輸入錯誤")
    }else{
        if(num > r){
            alert("太大了");
        }else if(num < r){
            alert("太小了");
        }else{
            alert("猜到了");
            r = Math.floor(Math.random() * (N + 1)) + 1; 
        }
        
    }
});