let expression = "";

document.write('<input type="text" id="display" readonly><br>');

let buttons = [
  "0","1","2","3","4","5","6","7","8","9",
  "+","-","*","/","(",")","=","clear"
];

for (let i = 0; i < buttons.length; i++) {
  let b = buttons[i];
  document.write('<button onclick="press(\''+ b +'\')">'+ b +'</button>');

  if ((i+1) % 5 === 0) document.write("<br>");
}

function press(value) {
  let display = document.getElementById("display");

  if (value === "clear") {
    expression = "";
    display.value = "";
  } else if (value === "=") {
    try {
      let result = eval(expression); 
      alert(expression + " = " + result); 
      expression = result; 
      display.value = result;
    } catch (e) {
      alert("算式錯誤");
    }
  } else {
    expression += value;
    display.value = expression;
  }
}