
let cartproducts = []


function displayWelcomeMessage() {
    // var message = "Welcome to";
    // var words = message.split("");
    var words = ['W','e','l','c','o','m','e',' ','t','o']
    var index = 0;
    
    var interval = setInterval(function() {
      if (index >= words.length) {
        clearInterval(interval);
        return;
      }
      
      document.getElementById("welcome-message").innerHTML += words[index];
      index++;
    }, 100);
  }

  function displayecomMessage() {
    var words = "RE-ELECTRONICS";
    var index = 0;
    
    var interval = setInterval(function() {
      if (index >= words.length) {
        clearInterval(interval);
        return;
      }
      
      document.getElementById("ecom-message").innerHTML += words[index];
      index++;
    }, 100);
  }



function isLoggedIn() {
    if(sessionStorage.user)
    return true;
    else
    return false;
}


function handleButtonClick() {
    
        if (isLoggedIn()) {
            if(JSON.parse(sessionStorage.user).seller)
            document.getElementById("content").innerHTML = '<button class="signin-up-btn" id="ex" onclick="explore()">Explore</button><button class="signin-up-btn" id="sell" onclick="sellerpage()">Seller</button>';
            else
            document.getElementById("content").innerHTML = '<button class="signin-up-btn" id="exelse" onclick="explore()">Explore</button><button class="signin-up-btn" id="nosell" onclick="sellerpage()">Become a Seller</button>';
          } else {
            document.getElementById("content").innerHTML = '<button class="signin-up-btn" id="si" onclick="signIn()">Sign In</button>' +
              '<button class="signin-up-btn" id="su" onclick="signUp()">Sign Up</button>';
          }
    
}

  function signIn() {
    location.href = '/login'
  }

  function sellerpage(){
    location.href = '/seller'

  }

  // Function to handle Sign Up button click
  function signUp() {
    location.href = '/signup'
  }

  // Function to handle Explore button click
  function explore() {
    const startPosition = window.pageYOffset;
      const targetPosition = startPosition + 715;
      const distance = targetPosition - startPosition;
      const duration = 1000; // Duration in milliseconds
      let start = null;

      function step(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const scrollY = easeInOutCubic(progress, startPosition, distance, duration);
        window.scrollTo(0, scrollY);
        if (progress < duration) {
          window.requestAnimationFrame(step);
        }
      }

      window.requestAnimationFrame(step);
  }


  function easeInOutCubic(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t * t + b;
    t -= 2;
    return c / 2 * (t * t * t + 2) + b;
  }

  document.addEventListener("DOMContentLoaded", function(event) {
    handleButtonClick();
    displayWelcomeMessage();
    displayecomMessage();

  });













const setupSlidingEffect = () => {
    const productContainers = [...document.querySelectorAll(".product-container")];
    const nxtBtn = [...document.querySelectorAll(".nxt-btn")];
    const preBtn = [...document.querySelectorAll(".pre-btn")];

    productContainers.forEach((item,i)=>{
    let containerDimenstions = item.getBoundingClientRect();
    let containerWidth = containerDimenstions.width;

    nxtBtn[i].addEventListener('click',()=>{
        item.scrollLeft += containerWidth;
    })
    preBtn[i].addEventListener('click',()=>{
        item.scrollLeft -= containerWidth;
    })
})
}

// fetch product cards
const getProducts = (tag) => {
    return fetch('/get-products',{
        method: "post",
        headers: new Headers({"Content-Type": "application/json"}),
        body: JSON.stringify({tag: tag})
    })
    .then(res => res.json())
    .then(data => {
        return data;
    })
}

// new code
const getsearchProducts = (searchtag) => {
    return fetch('/get-search-products',{
        method: "post",
        headers: new Headers({"Content-Type": "application/json"}),
        body: JSON.stringify({searchtag: searchtag})
    })
    .then(res => res.json())
    .then(data => {
        return data;
    })
}

const getsearchtypeProducts = (tag) => {
    return fetch('/getsearchtype-products',{
        method: "post",
        headers: new Headers({"Content-Type": "application/json"}),
        body: JSON.stringify({tag: tag})
    })
    .then(res => res.json())
    .then(data => {
        return data;
    })
}
















// this was not there until
// create product slider
const createProductSlider = (data, parent, title) => {
    let slideContainer = document.querySelector(`${parent}`);
    slideContainer.innerHTML += `
    <section class="product">
        <h2 class="product-category">${title}</h2>

        <button class="pre-btn"><i class="fa-solid fa-angle-right"></i></button>
        <button class="nxt-btn"><i class="fa-solid fa-angle-right"></i></button>
    ${createProductCards(data)}
    </section>
    `

    setupSlidingEffect();
}


// this was not here until
const createProductCards = (data, parent) => {
    // here parent is for search product
    let start = '<div class="product-container">';
    let middle = ''; // this will contain card html
    let end = '</div>';

    for(let i = 0; i < data.length; i++){
        if(!data[i].draft){
            if(data[i].id != decodeURI(location.pathname.split('/').pop())){
                middle += `
            <div class="product-card">
                <div class="product-image">
                    <img src="${data[i].images[0]}" onclick="location.href = '/products/${data[i].id}'"  alt="" class="product-thumb">
                </div>
                <div class="product-info" onclick="location.href = '/products/${data[i].id}'">
                    <h2 class="product-brand">${data[i].name}</h2>
                    <p class="product-short-des">${data[i].shortDes}</p>
                    <span class="price">₹${parseInt(data[i].actualPrice).toLocaleString('en-IN')}</span>
                </div>
            </div>
            `
            }
        }      
    }

    if(parent){
        let cardContainer = document.querySelector(parent);
        cardContainer.innerHTML = start + middle + end;
    } else{
        return start + middle + end;
    }
}


const add_product_to_cart_or_wishlist = (type, product) => {
    let data = JSON.parse(localStorage.getItem(type));
    if(data == null){
        data = [];
    }
    //console.log(product);

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


























// new code for home side cart/wishlist
// const fetchProductData = () => {
//     fetch('/get-products', {
//         method: 'post',
//         headers: new Headers({'Content-Type': 'application/json'}),
//         body: JSON.stringify({id: productId})
//     })
//     .then(res => res.json())
//     .then(data => {
//         setData(data);
//         getProducts(data.tags[0]).then(data => createProductSlider(data, '.container-for-card-slider', 'Similar Products'))
//     })
//     .catch(err => {
//         location.replace('/404');
//     })
// }