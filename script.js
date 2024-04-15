// Function to calculate factorial
function factorial(n) {
  if (n === 0 || n === 1) {
    return 1;
  }
  return n * factorial(n - 1);
}

// Function to handle button click
function calculateFactorial() {
  const numberInput = document.getElementById("number");
  const number = parseInt(numberInput.value);

  if (isNaN(number)) {
    alert("Please enter a valid number");
    return;
  }

  //   Creating a Web Worker
  const worker = new Worker("worker.js");

  //   Send number to worker
  worker.postMessage(number);

  //   Recieve result from worker
  worker.onmessage = function (event) {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `Factorial of ${number} is ${event.data}`;
  };
}
