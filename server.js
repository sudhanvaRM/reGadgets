//importing packages

const express = require('express') ;
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const path = require('path');
const nodemailer = require('nodemailer');

const stripe = require('stripe');
// import stripe from 'stripe'



// new code middleware
const bodyparser = require('body-parser');

// new otp code
var cors = require('cors');


let savedOTPS = {

};

let carts = [];
let cartflag = false;

// new code
let cur_otp = 0;
const calcotp = () => {
    return Math.floor(Math.random() * 123456789);
}


// firebase admin setup

let serviceAccount = require("./ecom-website-e1fab-firebase-adminsdk-plqjx-5bfc623215.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


let db = admin.firestore();


// newly added after an error
db.settings({ignoreUndefinedProperties:true});


// aws config
const aws = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();

// aws parameters
const region = "ap-south-1";
const bucketName = "minor-project-ecommerce";
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

aws.config.update({
    region,
    accessKeyId,
    secretAccessKey
})

// init s3
const s3 = new aws.S3();

// generate image upload link
async function generateUrl(){
    let date = new Date();
    let id = parseInt(Math.random() * 10000000000);
    const imageName = `${id}${date.getTime()}.jpg`;
    const params = ({
        Bucket: bucketName,
        Key: imageName,
        Expires: 300,
        ContentType: 'image/jpeg'
    })
    const uploadUrl = await s3.getSignedUrlPromise('putObject',params);
    return uploadUrl;
}

// declare static path
let staticPath = path.join(__dirname,"public");


//intializing express.js
const app = express() ;


//middlewares
app.use(express.static(staticPath));
app.use(express.json());

// new code middleware
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

app.use(cors('*'));

//routes
//home route
app.get("/",(req,res)=>{
    res.sendFile(path.join(staticPath,"index.html"));
})



//signup route
app.get('/signup',(req,res)=>{
    res.sendFile(path.join(staticPath,"signup.html"));
})


app.post('/signup',(req,res)=>{
    let { name, email, password, number, tac, notification } = req.body;
    //form validations
    if(name.length<3){
        return res.json({'alert': 'name must be 3 letters long'})
    } else if(!email.length){
        return res.json({'alert': 'enter your email'})
    } else if(password.length < 8){
        return res.json({'alert': 'Password should be minimum 8 characters long'});
    } else if(!number.length){
        return res.json({'alert': 'enter your phone number'});
    } else if(!Number(number) || number.length < 10){
        return res.json({'alert': 'invalid number , please enter valid one'});
    // } else if(!tac){
    //     return res.json({'alert': 'you must agree to our terms and conditions'})
     }

    //store user in db
    db.collection('users').doc(email).get()
    .then(user => {
        if(user.exists){
            return res.json({'alert': 'email already exists'});
        } else{
            // encrypt the password before storing it
            bcrypt.genSalt(10, (err,salt) => {
                bcrypt.hash(password, salt, (err,hash) => {
                    req.body.password = hash;
                    db.collection('users').doc(email).set(req.body)
                    .then(data => {
                        res.json({
                            name: req.body.name,
                            email: req.body.email,
                            seller: req.body.seller,
                        })
                    })
                })
            })
        }
    })
})

// login route
app.get('/login', (req,res) =>{
    res.sendFile(path.join(staticPath,"login.html"));
})


app.post('/login',(req,res) => {
    let { email, password } = req.body;
    if(!email.length || !password.length){
        return res.json({'alert': 'fill all the inputs'})
    }

    db.collection('users').doc(email).get()
    .then(user => {
        if(!user.exists){  // if email does not exists
            return res.json({'alert': 'log in email does not exists'})
        } else{
            bcrypt.compare(password, user.data().password, (err,result) => {
                if(result){
                    let data = user.data();
                    return res.json({
                        name: data.name,
                        email: data.email,
                        seller: data.seller,
                        islogged: true
                    })
                } else{
                    return res.json({'alert': 'password is incorrect'})
                }
            })
        }
    })
})


//seller route
app.get('/seller',(req,res) => {
    res.sendFile(path.join(staticPath,"seller.html"));
})

app.post('/seller', (req,res) =>{
    let { name, about, address, number, tac, legit, email } = req.body;
      if(!name.length || !address.length || !about.length || number.length < 10 || !Number(number)){
        return res.json({'alert':'some information is/are invalid'});
      }
    //  } else if(!legit){
    //     return res.json({'alert':'you must agree to our terms and conditions'});
    // } 
    else{
        //update user seller status here.
        db.collection('sellers').doc(email).set(req.body)
        .then(data => {
            db.collection('users').doc(email).update({
                seller: true
            }).then(data => {
                res.json(true);
            })
        })
    }
})

// add product
app.get('/add-product',(req,res)=>{
    res.sendFile(path.join(staticPath, "addProduct.html"));
})

app.get('/add-product/:id',(req,res)=>{
    res.sendFile(path.join(staticPath, "addProduct.html"));
})

// get the upload link
app.get('/s3url',(req,res) => {
    generateUrl().then(url => res.json(url));
})



// add product
app.post('/add-product', (req,res) => {
    let { name, shortDes, des, images, actualPrice, stock, tags, tac, email, draft, id, pid, inspection } = req.body;

    // validation
    if(!draft){
        if(!name.length){
            return res.json({'alert': 'enter product name'});
        } //else if(shortDes.length > 100 || shortDes.length < 10){
            //return res.json({'alert': 'short description must be between 10 to 100 letters long'});
        //} 
        else if(!des.length){
            return res.json({'alert': 'enter detail description about the project'});
        } else if(!images.length){  // image link array
            return res.json({'alert': 'upload atleast one product image'});
        } 
        // else if(!sizes.length){
        //     return res.json({'alert': 'select at least one size'});
        // } 
        else if(!actualPrice.length){
            return res.json({'alert': 'you must add pricings'});
        } //else if(stock < 20){
            //return res.json({'alert': 'you should have atleast 20 items in stock'});
        //} 
        else if(!tags.length){
            return res.json({'alert': 'enter few tags to help ranking your product in search'});
        } 
        // else if(!tac){
        //     return res.json({'alert': 'you must agree to our terms and conditions'});
        // }
    }

    
    //let docName = id = undefined ? `${name.toLowerCase()}-${Math.floor(Math.random() * 5000)}` : id;
    //let docName = `${name.toLowerCase()}-${Math.floor(Math.random() * 5000)}`;
    let docName = id = `${name.toLowerCase()}-${Math.floor(Math.random() * 5000)}`;
    db.collection('products').doc(docName).set(req.body)
    .then(data => {
        res.json({'product': name});
    })
    .catch(err => {
        return res.json({'alert': 'some error occured. Try again'})
    })
})


app.post('/add-to-cart',(req,res)=> {
    let { email, cartitem_id} = req.body;
    let random_id = Math.floor(Math.random() * 200);
    db.collection('cart-items').doc(`${email}-${random_id}`).set(req.body)
})

app.post('/get-cart-products-on-email',(req,res)=>{
    let { email } = req.body;
    console.log(email);
    docRef = db.collection('cart-items').where('email', '==', email);
    let prodarr = [];
    docRef.get()
    .then(products => {
        //console.log(products)
        products.forEach(prod => {
            let product_id = prod.data().cartitem_id;
            // console.log(product_id);
            prodarr.push(product_id)
        })
        // res.json(prodarr);
        return prodarr
    }).then(prodarr => {
        cartproducts(prodarr)
        setTimeout(()=>{
            console.log('Carts : ')
            const uniqueArray = Array.from(new Set(carts.map(JSON.stringify))).map(JSON.parse);
            return res.json(uniqueArray);
        },2000)
    }) 
})

function cartproducts(prodarr){
    let length = prodarr.length;
    let initial_len = 0;
    console.log('control in cartproducts')
    let resultarr = [];
    prodarr.forEach(element => {
        docRef = db.collection('products').where('pid', '==', element);
        docRef.get() 
        .then(res => {
                res.forEach(prod => {
                    let data = prod.data()
                    console.log('control inside loop')
                    resultarr.push(data);                                
                })
                initial_len++;   
            
                if(initial_len == length){               
                    return 'true';
                }      
        })
        .then(res => {
            if(res == 'true'){
                cartflag = true;
                carts = resultarr
            }           
        })      
    })   
}

app.post('/get-cart-products',(req,res)=>{
    let { cart_id } = req.body;
    //console.log(cart_id);
    let cartarr = [];
        docRef = db.collection('products').where('pid', '==', cart_id)
        docRef.get()
        .then(product => {
            product.forEach(prod => {
                cartarr.push(prod.data());
            })
            if(cartarr.length){
                return res.json(cartarr);
            }else{
                cartarr.push('Sold');
                return res.json(cartarr);
            }
        })
})

// get products
app.post('/get-products',(req,res)=>{
    let { email, id, tag} = req.body;
    


    if(id){
        docRef = db.collection('products').doc(id)
    }else if(tag){
        docRef = db.collection('products').where('tags', 'array-contains', tag)
    }else{
        docRef = db.collection('products').where('email', '==', email)
    }

    docRef.get()
    .then(products => {
        if(products.empty){
            return res.json('no products');
        }
        let productArr = [];
        if(id){
            return res.json(products.data());
        } else{
            products.forEach(item => {
                let data = item.data();
                data.id = item.id;
                productArr.push(data);
            })
            
            res.json(productArr)
        }
    })
})


app.post('/get-search-products',(req,res)=>{
    let { searchtag } = req.body;
    const searcharr = searchtag.split(' ');
    console.log(searcharr);
    docRef = db.collection('products')
    docRef.get()
    .then(products => {
    if(products.empty){
        return res.json('no products');
    }
    let productArr = [];
        products.forEach(item => {
            let data = item.data();
            data.id = item.id;
            let text = item.data().des;
            let name = item.data().name
            let shortDes = item.data().shortDes
            if(text.match(searchtag) || name.match(searchtag) || shortDes.match(searchtag)){
                productArr.push(data);
            }
            if(productArr.length == 0){
                searcharr.forEach(splititem => {
                    if(text.match(splititem) || name.match(splititem) || shortDes.match(splititem)){
                        productArr.push(data);
                    }  
                })
            }                                  
        })
        // products.forEach(prod => {
        //     console.log(prod.data().des);
        //     console.log("\n");
        // })
        res.json(productArr)
  })
})

app.post('/updatepassword',(req,res)=>{
    let {email, npassword} = req.body;

    bcrypt.genSalt(10, (err,salt) => {
        bcrypt.hash(npassword, salt, (err,hash) => {
            npassword = hash;
            db.collection('users').doc(email).update({
                password: npassword
            }).then(data => {
                res.json(true);
            })   
        })
    })     
})

app.post('/delete-product', (req,res) => {
    let { id } = req.body;
    db.collection('products').doc(id).delete()
    .then(data => {
        res.json('success');
    }).catch(err => {
        res.json(err);
    })
})

app.post('/delete-order-product', (req,res) => {
    let { id } = req.body;
    console.log(id);
    var item = db.collection('products').where('pid','==',id);
    item.get().then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
            doc.ref.delete();
        })
    })
    .then(data => {
        res.json('success');
    }).catch(err => {
        res.json(err);
    })
})


