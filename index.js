const isSupTitle = document.getElementById("isSupTitle");
const supTitleContainer = document.querySelector(".sup-title-container");
const plotNum = document.getElementById("plotNum");
let islegends, legends, plotInfos, curveNums;
let clonePlotElement = document.querySelector(".plot-info").cloneNode(true);
let cloneCurveElement = document.querySelector(".curve-info").cloneNode(true);
let smoothCurve = false;
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

    if (value > length) {
      for (let i = 1; i <= value - length; i++) {
        clonePlotElement.querySelector(
          ".plot-info-header"
        ).innerHTML = `<h1>Plot information of no. ${length + i}</h1>`;
        clonePlotElement.querySelector(".curve-num input").id = `curveNum-plot${
          length + 1
        }`;
        clonePlotElement.dataset.plotNo = `${length + i}`;
        plotInfos[length - 1].insertAdjacentElement(
          "afterend",
          clonePlotElement
        );
        clonePlotElement = clonePlotElement.cloneNode(true);
        variableCall();
      }
    }
    if (value < length) {
      let lastIndex = length - 1;
      for (let i = 1; i <= length - value; i++) {
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
      if (value > length) {
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
      if (value < length) {
        let lastIndex = length - 1;
        for (let i = 1; i <= length - value; i++) {
          curveInfos[lastIndex].remove();
          lastIndex--;
        }
      }
    }
  });
});

document.addEventListener("input", (e) => {
  let errorContainers = document.querySelectorAll(".error-message");
  errorContainers.forEach((element) => {
    element.style.display = "none";
  });
});

button.addEventListener("click", (e) => {
  smoothCurve = document.querySelector("#isCubic").checked;
  let superTitleData;
  if (document.querySelector("#isSupTitle").checked) {
    superTitleData = extractSuperTitleData(
      document.querySelector(".sup-title-container")
    );
  }
  for (let i = 0; i < eval(plotNum.value); i++) {
    let curveInfos = plotInfos[i].querySelectorAll(".curve-info");
    let curveInfoLength = curveInfos.length;
    let errorContainers = plotInfos[i].querySelectorAll(".error-message");
    let curveData = extractCurveData(curveInfos, errorContainers);
    let axisRangeData = extractAxisData(
      plotInfos[i].querySelector(".sub-axis-range-container")
    );
    let xLabelData = extractLabelData(
      plotInfos[i].querySelector(".x-label-container"),
      "x"
    );
    let yLabelData = extractLabelData(
      plotInfos[i].querySelector(".y-label-container"),
      "y"
    );
    let titleData = extractTitleData(plotInfos[i].querySelector(".title"));
    let gridData = extractGridData(plotInfos[i].querySelector(".grid"));
    let legendData = {};
    if (plotInfos[i].querySelector("#islegend").checked == true) {
      legendData.title = plotInfos[i].querySelector("#legendTitle").value;
      legendData.location =
        plotInfos[i].querySelector("#select-legend-loc").value;
    }
    drawPlot(
      curveInfoLength,
      curveData,
      axisRangeData,
      xLabelData,
      yLabelData,
      titleData,
      gridData,
      legendData
    );
  }
});

function extractCurveData(curveInfos, errorContainers) {
  let xData = [];
  let yData = [];
  let lineStyle = [];
  let lineColor = [];
  let linewidth = [];
  let labelForLegend = [];
  let combinedXY = [];
  let regex = /[0-9]+[.]?[0-9]*/g;
  for (let j = 0; j < curveInfos.length; j++) {
    xData.push(
      curveInfos[j]
        .querySelector("#xAxis1")
        .value.match(regex)
        .map((el) => eval(el))
    );
    yData.push(
      curveInfos[j]
        .querySelector("#yAxis1")
        .value.match(regex)
        .map((el) => eval(el))
    );
    if (xData[j].length != yData[j].length) {
      errorContainers[j].innerHTML = "x and y values are not equal!!";
      errorContainers[j].style.display = "flex";
    }
    lineStyle.push(curveInfos[j].querySelector("#select-line-style").value);
    lineColor.push(curveInfos[j].querySelector("#line-color-input").value);
    linewidth.push(
      eval(curveInfos[j].querySelector("#line-width-input").value)
    );
    labelForLegend.push(curveInfos[j].querySelector("#labelLegend").value);
    combinedXY.push(getCombinedXY(xData[j], yData[j]));
  }
  // return combinedXY;
  return {
    x: xData,
    y: yData,
    lineStyle: lineStyle,
    lineColor: lineColor,
    linewidth: linewidth,
    labelForLegend: labelForLegend,
  };
}

function getCombinedXY(xData, yData) {
  let combinedXY = [];
  for (let i = 0; i < xData.length; i++) {
    combinedXY.push({ x: xData[i], y: yData[i] });
  }
  return combinedXY;
}

