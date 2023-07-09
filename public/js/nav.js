const createNav = () => {
    let nav = document.querySelector('.navbar');
    nav.innerHTML = `
    <div class="nav">
            <img src="../img/logo.png" class="brand-logo" alt="">
            <div class= "nav-items" >       
                <div class="search">       
                    <input type="text" class="search-box" placeholder="What are you looking for ?">
                    <button class="search-btn">Search</button>       
                </div>
                <a>
                <img src="../img/user.png" id="user-img" alt="">
                <div class="login-logout-popup hide">
                    <p class="account-info">Log in as, name</p>                   
                    <button class="btn" id="user-btn">Log out</button>
                </div>
                </a>
            <!-- <a href=""><img src="../img/cart.png" alt=""></a> -->
            <div class="cartimg"><img src="../img/cart.png"  alt="" onclick="cartclick()"></div>
                
            </div>       
        </div>
         
         

        <ul class= "links-container">
            <li class="link-item"><a href="/" class="link">Home</a></li>
            <li class="link-item"><a href="/laptops" class="link">Laptops</a></li>
            <li class="link-item"><a href="/mobiles" class="link">Mobiles</a></li>
            <li class="link-item"><a href="/earphones" class="link">Earphones</a></li>          
            <li class="link-item"><a href="/" class="link">Other Categories</a</li>
            <li class="link-item"><a href="/" class="link">About Us</a</li>

        </ul>
`
        ;
}

createNav();




// nav popup
const userImageButton = document.querySelector('#user-img');
const userPopup = document.querySelector('.login-logout-popup');
const popuptext = document.querySelector('.account-info');
const actionBtn = document.querySelector('#user-btn');

let cartdata = []

userImageButton.addEventListener('click', () => {
    userPopup.classList.toggle('hide');
})


window.onload = () => {
    let user = JSON.parse(sessionStorage.user || null)
    if(user != null){
        // means user is logged in

        // Retain cart and wishlist
            
        



        // popuptext.innerHTML = `Logged in as, ${user.name}`;
        popuptext.innerHTML = `
        <div class="profile-space">          
                <img id="profile-image" src="../img/user.png">
                <p id="user-name">${user.name}</p>
        </div>
        `
        actionBtn.innerHTML = 'Log out';
        actionBtn.addEventListener('click', () =>{
            localStorage.clear();
            sessionStorage.clear();
            //localStorage.removeItem('localitemflag')
            
            location.reload();
        })
    } else{
        // user is logged out
        localStorage.removeItem('cart');
        popuptext.innerHTML = 'Login to place order';
        actionBtn.innerHTML = 'Login'
        actionBtn.addEventListener('click', () => {
            location.href = '/login';
        })
    }
}





const searchBtn = document.querySelector('.search-btn');
const searchBox = document.querySelector('.search-box');

searchBtn.addEventListener('click',()=>{
    if(searchBox.value.length){
        location.href = `/search/${searchBox.value}`
    }
});





async function cartclick() {
    if(!sessionStorage.user){
        location.href = '/login';
    }
    try {
      const response = await fetch('/get-cart-products-on-email',{
                            method: 'post',
                            headers: new Headers({'Content-Type': 'application/json'}),
                            body: JSON.stringify({email: JSON.parse(sessionStorage.user).email})
    });
      const data = await response.json();
      console.log(data);
      if(data.length){
        fetchcartdata(data);
        }      
      navigateToPage();
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  function navigateToPage() {
    // Navigate to the desired page
    location.href = '/cart';
  }
  







const callcart = () => {
    window.location.href = '/cart'
}
        

async function fetchcartdata(products){
    console.log('control in fetchcartdata')
    cartdata = products;
    let localflag = parseInt(localStorage.getItem('localitemflag')) || 0;

    if(cartdata.length && localflag == 0){        
                    cartdata.forEach(element => {
                            setCartData(element);                      
                    })
                    localStorage.setItem('localitemflag','1')   
    }
}


const setCartData = (product) => {
    console.log('control in setcartdata')
    let msg = add_product_to_cart('cart',product);
    console.log(msg);
}




const add_product_to_cart = (type, product) => {
    let data = JSON.parse(localStorage.getItem(type));
    if(data == null){
        data = [];
    }
    console.log('control in add_product_to_cart');

    product = {
        item: 1,
        name: product.name,
        sellPrice: product.actualPrice,
        //size: size || null,
        shortDes: product.shortDes,
        image: product.images[0],
        pid: product.pid,
        seller_email: product.email
    }


    data.push(product);
    localStorage.setItem(type, JSON.stringify(data));
    return 'Added';
}