// product page
app.get('/products/:id',(req,res) => {
    res.sendFile(path.join(staticPath,"product.html"));
})

app.get('/search/:key',(req,res)=>{
    res.sendFile(path.join(staticPath,"search.html"));
})

app.get('/cart',(req,res)=>{
    res.sendFile(path.join(staticPath,"cart.html"));
})

app.get('/checkout',(req,res)=>{
    res.sendFile(path.join(staticPath,"checkout.html"));
})


app.post('/order',(req,res) => {
    const { order, email, add } = req.body;
    

    
})


//newly added for Laptop
app.get('/Laptops',(req,res)=>{
    res.sendFile(path.join(staticPath,"laptops.html"));
})

//newly added for Mobiles
app.get('/Mobiles',(req,res)=>{
    res.sendFile(path.join(staticPath,"mobiles.html"));
})

//newly added for other accessories
app.get('/Other Accessories',(req,res)=>{
    res.sendFile(path.join(staticPath,"accessories.html"));
})

//newly added for Mobiles
app.get('/Earphones',(req,res)=>{
    res.sendFile(path.join(staticPath,"earphones.html"));
})

// newly added for emailveri
app.get('/emailverification',(req,res)=>{
    res.sendFile(path.join(staticPath,"emailverification.html"));
})

app.get('/resetpassword',(req,res)=>{
    res.sendFile(path.join(staticPath,"resetpassword.html"));
})