function extractAxisData(subAxisRangeContainer) {
  let data = {};
  data.x = {
    start: eval(subAxisRangeContainer.querySelector("#xAxisRangeStart").value),
    end: eval(subAxisRangeContainer.querySelector("#xAxisRangeEnd").value),
  };
  data.y = {
    start: eval(subAxisRangeContainer.querySelector("#yAxisRangeStart").value),
    end: eval(subAxisRangeContainer.querySelector("#yAxisRangeEnd").value),
  };
  // console.log(data);
  return data;
}

function extractLabelData(labelContainer, axis) {
  let labelData = {};
  labelData.label = labelContainer.querySelector(`#${axis}Label`).value;
  labelData.color = labelContainer.querySelector(
    `#${axis}-label-color-input`
  ).value;
  labelData.font = labelContainer.querySelector(`#fontFamily-${axis}`).value;
  labelData.fontSize = eval(
    labelContainer.querySelector(`#${axis}LabelFontSize`).value
  );
  // console.log(labelData);
  return labelData;
}

function extractTitleData(titleContainer) {
  let titleData = {};
  titleData.title = titleContainer.querySelector("#title-input").value;
  titleData.color = titleContainer.querySelector("#title-color-input").value;
  titleData.font = titleContainer.querySelector("#fontFamilyTitle").value;
  titleData.fontSize = eval(
    titleContainer.querySelector("#titleFontSize").value
  );
  titleData.location = eval(titleContainer.querySelector("#select-title-loc").value);
  console.log(titleData.location);
  return titleData;
}

function extractGridData(gridContainer) {
  let gridData = {};
  gridData.axis = gridContainer.querySelector("#select-axis-name").value;
  gridData.color = gridContainer.querySelector("#grid-color-input").value;
  gridData.lineStyle = gridContainer.querySelector(
    "#select-grid-line-style"
  ).value;
  gridData.lineWidth = eval(
    gridContainer.querySelector("#grid-line-width-input").value
  );
  return gridData;
}

function extractSuperTitleData(superTitleContainer) {
  let superTitleData = {};
  superTitleData.title = superTitleContainer.querySelector("#supTitle").value;
  superTitleData.color = superTitleContainer.querySelector(
    "#suptitle-color-input"
  ).value;
  superTitleData.font = superTitleContainer.querySelector(
    "#fontFamilySupTitle"
  ).value;
  superTitleData.fontSize = eval(
    superTitleContainer.querySelector("#supTitleFontSize").value
  );
  return superTitleData;
}

function drawPlot(
  curveInfoLength,
  curveData,
  axisRangeData,
  xLabelData,
  yLabelData,
  titleData,
  gridData,
  legendData
) {
  let data = [];
  let legend = {};
  let showLegend = Object.keys(legendData).length == 0 ? false : true;
  for (let i = 0; i < curveInfoLength; i++) {
    let trace = {};
    trace.x = curveData.x[i];
    trace.y = curveData.y[i];
    if (showLegend) {
      trace.name = curveData.labelForLegend;
    }
    trace.line = {
      color: curveData.lineColor[i],
      dash: curveData.lineStyle[i],
      width: curveData.linewidth[i],
    };
    data.push(trace);
  }
  let layout = {
    title: {
      text: titleData.title,
      font: {
        family: titleData.font,
        size: titleData.fontSize,
        color: titleData.color,
      },
    },
    xref: "paper",
    x:titleData.location,
    xaxis: {
      title: xLabelData.label,
      range: [axisRangeData.x.start, axisRangeData.x.end],
      font: {
        family: xLabelData.font,
        size: xLabelData.fontSize,
        color: xLabelData.color,
      },
    },
    yaxis: {
      title: yLabelData.label,
      range: [axisRangeData.y.start, axisRangeData.y.end],
      font: {
        family: yLabelData.font,
        size: yLabelData.fontSize,
        color: yLabelData.color,
      },
    },
    showlegend: showLegend,
    legend: {
      title: {},
    },
  };
  console.log(titleData.location, layout.x);
  console.log(layout);
  if (showLegend) {
    layout.legend.title.text = legendData.title;
    if (legendData.location == "best") {
      layout.legend.title.xref = "container";
      layout.legend.title.x = "auto";
      layout.legend.title.yref = "container";
      layout.legend.title.y = "auto";
    } else if (legendData.location == "upper left") {
      layout.legend.title.xref = "paper";
      layout.legend.title.x = 0.01;
      layout.legend.title.yref = "paper";
      layout.legend.title.y = 0.98;
    } else if (legendData.location == "upper right") {
      layout.legend.title.xref = "paper";
      layout.legend.title.x = 0.98;
      layout.legend.title.yref = "paper";
      layout.legend.title.y = 0.98;
    } else if (legendData.location == "lower left") {
      layout.legend.title.xref = "paper";
      layout.legend.title.x = 0.01;
      layout.legend.title.yref = "paper";
      layout.legend.title.y = 0.01;
    } else if (legendData.location == "lower right") {
      layout.legend.title.xref = "paper";
      layout.legend.title.x = 0.98;
      layout.legend.title.yref = "paper";
      layout.legend.title.y = 0.01;
    }
  }
  Plotly.newPlot("myPlot", data, layout);
}
