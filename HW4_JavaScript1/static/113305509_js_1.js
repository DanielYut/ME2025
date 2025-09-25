document.getElementById("guess").addEventListener("click", function(){
    let num = Number(document.getElementById("num").value);
    if(num > 100 || num < 0){
        alert("輸入錯誤")
    }else{
        alert(num);
    }
});