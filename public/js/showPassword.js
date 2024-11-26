const show=()=>{
let showPassword=document.getElementById("password")
let eye=document.getElementById("eye")
if(showPassword.type==="password"){
    showPassword.type="text";
    
    eye.className="bi bi-eye-slash-fill input-group-text"
}
else{
    showPassword.type="password"
     eye.className="bi bi-eye-fill input-group-text"
}
}
const showpass=()=>{
let seePassword=document.getElementById("pass1")
let seePassword2=document.getElementById("pass2")

if(seePassword.type==="password" && seePassword2.type==="password"){
seePassword.type="text";
seePassword2.type="text";
}
else{
  seePassword.type="password"
  seePassword2.type="password"
}
}