// new code for email verify (youtube)
app.post('/sendotp', (req, res) => {

    let transporter = nodemailer.createTransport(
        {
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
          }
        }
    );
    

    let email = req.body.email;
    let digits = '0123456789';
    let limit = 4;
    let otp = ''
    for (i = 0; i < limit; i++) {
        otp += digits[Math.floor(Math.random() * 10)];

    }
    var options = {
        from: 'ecomrefurbish@gmail.com',
        to: `${email}`,
        subject: "Testing node emails",
        html: `<p>Enter the otp: ${otp} to verify your email address</p>`
    }

    transporter.sendMail(
        options, (error, info) => {
            if (error) {
                console.log(error);
                res.status(500).send("couldnt send")
            }
            else {
                savedOTPS[email] = otp;
                setTimeout(
                    () => {
                        delete savedOTPS.email
                    }, 60000
                )
                res.send("sent otp");
            }
        }
    )
})

app.post('/verify', (req, res) => {
    let otprecived = req.body.otp;
    let email = req.body.email;
    if (savedOTPS[email] == otprecived) {
        res.send("Verified");
    }
    else {
        res.status(500).send("Invalid OTP")
    }
})


// stripe payment
let stripeGateway = stripe(process.env.stripe_key);
let DOMAIN = process.env.DOMAIN;

