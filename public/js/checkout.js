window.onload = () => {
    if(!sessionStorage.user){
        location.replace('/login');
    }
}

const placeOrderBtn = document.querySelector('.place-order-btn');
placeOrderBtn.addEventListener('click',() => {
    let address = getAddress();

    fetch('/stripe-checkout',{
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({
            items: JSON.parse(localStorage.getItem('cart')), 
            email: JSON.parse(sessionStorage.user).email, 
            address: address 
        })
    }).then(res => res.json())
    .then(url => {
        location.href = url;
    })
    .catch(err =>  console.log(err))
})

// placeOrderBtn.addEventListener('click',() => {
//     let address = getAddress();
//     if(address){
//         // fetch('/stripe-checkout')
//         fetch('/order',{
//             method: 'post',
//             headers: new Headers({'Content-Type': 'application/json'}),
//             body: JSON.stringify({
//                 order: JSON.parse(localStorage.cart), // items:
//                 email: JSON.parse(sessionStorage.user).email, 
//                 add: address //address:
//             })
//         }).then(res => res.json())
//         .then(data => {
//             showAlert(data.alert, 'success');
//             if(data.alert == 'your order is placed'){
                

//                 let obj = JSON.parse(localStorage.cart)
//                 delete localStorage.cart;

//                 obj.forEach(element => {
//                     delete_ordered_product(element.pid);
//                 });

//               showAlert(data.alert, 'success');
//             } else{
//                 showAlert(data.alert);
//             }
//         })
//     }
// })

const getAddress = () => {
    let address = document.querySelector('#address').value;
    let street = document.querySelector('#street').value;
    let city = document.querySelector('#city').value;
    let state = document.querySelector('#state').value;
    let pincode = document.querySelector('#pincode').value;
    let landmark = document.querySelector('#landmark').value;

    if(!address.length || !street.length || !city.length || !state.length
      || !pincode.length || !landmark.length){
        showAlert('fill all the inputs');
      }
    else{
        return { address, street, city, state, pincode, landmark};
    }
}



const delete_ordered_product = (del_product) => {
    fetch('/delete-order-product',{
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({id: del_product})
    })
    .then(res => res.json())
}