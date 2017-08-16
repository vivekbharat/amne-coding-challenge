let fileUpload = document.getElementById('file-upload');

let calculateWindowSubrangeNums = (daysOfAverageHomeSalePrice, fixedWindowSize, averageHomeSalePrices) => {
  let verification = averageHomeSalePrices.every(num => num < 1000000);

  if ((daysOfAverageHomeSalePrice <= 200000 && fixedWindowSize <= daysOfAverageHomeSalePrice) && verification) {
    let windowSubrangeNums = [];
    let lastWindowStartPoint = daysOfAverageHomeSalePrice - fixedWindowSize;
    
    for (let x = 0; x <= lastWindowStartPoint; x++) {
      let consective = 1;
      let decrease = false;
      let increase = false;
      
      let windowSubrangeNum = 0;
      let windowEndPoint = x + (fixedWindowSize - 1)
      
      for (let y = x; y < windowEndPoint; y++) {
        let currentNum = averageHomeSalePrices[y];
        let nextNum = averageHomeSalePrices[y + 1];
        
        if (currentNum < nextNum) {
        
          if (decrease) {
            consective = 1;
            decrease = false;
          }
          
          if (increase) {
            consective++;
          }
          
          windowSubrangeNum += consective;
          increase = true;
        } else if (currentNum > nextNum) {
          if (decrease) {
            consective++;
          }
          
          if (increase) {
            consective = 1;
            increase = false;
          }
          
          windowSubrangeNum -= consective;
          decrease = true;
        } else {
          decrease = false;
          increase = false;
          consective = 1;
        }
      }
      
      windowSubrangeNums.push(windowSubrangeNum);
    }
    
    return windowSubrangeNums;
  }
};

let renderFileInput = (daysOfAverageHomeSalePrice, fixedWindowSize, averageHomeSalePrices) => {
  let fileInput = document.createElement('p');
  fileInput.class = 'small-space';

  fileInput.innerText = daysOfAverageHomeSalePrice + ' ' + fixedWindowSize;
  fileInput.appendChild(document.createElement('br'));

  averageHomeSalePrices.forEach((num, index) => {
    fileInput.innerText += num;

    if (index !== averageHomeSalePrices.length - 1) {
      fileInput.innerText += ' ';
    }
  });

  document.getElementById('input-title').insertAdjacentElement('afterend', fileInput);
};

let renderFileOutput = windowSubrangeNums => {
  let fileOutput = document.createElement('p');
  fileOutput.class = 'small-space';

  fileOutput.innerText = '';

  windowSubrangeNums.forEach((num, index) => {
    fileOutput.innerText += num;

    if (index !== windowSubrangeNums.length - 1) {
      fileOutput.appendChild(document.createElement('br'));
    }
  });

  document.getElementById('output-title').insertAdjacentElement('afterend', fileOutput);
};

fileUpload.addEventListener('change', e => {
  let files = e.target.files;
  let file = files[files.length - 1];
  let fileReader = new FileReader();

  fileReader.onload = e => {
    let lines = e.target.result.split('\n');
    let lineOne = lines[0].split(' ');
    let lineTwo = lines[1].split(' ');

    lineOne.forEach((strNum, index) => lineOne[index] = parseInt(strNum));
    lineTwo.forEach((strNum, index) => lineTwo[index] = parseInt(strNum));

    let daysOfAverageHomeSalePrice = lineOne[0];
    let fixedWindowSize = lineOne[1];
    let averageHomeSalePrices = lineTwo;

    renderFileInput(daysOfAverageHomeSalePrice, fixedWindowSize, averageHomeSalePrices);
    let windowSubrangeNums = calculateWindowSubrangeNums(daysOfAverageHomeSalePrice, fixedWindowSize, averageHomeSalePrices);
    renderFileOutput(windowSubrangeNums);
  };

  fileReader.readAsText(file);
});