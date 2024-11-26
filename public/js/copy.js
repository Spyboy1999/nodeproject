const copydata=async()=>{
    let copytext=document.getElementById('copy')
    await navigator.clipboard.writeText(copytext.textContent)
    .then(()=>{
   alert("copied")
    })
    .catch((err)=>{
if(err) throw err;
    })
        
    
 
}
const copyEmail=async()=>{
    let copyEmail=document.getElementById("copy-email")
    await navigator.clipboard.writeText(copyEmail.textContent)
    .then(()=>{
        alert("email copied")
    })
    .catch((err)=>{
        console.log(err)
    })
}