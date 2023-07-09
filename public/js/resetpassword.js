
const submitBtn = document.querySelector('.submit-btn');
submitBtn.addEventListener('click',()=>{
    const newpassword = document.querySelector('#enter') ;
    const confirmpassword = document.querySelector('#reenter');
    console.log(newpassword.value)
    console.log(confirmpassword.value)
    if(newpassword.value.length<8){
        showAlert('Password should be minimum 8 characters long');
    }
    else{
        if(newpassword.value!=confirmpassword.value){
            showAlert('Passwords doesnt match');
        }
        else
        {
            let newmail = localStorage.getItem('newemailvalue');
            let newpasswd = newpassword.value;
            fetch('/updatepassword', {
                method: 'post',
                headers: new Headers({'Content-Type': 'application/json'}),
                body: JSON.stringify({
                    email: newmail,
                    npassword: newpasswd
                })
            })
            .then(res => {
                localStorage.removeItem('newemailvalue');
                location.href = '/login';
            })
        }
    }
})
