let user = JSON.parse(sessionStorage.user || null);
let loader = document.querySelector('.loader');


let oldpid = 0;

let deleteproductId;
// function conditionchange(){
//     const selectedval = document.getElementById("options");

// }
// new code
//product type
let tags = "Null";
function selectopt(){
    const selectedval = document.getElementById("options");
    const brandvalue = document.getElementById("brandoptions");
    tags = selectedval.value;
    if(selectedval.value == "Laptop"){
        brandvalue.innerHTML = `
        <option class="inner-options" value="Select" selected>Choose brand</option>
        <option class="inner-options" value="Lenovo">Lenovo</option>
        <option class="inner-options" value="Asus">Asus</option>
        <option class="inner-options" value="Acer">Acer</option>
        <option class="inner-options" value="Hp">Hp</option>
        <option class="inner-options" value="Dell">Dell</option>
        <option class="inner-options" value="Macbook">Macbook</option>
        <option class="inner-options" value="Msi">MSI</option>
        <option class="inner-options" value="Other">Other</option>
        `
    }else if(selectedval.value == "Mobile"){
        brandvalue.innerHTML = `
        <option class="inner-options" value="Select" selected>Choose brand</option>
        <option class="inner-options" value="Realme">Realme</option>
        <option class="inner-options" value="POCO">POCO</option>
        <option class="inner-options" value="Samsung">Samsung</option>
        <option class="inner-options" value="Apple">Apple</option>
        <option class="inner-options" value="Motorola">Motorola</option>
        <option class="inner-options" value="MI">MI</option>
        <option class="inner-options" value="Infinix">Infinix</option>
        <option class="inner-options" value="Vivo">Vivo</option>
        <option class="inner-options" value="One Plus">One Plus</option>
        <option class="inner-options" value="Oppo">Oppo</option>
        <option class="inner-options" value="Pixel">Pixel</option>
        <option class="inner-options" value="Nothing">Nothing</option>
        <option class="inner-options" value="Other">Other</option>
        `
    }else if(selectedval.value == "Earphone"){
        brandvalue.innerHTML = `
        <option class="inner-options" value="Realme">Realme</option>
        <option class="inner-options" value="Apple">Apple</option>
        <option class="inner-options" value="Noise">Noise</option>
        <option class="inner-options" value="One Plus">One Plus</option>
        <option class="inner-options" value="bOAt">bOAt</option>
        <option class="inner-options" value="Sony">Sony</option>
        <option class="inner-options" value="Boult">Boult</option>
        <option class="inner-options" value="Dizo">Dizo</option>
        <option class="inner-options" value="JBL">JBL</option>
        <option class="inner-options" value="Truke">Truke</option>
        <option class="inner-options" value="Other">Other</option>
        `
    }else if(selectedval.value == "TV"){
        brandvalue.innerHTML = `
        <option class="inner-options" value="Samsung">Samsung</option>
        <option class="inner-options" value="Sony">Sony</option>
        <option class="inner-options" value="Panasonic">Panasonic</option>
        <option class="inner-options" value="MI">MI</option>
        <option class="inner-options" value="One Plus">One Plus</option>
        <option class="inner-options" value="Toshiba">Toshiba</option>
        <option class="inner-options" value="Videocon">Videocon</option>
        <option class="inner-options" value="Sansui">Sansui</option>
        <option class="inner-options" value="Lg">LG</option>
        <option class="inner-options" value="Other">Other</option>
        `
    }else if(selectedval.value == "Smart Watch"){
        brandvalue.innerHTML = `
        <option class="inner-options" value="bOAt">bOAt</option>
        <option class="inner-options" value="MI">MI</option>
        <option class="inner-options" value="Noise">Noise</option>
        <option class="inner-options" value="Apple">Apple</option>
        <option class="inner-options" value="Samsung">Samsung</option>
        <option class="inner-options" value="Fastrack">Fastrack</option>
        <option class="inner-options" value="Fossil">Fossil</option>
        <option class="inner-options" value="Titan">Titan</option>
        <option class="inner-options" value="Pixel">Pixel</option>
        <option class="inner-options" value="Fitbit">Fitbit</option>
        <option class="inner-options" value="Fireboltt">Fireboltt</option>
        <option class="inner-options" value="amazfit">amazfit</option>
        <option class="inner-options" value="One Plus">One Plus</option>
        <option class="inner-options" value="Crossbeats">Crossbeats</option>
        <option class="inner-options" value="Honor">Honor</option>
        <option class="inner-options" value="Other">Other</option>     
        `
    }else if(selectedval.value == "Desktop"){
        brandvalue.innerHTML = `
        <option class="inner-options" value="Select" selected>Choose brand</option>
        <option class="inner-options" value="Lenovo">Lenovo</option>
        <option class="inner-options" value="Asus">Asus</option>
        <option class="inner-options" value="Acer">Acer</option>
        <option class="inner-options" value="Hp">Hp</option>
        <option class="inner-options" value="Dell">Dell</option>
        <option class="inner-options" value="Msi">MSI</option>
        <option class="inner-options" value="Other">Other</option>     
        `
    }else if(selectedval.value == "Power Bank"){
        brandvalue.innerHTML = `
        <option class="inner-options" value="Select" selected>Choose brand</option>
        <option class="inner-options" value="Samsung">Samsung</option>
        <option class="inner-options" value="Realme">Realme</option>
        <option class="inner-options" value="MI">MI</option>
        <option class="inner-options" value="Ambrane">Ambrane</option>
        <option class="inner-options" value="One Plus">Dell</option>
        <option class="inner-options" value="Intex">Intex</option>
        <option class="inner-options" value="bOAt">bOAt</option>
        <option class="inner-options" value="Oppo">Oppo</option>
        <option class="inner-options" value="Other">Other</option>     
        `
    }else if(selectedval.value == "Tab"){
        brandvalue.innerHTML = `
        <option class="inner-options" value="Select" selected>Choose brand</option>
        <option class="inner-options" value="Apple">Apple</option>
        <option class="inner-options" value="Samsung">Samsung</option>
        <option class="inner-options" value="Amazon">Amazon</option>
        <option class="inner-options" value="Microsoft">Microsoft</option>
        <option class="inner-options" value="Lenovo">Lenovo</option>
        <option class="inner-options" value="Asus">Asus</option>
        <option class="inner-options" value="Other">Other</option>     
        `
    }else if(selectedval.value == "Camera"){
        brandvalue.innerHTML = `
        <option class="inner-options" value="Select" selected>Choose brand</option>
        <option class="inner-options" value="Canon">Canon</option>
        <option class="inner-options" value="Nikon">Nikon</option>
        <option class="inner-options" value="Sony">Sony</option>
        <option class="inner-options" value="Panasonic">Panasonic</option>
        <option class="inner-options" value="FUJIFILM">FUJIFILM</option>
        <option class="inner-options" value="Pozub">Pozub</option>
        <option class="inner-options" value="Olympus">Olympus</option>
        <option class="inner-options" value="Pentax">Pentax</option>
        <option class="inner-options" value="Other">Other</option>     
        `
        
    }else if(selectedval.value == "Printer"){
        brandvalue.innerHTML = `
        <option class="inner-options" value="Select" selected>Choose brand</option>
        <option class="inner-options" value="Epson">Epson</option>
        <option class="inner-options" value="Canon">Canon</option>
        <option class="inner-options" value="brother">brother</option>
        <option class="inner-options" value="PANTUM">PANTUM</option>
        <option class="inner-options" value="STIER">STIER</option>
        <option class="inner-options" value="Samsung">Samsung</option>
        <option class="inner-options" value="Ricoh">Ricoh</option>
        <option class="inner-options" value="Yonkx">Yonkx</option>
        <option class="inner-options" value="TSC">TSC</option>
        <option class="inner-options" value="MAGICARD">MAGICARD</option>
        <option class="inner-options" value="CJChoice">C J Choice</option>
        <option class="inner-options" value="Other">Other</option>     
     
        `
        
    }else if(selectedval.value == "Speaker"){
        brandvalue.innerHTML = `
        <option class="inner-options" value="Select" selected>Choose brand</option>
        <option class="inner-options" value="ZEBRONICS">ZEBRONICS</option>
        <option class="inner-options" value="Intex">Intex</option>
        <option class="inner-options" value="PHILIPS">PHILIPS</option>
        <option class="inner-options" value="boAt">boAt</option>
        <option class="inner-options" value="STIER">STIER</option>
        <option class="inner-options" value="Other">Other</option>     
       `
    }

}


