var i = 1
setInterval(()=>{
    if(i === 6){
        document.querySelector("#img2").style.opacity="0"
        document.querySelector("#img3").style.opacity="0"
        document.querySelector("#img4").style.opacity="0"
        document.querySelector("#img5").style.opacity="0"
        i = 1
    }
    console.log(i)
    document.querySelector(`#img${i}`).style.opacity="1"
    i++
},1500)