app.post('/stripe-checkout', async(req,res)=>{
    const session = await stripeGateway.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        success_url: `${DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}&order=${JSON.stringify(req.body)}`,
        cancel_url: `${DOMAIN}/checkout`,
        line_items: req.body.items.map(item => {
            return {
                price_data: {
                    currency: 'INR',
                    product_data: {
                        name: item.name,
                        description: item.shortDes,
                        images: [item.image]
                    },
                    unit_amount: item.sellPrice * 100
                },
                quantity: item.item
            }
        })
    })
    
    res.json(session.url)
})


app.get('/success', async (req,res) => {
    let { order, session_id} = req.query;
    try{
        const session = await stripeGateway.checkout.sessions.retrieve(session_id);
        console.log('success try block')

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        })

        let itemarr = []
        let sellersarr = []
        let pidarr = []
        console.log(JSON.parse(order).items.forEach(items => {
            itemarr.push(items.name)
            sellersarr.push(items)
        }))


        JSON.parse(order).items.forEach(items => {
            pidarr.push(items.pid)
        })
        console.log(itemarr)
        

        let email = JSON.parse(order).email;
        // let arr =  (JSON.parse(order)[0])
        console.log('order makers email in try  '+email)


        const mailOption = {
            from: 'ecomrefurbish@gmail.com',
            to: 'nshegdecse@gmail.com',
            subject: 'Re-Electronics : Order Placed',
            html: `
            <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <style>
            body{
                min-height: 90vh;
                background: #f5f5f5;
                font-family: sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .heading{
                text-align: center;
                font-size: 30px;
                width: 50%;
                display: block;
                line-height: 50px;
                margin: 30px auto 60px;
                text-transform: capitalize;
            }
            .heading span{
                font-weight: 200;
            }
            .btn{
                width: 200px;
                height: 50px;
                border-radius: 5px;
                background: #3f3f3f;
                color: #fff;
                display: block;
                margin: auto;
                font-size: 18px;
                text-transform: capitalize;
            }
            .itm{
                font-size: 20px;
            }
            .orderitems{
                margin-left: 350px;
            }
        </style>
    </head>
    <body>
        <div>
            <h1 class="heading">Dear Sudhanva , <span>Your order is successfully placed</span></h1>
            <div class="orderitems">Ordered items : <div class="itm">${itemarr}</div></div>
        </div>
    </body>
    </html>
            `
        }

        //${email.split('@')[0]
        transporter.sendMail(mailOption, (err,info) => {
            if(err){
                res.json({'alert': 'oops! it seems like some error has occured. Try again later'})
            } else{
                res.json({'alert': 'Your order is placed'});
            }
        })


        sellersarr.forEach((element)=>{



            const mailOptionseller = {
                from: 'ecomrefurbish@gmail.com',
                to: element.seller_email,
                subject: 'Re-Electronics : Product Pickup',
                html: `
                <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
            <style>
                body{
                    min-height: 90vh;
                    background: #f5f5f5;
                    font-family: sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .heading{
                    text-align: center;
                    font-size: 30px;
                    width: 50%;
                    display: block;
                    line-height: 50px;
                    margin: 30px auto 60px;
                    text-transform: capitalize;
                }
                .heading span{
                    font-weight: 200;
                }
                .btn{
                    width: 200px;
                    height: 50px;
                    border-radius: 5px;
                    background: #3f3f3f;
                    color: #fff;
                    display: block;
                    margin: auto;
                    font-size: 18px;
                    text-transform: capitalize;
                }
                .itm{
                    font-size: 20px;
                }
                .orderitems{
                    margin-left: 350px;
                }
            </style>
        </head>
        <body>
            <div>
                <h1 class="heading">Dear ${element.seller_email.split('@')[0]}, <span>Your product/s has been ordered from Re-Electronics , stay tuned for product pickup</span></h1>
                <div class="orderitems">Ordered item : <div class="itm">${element.name}</div></div>
            </div>
        </body>
        </html>
                `
            }
    
                transporter.sendMail(mailOptionseller, (err,info) => {
                    if(err){
                        res.json({'alert': 'oops! it seems like some error has occured. Try again later'})
                    } else{
                        res.json({'alert': 'your order is placed'});
                    }
                })
        })
    
    
    pidarr.forEach(prod_id => {
        var item = db.collection('products').where('pid','==',prod_id);
        item.get().then(function(querySnapshot){
            querySnapshot.forEach(function(doc){
                doc.ref.delete();
            })
        })
    })
    
        
    res.redirect('/ordersuccess')
        

              
    }catch{
        res.redirect('/orderfailure')        
    }
})