// brand
let shortLine = "Null";
function selectbrand(){
    const brandvalue = document.getElementById("brandoptions");
    shortLine = brandvalue.value;
}








// checking user is logged in or not
window.onload = () => {
    if(user){
        if(!compareToken(user.authToken, user.email)){
            location.replace('/login');
        }
    } else{
        location.replace('/login');
    }
}


// price inputs
const actualPrice = document.querySelector('#actual-price');


// upload image handle
let uploadImages = document.querySelectorAll('.fileupload');
let imagePaths = []; // will store  all uploaded images paths

uploadImages.forEach((fileupload, index) => {
    fileupload.addEventListener('change', () => {
        const file = fileupload.files[0];
        let imageUrl;

        if(file.type.includes('image')){
            // means user uploaded an image
            fetch('/s3url').then(res => res.json())
            .then(url => {
                fetch(url,{
                    method: 'PUT',
                    headers: new Headers({'Content-Type': 'image/jpeg'}), // was multipart/form-data
                    body: file
                }).then(res => {
                    imageUrl = url.split("?")[0];
                    imagePaths[index] = imageUrl;
                    let label = document.querySelector(`label[for=${fileupload.id}]`);
                    label.style.backgroundImage = `url(${imageUrl})`;
                    let productImage = document.querySelector('.product-image');
                    productImage.style.backgroundImage = `url(${imageUrl})`;
                })
            })
        } else{
            showAlert('upload image only')
        }

    })
})

