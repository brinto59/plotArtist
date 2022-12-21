const isSupTitle = document.getElementById("isSupTitle");
const supTitleContainer = document.querySelector(".sup-title-container");
const plotNum = document.getElementById("plotNum");
let islegends, legends, plotInfos, curveNums;
let clonePlotElement = document.querySelector(".plot-info").cloneNode(true);
let cloneCurveElement = document.querySelector(".curve-info").cloneNode(true);

const button = document.querySelector(".show-btn");
function variableCall() {
  islegends = document.querySelectorAll(".isLegend input");
  legends = document.querySelectorAll(".legend");
  plotInfos = document.querySelectorAll(".plot-info");
  curveNums = document.querySelectorAll(".curve-num input");
  console.log(curveNums);
}
variableCall();
document.addEventListener("click", (e) => {
  islegends.forEach((element) => {
    if (element.checked == true) {
      console.log(element.nextElementSibling);
      element.parentElement.nextElementSibling.style.display = "flex";
    } else {
      element.parentElement.nextElementSibling.style.display = "none";
    }
  });
  if (isSupTitle.checked == true) {
    supTitleContainer.style.display = "flex";
  } else {
    supTitleContainer.style.display = "none";
  }
});

document.addEventListener("change", (e) => {
  
  if (e.target == plotNum) {
    let value = eval(plotNum.value);
    // console.log(typeof(eval(value)));
    let length = plotInfos.length;
    
    if(value>length){
      for (let i = 1; i <= value - length; i++) {
        clonePlotElement.querySelector(
          ".plot-info-header"
        ).innerHTML = `<h1>Plot information of no. ${length + i}</h1>`;
        clonePlotElement.querySelector(".curve-num input").id = `curveNum-plot${
          length + 1
        }`;
        clonePlotElement.dataset.plotNo = `${length + i}`;
        plotInfos[length - 1].insertAdjacentElement("afterend", clonePlotElement);
        clonePlotElement = clonePlotElement.cloneNode(true);
        variableCall();
      }
    }
    if(value<length){
      let lastIndex = length -1;
      for(let i = 1; i<=(length-value);i++){
        plotInfos[lastIndex].remove();
        variableCall();
        lastIndex--;
      }
    }
  }
  curveNums.forEach((element) => {
    if (e.target == element) {
      let value = eval(element.value);
      // console.log(typeof(eval(value)));
      let curveInfos =
        element.parentElement.parentElement.querySelectorAll(".curve-info");
      console.log(curveInfos);
      let length = curveInfos.length;
      if(value>length){
        for (let i = 1; i <= value - length; i++) {
          cloneCurveElement.querySelector(
            ".curve-info-header"
          ).innerHTML = `<h2>Curve information of no. ${length + i}</h2>`;
          cloneCurveElement.dataset.curveNo = `${length + i}`;
          curveInfos[length - 1].insertAdjacentElement(
            "afterend",
            cloneCurveElement
          );
          cloneCurveElement = cloneCurveElement.cloneNode(true);
          variableCall();
        }
      }
      if(value<length){
        let lastIndex = length-1
        for(let i = 1; i<=(length-value);i++){
          curveInfos[lastIndex].remove();
          lastIndex--;
        }
      }
    }
  });
});

document.addEventListener("input", (e)=>{
  let errorContainers = document.querySelectorAll(".error-message");
  errorContainers.forEach(element=>{
    element.style.display = "none";
  })
});

button.addEventListener("click", (e)=>{
    for(let i=0;i<eval(plotNum.value);i++){
      let curveInfos = plotInfos[i].querySelectorAll(".curve-info");
      let errorContainers = plotInfos[i].querySelectorAll(".error-message");
      let curveData = extractCurveData(curveInfos, errorContainers);
      let axisRangeData = extractAxisData(plotInfos[i].querySelector(".sub-axis-range-container"));
    }
});

function extractCurveData(curveInfos, errorContainers){
  let xData = [];
  let yData = [];
  let lineStyle = [];
  let lineColor = [];
  let linewidth = [];
  let labelForLegend = [];
  let combinedXY = []
  let regex = /[0-9]+[.]?[0-9]*/g;
  for(let j = 0; j<curveInfos.length; j++){
    xData.push(curveInfos[j].querySelector("#xAxis1").value.match(regex).map(el=>eval(el)));
    yData.push(curveInfos[j].querySelector("#yAxis1").value.match(regex).map(el=>eval(el)));
    if(xData[j].length != yData[j].length){
      errorContainers[j].innerHTML = "x and y values are not equal!!";
      errorContainers[j].style.display = "flex";
    }
    lineStyle.push(curveInfos[j].querySelector("#select-line-style").value);
    lineColor.push(curveInfos[j].querySelector("#line-color-input").value);
    linewidth.push(curveInfos[j].querySelector("#line-width-input").value);
    labelForLegend.push(curveInfos[j].querySelector("#labelLegend").value);
    combinedXY.push(getCombinedXY(xData[j], yData[j]));
  }
  console.log(combinedXY);
}

function getCombinedXY(xData, yData){
  let combinedXY = [];
  for(let i = 0; i <xData.length;i++){
    combinedXY.push({x:xData[i], y:yData[i]});
  }
  return combinedXY;
}

function extractAxisData(subAxisRangeContainer){
  let data = {};
  data.x = {start:subAxisRangeContainer.querySelector("#xAxisRangeStart").value, end:subAxisRangeContainer.querySelector("#xAxisRangeEnd").value};
  data.y = {start:subAxisRangeContainer.querySelector("#yAxisRangeStart").value, end:subAxisRangeContainer.querySelector("#yAxisRangeEnd").value};
  console.log(data);
  return data;
}