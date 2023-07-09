
const getInfo = () => {
    fetch('/app-info', {
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({})
    })
    .then(res => res.json())
    .then(res => {
        document.getElementById('customers-count').innerHTML = res[0]
        document.getElementById('sellers-count').innerHTML = res[1]
        document.getElementById('products-count').innerHTML = res[2]
        document.getElementById('orders-count').innerHTML = res[3]
    })
}

getInfo();