// form submission

const productName = document.querySelector('#product-name');

//const shortLine = document.querySelector('#short-des');

const des = document.querySelector('#des');

let sizes = [];  // will store all the sizes

const stock = 1;           //document.querySelector('#stock');
//const tags = document.querySelector('#tags');

// const tac = document.querySelector('#tac');

// new code : id for product deletion after order
let pid;
let randnum1 = Math.floor(Math.random() * 999999);
let randnum2 = Math.floor(Math.random() * 999999);

// let str = "Hello";
// pid = randnum+str
// console.log(pid);



// buttons
const addProductBtn = document.querySelector('#add-btn');
const saveDraft = document.querySelector('#save-btn');

// store size function
const storeSizes = () => {
    sizes = [];
    let sizeCheckBox = document.querySelectorAll('.size-checkbox');
    sizeCheckBox.forEach(item => {
        if(item.checked){
            sizes.push(item.value);
        }
    })
}


const validateForm = () => {
    if(!productName.value.length){
        return showAlert('Enter product name');
    } else if(shortLine == "Select"){
        return showAlert('Choose a brand');
    } else if(!des.value.length){
        return showAlert('Enter detail description about the product');
    } else if(!imagePaths.length){  // image link array
        return showAlert('Upload atleast one product image');
    } else if(!actualPrice.value.length){
        return showAlert('You must add price of your product');
    } //else if(stock.< 20){
        //return showAlert('you should have atleast 20 items in stock');
     //} 
     else if(tags == "Select"){
          return showAlert('Enter product type');
      }
    return true;
}


const productData = () => {
    let tagArr = tags.split(',');   // earlier tags.value.split
    tagArr.forEach((item ,i) => tagArr[i] = tagArr[i].trim());

    // new code
    if(oldpid==1){
        pid = (productName.value)+"-"+randnum2;
    }else{
        pid = (productName.value)+randnum1;
    }
    let inspection = "No";
    return data = {
        name: productName.value,
        shortDes: shortLine,
        des: des.value,
        images: imagePaths,       
        //sizes: sizes,
        actualPrice: actualPrice.value,
        // discount: discountPercentage.value,
        // sellPrice: sellingPrice.value,
        stock: stock,
        tags: tagArr,
        //tac: tac.checked,
        email: user.email,
        pid: pid,
        inspection: inspection
    }
}



addProductBtn.addEventListener('click',() => {
    storeSizes();
    // validate form
    if(validateForm()){ // validateForm returns true or false while doing validation
        loader.style.display = 'block';
        let data = productData();
        if(productId){
            data.id = productId;
        }

        if(oldpid==1){
            fetch('/delete-order-product',{
                method: 'post',
                headers: new Headers({'Content-Type': 'application/json'}),
                body: JSON.stringify({id: deleteproductId})
            })
            .then(res => res.json())
        }

        sendData('/add-product', data);
    }
})

// SAVE DRAFT
saveDraft.addEventListener('click', ()=>{
    // store size
    storeSizes();
    // check for product image
    if(!productName.value.length){
        showAlert('enter product name');
    } else{
        // dont validate the data
        let data = productData();
        data.draft = true;
        if(productId){
            data.id = productId;
        }
        sendData('/add-product', data);
    }
})

// existing product detail handle
// Used to display details when Editing the details of the already added product

const setFormsData = (data) => {
    productName.value = data.name;
    shortLine.value = data.shortDes;
    des.value = data.des;
    actualPrice.value = data.actualPrice;
    // discountPercentage.value = data.discount;
    // sellingPrice.value = data.sellPrice;
    stock.value = data.stock;
    tags.value = data.tags;

    oldpid = 1;
    // console.log(oldpid);
    deleteproductId = data.pid;
    // set up images
    imagePaths = data.images;
    imagePaths.forEach((url, i) => {
        let label = document.querySelector(`label[for=${uploadImages[i].id}]`);
        label.style.backgroundImage = `url(${url})`;
        let productImage = document.querySelector('.product-image');
        productImage.style.backgroundImage = `url(${url})`;
    })

    // setup sizes
    sizes = data.sizes;
    let sizeCheckBox = document.querySelectorAll('.size-checkbox');
    sizeCheckBox.forEach(item => {
        if(sizes.includes(item.value)){
            item.setAttribute('checked','')
        }
    })
}

const fetchProductData = () => {
    fetch('/get-products', {
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({email: user.email, id: productId})
    })
    .then((res) => res.json())
    .then(data => {
        setFormsData(data);
    })
    .catch(err => {
        location.replace('/seller');
    })
}


let productId = null;
if(location.pathname != '/add-product'){
    productId = decodeURI(location.pathname.split('/').pop());

    let productDetail = JSON.parse(sessionStorage.tempProduct || null);
    fetchProductData();

}




