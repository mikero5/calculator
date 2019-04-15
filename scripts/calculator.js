let global = {
  display: '',
  expression: '',
  answering: false,
  error: false
};

const display = document.querySelector('#display');

const gridContainer = document.querySelectorAll('.grid-element');
const gridContainerArray = Array.from(gridContainer);

window.addEventListener('keypress', function(e) {
  handleKeypress(e);
});

const MAX_INPUT_CHARS = 14;

for(d in gridContainerArray) {
  gridContainerArray[d].addEventListener('mouseover', function() {
    this.style.cssText = 'background-color: #7f7d67;';
    if(this.id === 'backspace') {
      
    }
  });

  gridContainerArray[d].addEventListener('mouseout', function() {
    if(this.id === 'plus' || this.id === 'minus' ||
    this.id === 'multiply' || this.id === 'divide') {
      this.style.cssText = 'background-color: #c50;';
    }
    else if (this.id === 'clear' || this.id === 'backspace' ||
    this.id === 'negate') {
      // this.style.cssText = 'background-color: #220;';
      this.style.cssText = 'background-color: lightgreen;';
    }
  else {
    this.style.cssText = 'background-color: #222;';
  }
  });

  gridContainerArray[d].addEventListener('click', function() {
    handleClick(this);
  });
}

//==========================================================================
//
// Initialize.
//
//==========================================================================

clearCalculator();

//==========================================================================

function handleKeypress(e) {
  if(global.error) clearCalculator();

  console.log(e);
  console.log(e.key);
  let key = e.key;
  let keyCode = e.keyCode;


  if(key === '+') {
    handlePlus();
    setAnswering(false);
    return;
  }
  if(key === '-'){
    handleMinus();
    setAnswering(false);
    return;
  }
  if(key === '*'){
    handleMultiply();
    setAnswering(false);
    return;
  }
  if(key === '/'){
    handleDivide();
    setAnswering(false);
    return;
  }
  if(key === 'Enter'){
    handleEqual();
    return;

  }
  if(key === '.'){
    handleDot();
    setAnswering(false);
    return;
  }
  if(key === ' '){
    clearCalculator();
    return;
  }
  if(key === 'Delete'){
    handleBackspace();
    setAnswering(false);
    return;
  }
  if(key === '~'){
    handleNegate();
    setAnswering(false);
    return;
  }

  if(global.answering) clearCalculator();

  acceptChar(key);
}

//------------------------------------
function handleClick(element) {
  if(global.error) clearCalculator();

  if(element.id === 'plus') {
    handlePlus();
    setAnswering(false);
    return;
  }

  if(element.id === 'minus') {
    handleMinus();
    setAnswering(false);
    return;
  }

  if(element.id === 'multiply') {
    handleMultiply();
    setAnswering(false);
    return;
  }

  if(element.id === 'divide') {
    handleDivide();
    setAnswering(false);
    return;
  }

  if(element.id === 'equal') {
    handleEqual();
    return;
  }

  if(element.id === 'dot') {
    handleDot();
    setAnswering(false);
    return;
  }

  if(element.id === 'clear') {
    clearCalculator();
    return;
  }

  if(element.id === 'backspace') {
    handleBackspace();
    setAnswering(false);
    return;
  }

  if(element.id === 'negate') {
    handleNegate();
    setAnswering(false);
    return;
  }

  if(global.answering) clearCalculator();

  acceptChar(element.textContent);
}

//------------------------------------
function setAnswering(flag) {
    let displayElement = document.querySelector('#display');
    if(flag) {
      global.answering = true;
      displayElement.style.cssText = 'font-weight: bold';
    }
    else {
      global.answering = false;
      displayElement.style.cssText = 'font-weight: normal';
    }
}

//------------------------------------
function acceptChar(char) {
  if(global.expression === '0') {
    global.expression = global.display = '';
  }

  let displayArray = global.display.split(' ');
  let numElements = displayArray.length;
  if(displayArray[numElements - 1].length >= MAX_INPUT_CHARS && !isOperator(char)) {
    return;
  }

  global.expression += char;

  if(isOperator(char))
    global.display += ' ' + char + ' ';
  else
    global.display += char;

  if(global.expression === '+' ||
    global.expression === '*' ||
    global.expression === '/') {
      global.expression = '0';
      global.display = '0';
  }

  display.textContent = global.display;
}

