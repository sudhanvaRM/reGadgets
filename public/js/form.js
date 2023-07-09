

















// redirect to home page if user logged in
window.onload = () => {
    if(sessionStorage.user){
        user = JSON.parse(sessionStorage.user);
        if(compareToken(user.authToken, user.email)){
            location.replace('/');          
        }
    }
}


const loader = document.querySelector('.loader');


// select inputs
const submitBtn = document.querySelector('.submit-btn');
const name = document.querySelector("#name") || null;

const email = document.querySelector('#email');
const password = document.querySelector('#password') ;
const number = document.querySelector('#number') || null;
const tac = document.querySelector('#terms-and-cond') || null;
const notification = document.querySelector('#notification') || null;

















submitBtn.addEventListener('click',()=>{
    if(name!=null){  // signup page
        if(name.value.length < 3){
            showAlert('Name must be minimum 3 letters long')
        } else if(!email.value.length){
            showAlert('Enter your email');
        } else if(password.value.length < 8){
            showAlert('Password should be minimum 8 characters long');
        } else if(!number.value.length){
            showAlert('Enter your phone number');
        } else if(!Number(number.value) || number.value.length < 10){
            showAlert('Invalid number , please enter valid one');
        }
        // } else if(!tac.checked){
        //     showAlert('You must agree to our terms and conditions')
        // }
        // else if(!emailValidator.validate(email.value)){
        //     showAlert('Invalid Email Id');
        // }
        else{
            //submit form
            //loader.style.display = 'block';
            localStorage.setItem('lname',name.value);
            localStorage.setItem('lemail',email.value);
            localStorage.setItem('lpass',password.value);
            localStorage.setItem('lnumber',number.value);
            localStorage.setItem('ltac',tac.checked);
            localStorage.setItem('lnoti','none');
            location.href = '/emailverification';
            // sendData('/signup',{
            //     name: name.value,
            //     email: email.value,
            //     password: password.value,           
            //     number: number.value,
            //     tac: tac.checked,
            //     notification: notification.checked,
            //     seller: false
            // })
        }
    } else{
        // login page
        if(!email.value.length || !password.value.length){
            showAlert('fill all the inputs');
        } else{
            loader.style.display = 'block';
            sendData('/login',{
                email: email.value,
                password: password.value,           
            })
            
        }
    }
})








