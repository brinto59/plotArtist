const islegend = document.getElementById("islegend");
const isSupTitle = document.getElementById("isSupTitle");
const legend = document.querySelector(".legend");
const supTitleContainer = document.querySelector(".sup-title-container");
document.addEventListener("click", (e)=>{
    if(islegend.checked == true){
        legend.style.display = "flex";
    }
    else{
        legend.style.display = "none";
    }
    if(isSupTitle.checked == true){
        supTitleContainer.style.display = "flex";
    }
    else{
        supTitleContainer.style.display = "none";
    }

});