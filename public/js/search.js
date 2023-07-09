const searchKey = decodeURI(location.pathname.split('/').pop());
const searchSpanElement = document.querySelector('#search-key');
searchSpanElement.innerHTML = searchKey;
getsearchProducts(searchKey).then(data => createProductCards(data, '.card-container'));


// new code
// const productType = ["LAPTOP","LAPTOPS","MOBILE","MOBILES","EARPHONES","EARPHONE"]
// const brandType = ["HP","HEWLETT PACKARD","ASUS","LENOVO","DELL","SAMSUNG","MI","OPPO","VIVO","IPHONE","I PHONE","APPLE"]
// if(brandType.includes(searchKey.toUpperCase())){
//     getsearchProducts(searchKey).then(data => createProductCards(data, '.card-container'));
// }
// else if(productType.includes(searchKey.toUpperCase())){
//     getsearchtypeProducts(searchKey).then(data => createProductCards(data, '.card-container'));
// }

