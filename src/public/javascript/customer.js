const loginsubmit = document.getElementById('login-submit')

loginsubmit.addEventListener('click', (e) => {
    e.preventDefault()
    const phone = document.getElementById('i_phone').value
    const password = document.getElementById('i_password').value

    const data = {
        phone: phone,
        password: password,
    }

    const res = fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then((res) => res.json())
        .then(data => {
            console.log(data);
           localStorage.setItem("savedToken", data.token);


           
        })
        .catch((error) => {
            alert(error)
        });
})