//------------------------------------
function isOperator(char) {
  if( char === '+' || char === '-' ||
      char === '*' || char === '/')
    return true;
  else
    return false;
}

//------------------------------------
function lastCharIsOperator() {
  let displayArray = global.display.split(' ');
  let lastDisplayElement = displayArray[displayArray.length - 1];

  if(lastDisplayElement.length === 1) return false;

  let lastChar = global.expression.slice(-1);

  return isOperator(lastChar);
}

//------------------------------------
function handlePlus() {
  if(lastCharIsOperator()) return;

  acceptChar('+');
}

//------------------------------------
function handleMinus() {
  if(lastCharIsOperator()) return;

  acceptChar('-');
}

//------------------------------------
function handleMultiply() {
  if(lastCharIsOperator()) return;

  acceptChar('*');
}

//------------------------------------
function handleDivide() {
  if(lastCharIsOperator()) return;

  acceptChar('/');
}

//------------------------------------
function handleDot() {
  if(lastCharIsOperator()) return;

  let displayArray = global.display.split(' ');
  let dotIndex = displayArray.indexOf('.');
  if( dotIndex > -1) return;

  acceptChar('.');
}

//------------------------------------
function handleEqual() {
  if(lastCharIsOperator()) return;

  setAnswering(true);
  display.textContent = prepOutput(evaluate());
}

//------------------------------------
function prepOutput(outputString) {
  let dotIndex = outputString.indexOf('.');
  if(dotIndex > -1) {
    outputString = outputString.substr(0, dotIndex + 5);
  }
  global.display = global.expression = outputString;
  return outputString;
}

//------------------------------------
function handleNegate() {
  if(lastCharIsOperator()) return;

  let expressionArray = global.expression.split('');
  let displayArray = global.display.split(' ');
  let number = displayArray.pop();
  let expressionIndex = expressionArray.length - number.length;

  if(number.charAt(0) === '-') {
    number = number.substr(1);
    expressionArray.splice(expressionIndex, 1);
  }
  else {
    number = '-' + number;
    expressionArray.splice(expressionIndex, 0, '-');
  }

  displayArray.push(number);
  global.display = displayArray.join(' ');
  global.expression = expressionArray.join('');
  display.textContent = global.display;
}

//------------------------------------
function evaluate() {
  setAnswering(true);

  let displayArray = global.display.split(' ');
  let mathArray = [];
  let skip = null;

  for(t in displayArray) {
    if(skip === true) {
      skip = false;
      continue;
    }

    let token = displayArray[t];

    if(token === '*' || token === '/') {
      let next = Number(t) + 1;
      let op1 = mathArray.pop();
      let op2 = displayArray[next];
      skip = true;

      let result = Number(op1);
      if(token === '*'){
        result *= Number(op2);
      }
      else {
        result /= Number(op2);
      }
      mathArray.push(String(result));
    }
    else {
      mathArray.push(token);
    }
  } // for(t in displayArray)

  skip = false;
  result = Number(mathArray[0]);

  for(t in mathArray) {
    if(skip === true) {
      skip = false;
      continue;
    }

    let operator = null;
    token = mathArray[t];

    if(token === '+' || token === '-') {
      next = Number(t) + 1;

      if(token === '+'){
        result += Number(mathArray[next]);
      }
      else {
        result -= Number(mathArray[next]);
      }
      skip = true;
    }
  } // for(t in mathArray)

  global.display = String(result);
  global.expression = global.display;

  return global.display;
}

//------------------------------------
function clearDisplayOnly() {
    global.display = '0';
    global.expression = '0';
    display.textContent = global.display;
}

//------------------------------------
function clearCalculator() {
  clearDisplayOnly();
  setAnswering(false);
  global.error = false;
}

//------------------------------------
function handleBackspace() {
  let expressionArray = global.expression.split('');
  let displayArray = global.display.split('');

  if(lastCharIsOperator()) {
    expressionArray.splice(-1);
    displayArray.splice(-3);
  }
  else {
    expressionArray.splice(-1);
    displayArray.splice(-1);
  }

  global.expression = expressionArray.join('');
  global.display = displayArray.join('');

  if(global.expression === '') global.expression = '0';
  if(global.display === '') global.display = '0';

  if(global.display === global.expression === '0')
    clearCalculator();

  display.textContent = global.display;
}