app.post('/after-sales-service',(req,res) => {
    let arr = [];
    docRef = db.collection('service-engineers')
    docRef.get()
    .then(res => {
        res.forEach(item => {
            console.log(item.data())
            arr.push(item.data());
        })
        console.log(arr);
        //res.json(arr);
        return arr;
    }).then(arr => {
        res.json(arr);
    })
})



app.post('/delete-cart',(req,res) => {
    let {email,cart_item} = req.body;
    // console.log(email)
    // console.log(id)

    var item = db.collection('cart-items').where('email','==',email).where('cartitem_id','==',cart_item);
    item.get().then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
            doc.ref.delete();
        })
    })
    .then(data => {
        res.json('success');
    }).catch(err => {
        res.json(err);
    })
})


app.post('/app-info',(req,res)=>{
    let arr = [];
    let cus_count = 0;
    let sel_count = 0;
    let prod_count = 0;
    let odr_count = 0;

    let falsevalue = false;
    let truevalue = true;


    docRef = db.collection('users').where('seller','==',falsevalue)
    docRef.get()
    .then(res => {
        res.forEach(item => {
            cus_count++;
        });
        console.log(`No.of customers ${cus_count}`)
        arr.push(cus_count);
    })

    docRef = db.collection('users').where('seller','==',truevalue)
    docRef.get()
    .then(res => {
        res.forEach(item => {
            sel_count++;
        });
        console.log(`No.of sellers ${sel_count}`)
        arr.push(sel_count);
    })
    
    docRef = db.collection('products')
    docRef.get()
    .then(res => {
        res.forEach(item => {
            prod_count++;
        });
        console.log(`No.of products ${prod_count}`)
        arr.push(prod_count);
    })

    docRef = db.collection('order')
    docRef.get()
    .then(res => {
        res.forEach(item => {
            odr_count++;
        });
        console.log(`No.of orders ${odr_count}`)
        arr.push(odr_count);
        return arr;
    }).then(arr =>{
        return res.json(arr);
    })
})

app.get('/after-sales',(req,res)=>{
    res.sendFile(path.join(staticPath,"after-sales.html"));
})

app.get('/admin',(req,res)=>{
    res.sendFile(path.join(staticPath,"admin.html"));
})

//404 route
app.get('/404',(req,res)=>{
    res.sendFile(path.join(staticPath,"404.html"));
})

app.get('/ordersuccess',(req,res)=>{
    res.sendFile(path.join(staticPath,"ordersuccess.html"));
})

app.get('/orderfailure',(req,res)=>{
    res.sendFile(path.join(staticPath,"orderfailure.html"));
})

app.use((req,res)=>{
    res.redirect('/404');
})

app.listen(3000,()=>{
    console.log('listening on port 3000.......');
})

