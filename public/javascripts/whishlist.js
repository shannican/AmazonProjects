$(document).ready(function(){
    $(".cart-btnn").click(function(){
      $.get("/cart", function(data,status){
        var clutter = ""  
        data.forEach((elem)=>{
          clutter += `<div id="cart-cards">
    
            <div id="img-box">
              <div id="image">
                <img src="/images/uploads/productImageUpload/${elem.pic[0]}" alt="">
                
              </div>
            </div>
            <div id="content-box">
              <div class="productName">
                <h4>${elem.productname}</h4>
              </div>
              <div class="productDesc">
                <p>${elem.desc}</p>
              </div>
              <div class="productPrice">
                <p>Rs.${elem.price}</p>
                <p>off:- ${elem.discount}%</p>
              </div>
              <div class="productButton">
                <a id="buy-btn" href="/buy/${elem._id}">Buy Now</a>
                <a id="whishlist-btn" href="/whishlist/${elem._id}">Add Whishlist</a>
                <a id="delete-cart" href="/deletecart/${elem._id}"><i class="ri-delete-bin-line"></i></a>
              </div>
            </div>
          </div>`
        })
        document.querySelector(".offcanvas-body").innerHTML = clutter
        console.log(clutter)
      });
    });
  });




function productImage(){
    document.querySelector(".cards .img").addEventListener("mousemove",function(){
        document.querySelector(".cards .img").style.height="47vh"
        var i = 1
        setInterval(()=>{
            if(i === 5){   
                document.querySelector("#img1").style.left="0%"
                document.querySelector("#img2").style.left="0%"
                document.querySelector("#img3").style.left="0%"
                document.querySelector("#img4").style.left="0%"
                i = 1
            }
            console.log(i)
            document.querySelector(`#img${i}`).style.left="0%"
            if(i>1){
                document.querySelector(`#img${i-1}`).style.left="-100%"
            }
            i++
        },1000)
    
    })
    document.querySelector(".cards .img").addEventListener("mouseleave",function(){
        document.querySelector(".cards .img").style.height="49vh"
    })
}

productImage()




