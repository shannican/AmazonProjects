document.querySelector("#left button").addEventListener("click",function(){
    document.querySelector("#left #photu #pp-input").click();
})
document.querySelector("#pp-input").addEventListener("change",function(){
    document.querySelector("#prof").submit();
})



$(document).ready(function(){
    $("#cart-link").click(function(){
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