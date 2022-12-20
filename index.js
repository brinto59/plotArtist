const isSupTitle = document.getElementById("isSupTitle");
const supTitleContainer = document.querySelector(".sup-title-container");
const plotNum = document.getElementById("plotNum");
let islegends, legends, plotInfos, curveNums;
let clonePlotElement = document.querySelector(".plot-info").cloneNode(true);
let cloneCurveElement = document.querySelector(".curve-info").cloneNode(true);
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
    // console.log(length);
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
  curveNums.forEach((element) => {
    if (e.target == element) {
      let value = eval(element.value);
      // console.log(typeof(eval(value)));
      let curveInfos =
        element.parentElement.parentElement.querySelectorAll(".curve-info");
      console.log(curveInfos);
      let length = curveInfos.length;
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
  });
});
