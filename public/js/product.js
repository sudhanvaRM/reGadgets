const productImages = document.querySelectorAll(".product-images img");
const productImageSlide = document.querySelector(".image-slider");

let activeImageSlide = 0;

productImages.forEach((item,i)=>{
    item.addEventListener('click',()=>{
        productImages[activeImageSlide].classList.remove('active');
        item.classList.add('active');
        productImageSlide.style.backgroundImage = `url(${item.src})`;
        activeImageSlide = i;
    })
})


//const sizeBtns = document.querySelectorAll('.size-radio-btn');
let checkedBtn = 0;  //current selected button
let size;

// sizeBtns.forEach((item,i)=>{
//     item.addEventListener('click',()=>{
//         sizeBtns[checkedBtn].classList.remove('check');
//         item.classList.add('check');
//         checkedBtn = i;
//         size = item.innerHTML;
//     })
// })

const setData = (data) => {
    let title = document.querySelector('title');
    

    // setup the images
    productImages.forEach((img, i) => {
        if(data.images[i]){
            img.src = data.images[i];
        } else{
            img.style.display = 'none';
        }
    })
    productImages[0].click();
    // setting up texts
    const name = document.querySelector('.product-brand');
    const shortDes = document.querySelector('.product-short-des');
    const des = document.querySelector('.des');
    title.innerHTML += name.innerHTML = data.name;
    shortDes.innerHTML = data.shortDes;
    des.innerHTML = data.des;

    // pricing
    const sellPrice = document.querySelector('.product-price');
    const actualPrice = document.querySelector('.product-actual-price');
    const discount = document.querySelector('.product-discount');
    const qualins = document.querySelector('.qai');
    sellPrice.innerHTML = `₹${parseInt(data.actualPrice).toLocaleString('en-IN')}`;
    if(data.inspection!="No"){
        qualins.innerHTML = `Re-Electronics Assured : <i class="fa-solid fa-square-check"></i>`;
    }

    


    // wishlist and cart button
    const wishlistBtn = document.querySelector('.wishlist-btn');
    wishlistBtn.addEventListener('click', () => {
        if(!sessionStorage.user){
            location.replace('/login');
        }else{
            wishlistBtn.innerHTML = add_product_to_cart_or_wishlist('wishlist', data);
        }
    })

    const cartBtn = document.querySelector('.cart-btn');
    cartBtn.addEventListener('click', () => {
        // first cartlistBtn was there

            if(!sessionStorage.user){
                location.replace('/login');
            }else{
                cartBtn.innerHTML = add_product_to_cart_or_wishlist('cart', data);
                let cart_item = data.pid;
                fetch('/add-to-cart', {
                    method: 'post',
                    headers: new Headers({'Content-Type': 'application/json'}),
                    body: JSON.stringify({email: JSON.parse(sessionStorage.user).email, cartitem_id: cart_item})
                })
            }      
    })

}



// fetch data
const fetchProductData = () => {
    fetch('/get-products', {
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({id: productId})
    })
    .then(res => res.json())
    .then(data => {
        setData(data);
        //console.log(data);
        getProducts(data.tags[0]).then(data => createProductSlider(data, '.container-for-card-slider', 'Similar Products'))
    })
    .catch(err => {
        location.replace('/404');
    })
}















let productId = null;
if(location.pathname != '/products'){
    productId = decodeURI(location.pathname.split('/').pop());
    fetchProductData();
}