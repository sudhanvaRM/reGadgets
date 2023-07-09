const createFooter = () =>{
    let footer = document.querySelector('footer');
    footer.innerHTML = `<div class="footer-content">
    <img src="../img/logo.png" alt="" class="logo">
    <div class="footer-ul-container">
        <ul class="category">
            <li class="category-title">Electronics</li>
            <li><a href="#" class="footer-link">Laptops</a></li>
            <li><a href="#" class="footer-link">Mobiles</a></li>
            <li><a href="#" class="footer-link">Desktops</a></li>
            <li><a href="#" class="footer-link">TV</a></li>
            <li><a href="#" class="footer-link">Powerbank</a></li>
            <li><a href="#" class="footer-link">Earphones</a></li>
            <li><a href="#" class="footer-link">Printers</a></li>
        </ul>
    </div>           
</div>

<p class="footer-title">About Us</p>
<p class="info">Welcome to Re-Electronics!!!!.Re-Electronics is a multi-vendor ecommerce website that allows sellers to sell refurbished gadgets online and also allows customers to buy pre-owned electronic gadgets online for reasonable prices. </p>

<p class="info">Support emails - ecomrefurbish@gmail.com , jakaraddimanoj@gmail.com , naveenhegde6954@gmail.com</p>
<p class="info">Contact - 9110427310, 8217607185</p>

<div class="footer-social-container">
    <div>
        <a href="#" class="social-link">Instagram</a>
        <a href="#" class="social-link">Facebook</a>
        <a href="#" class="social-link">Twitter</a>
    </div>
</div>
<p class="footer-credit">Re-electronics, Best place to sell your products</p>
    `;
}

createFooter();