const switchMode=()=>{
    let checkbox=document.getElementById("checkbox")
    let form=document.getElementById("form")
    let darkmode=document.getElementById("darkmode-text")
    if(checkbox.checked){
       darkmode.innerText="dark Mode";
       console.log(darkmode.style);
        form.style.backgroundColor="black";
        form.style.color="white"
        
    }
    else{
        form.style.backgroundColor="rgba(255, 255, 255, 0.7)"
        form.style.color="black"
        darkmode.innerText="white Mode";
    }
}