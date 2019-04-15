let global = {
  display: '',
  expression: '',
  answering: false,
  error: false
};

const display = document.querySelector('#display');

const gridContainer = document.querySelectorAll('.grid-element');
const gridContainerArray = Array.from(gridContainer);

const MAX_INPUT_CHARS = 14;

for(d in gridContainerArray) {
  gridContainerArray[d].addEventListener('mouseover', function() {
    this.style.cssText = 'background-color: #7f7d67;';
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
  console.log('displayArray: ' + displayArray);

  for(token in displayArray) {
    if(displayArray[token] === '*' || displayArray[token] === '/') {
      let operation = displayArray.splice(token-1, 3);

      console.log('displayArray: ' + displayArray);
      console.log('operation: ' + operation);
      console.log('token: ' + token);

      let o1 = Number(operation[0]);
      let o2 = Number(operation[2]);
      let value = 0;
      if(operation[1] === '*')
        value = o1 * o2;
      else {
        if(o2 === 0) {
          global.error = true;
          return 'ERROR: Div by zero';
        }
        value = o1 / o2;
      }

      console.log('global.expression: ' + global.expression);
      console.log('global.display: ' + global.display);
      console.log('displayArray: ' + displayArray);

      displayArray.splice(token-1, 0, String(value));

      token--;

      console.log('displayArray: ' + displayArray);
      console.log('..............');
    }
  }

  for(token in displayArray) {
    if(displayArray[token] === '+' || displayArray[token] === '-') {
      let operation = displayArray.splice(token-1, 3);
      let o1 = Number(operation[0]);
      let o2 = Number(operation[2]);
      let value = 0;
      if(operation[1] === '+')
        value = o1 + o2;
      else {
        value = o1 - o2;
      }
      displayArray.splice(token-1, 3, String(value));
    }
  }

  global.display = displayArray.join(' ');
  global.expression = global.display;

console.log('--------------------------------');

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
