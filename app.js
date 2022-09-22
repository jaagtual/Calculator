const add      = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide   = (a, b) => a / b;
let operationClicked = false;
const operations = ['+', '-', '*', '/'];

const operate = (operator, a, b) => {
    if      (operator === '+') return add(a, b);
    else if (operator === '-') return subtract(a, b);
    else if (operator === '*') return multiply(a, b);
    else if (operator === '/') return divide(a, b);
    else {
        console.error('Invalid operator');
    }
}

// add clicked buttons to screen
const screen = document.querySelector('.screen');
let started = false;
const screenBtns = document.querySelectorAll('.concat-screen');
screenBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (started) screen.innerText += btn.textContent;
        else {
            screen.innerText = btn.textContent;
            started = true;
        }
})
});

// clear button
const clearBtn = document.querySelector('#clear-btn');
clearBtn.addEventListener('click', () => {
    started = false;
    screen.innerText = '0';
    operationClicked = false;
});

// delete button
const deleteBtn = document.querySelector('#delete-btn');
deleteBtn.addEventListener('click', () => {
    if (!started) return;

    // check if deleting an operation
    if (operations.includes(screen.innerText.charAt(screen.innerText.length - 1))) operationClicked = false;

    let newStr;
    if (screen.innerText.length === 1){ 
        newStr = '0';
        started = false;
    } else newStr = screen.innerText.substring(0, screen.innerText.length - 1);

    screen.innerText = newStr;
});

// check if evaluation is valid
const isValidEval = evalStr => {
    let operations = ['+', '-', '*', '/']
    let invalidEnds = [...operations, '.'];
    let okStart = ['+', '-', '.'];// evalStr can start with these chars

    // starts or ends with invalid char
    for (let i = 0; i < invalidEnds.length; i++) {
        if ((evalStr.startsWith(invalidEnds[i]) && !okStart.includes(invalidEnds[i])) || 
            evalStr.endsWith(invalidEnds[i])) return false;
    }

    // two invalid chars next to each other
    for (let i = 1; i < evalStr.length; i++) {
        if (invalidEnds.includes(evalStr.charAt(i)) && 
            invalidEnds.includes(evalStr.charAt(i-1))) return false;
    }

    // contains an operation (can't be first +/-)
    let hasOp = false;
    const startIdx = okStart.includes(evalStr.charAt(0)) ? 1 : 0;
    for (let i = startIdx; i < evalStr.length; i++) {
        if (operations.includes(evalStr.charAt(i))) {
            hasOp = true;
            break;
        }
    }
    if (!hasOp) return false;
    
    return true;
}


// equal btn 
const evalExpression = evalStr => {
    const opIdx = [-1];

    // get indecies of operations
    for (let i = 0; i < evalStr.length; i++) {
        if (operations.includes(evalStr.charAt(i))) opIdx.push(i);
    }
    
    // evaluate expression
    let curEval;
    for (let i = 1; i < opIdx.length; i++) {
        let num1 = curEval || Number(evalStr.substring(opIdx[i-1] + 1, opIdx[i]));
        let op = evalStr.charAt(opIdx[i]);
        let num2 = Number(evalStr.substring(opIdx[i] + 1, opIdx[i + 1]));
        
        // set curEval
        switch (op) {
            case '+':
                curEval = add(num1, num2);
                break;
            case '-':
                curEval = subtract(num1, num2);
                break;
            case '*':
                curEval = multiply(num1, num2);
                break;
            case '/':
                curEval = divide(num1, num2);
                break;
            default:
                alert('Invalid operation')
        }
    }

    return curEval;
}

const equalBtn = document.querySelector('#equals');
equalBtn.addEventListener('click', () => {
    const evalStr = screen.innerText;
    if (!isValidEval(evalStr)) return;

    screen.innerText = (Math.round(evalExpression(evalStr) * 100) / 100).toString()

    operationClicked = false;
});

// evaluate expression when operation btn is clicked 
const opBtns = document.querySelectorAll('.operation');
opBtns.forEach(opBtn => {
    opBtn.addEventListener('click', () => {
        // evaluate the expression if there's and expression on the screen
        console.log(`op clicked: ${operationClicked}`)
        if (operationClicked) screen.innerText = evalExpression(screen.innerText) + opBtn.innerText;
        else                  operationClicked = true;
    });
})