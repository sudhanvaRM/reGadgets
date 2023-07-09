function serviceengg(){
    fetch('/after-sales-service', {
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({})
    })
    .then(res => res.json())
    .then(res => {
        console.log('response received')
        console.log(res)
    })
}

serviceengg();