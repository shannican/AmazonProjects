
flag=0;
document.querySelector("#profile-pic").addEventListener("click",function(){
    if(flag===0){
        document.querySelector("#option").style.opacity="1";
        flag=1;
    }else{
        document.querySelector("#option").style.opacity="0";
        flag=0;
    }
})
