function loginSetup() {
  const loginButton = document.getElementById("loginSubmit")

  loginButton.addEventListener("click", () => loginAttempt())
}

async function loginAttempt() {
  const emailString = document.getElementById("email").value
  const pswString = document.getElementById("psw").value
  let errorGestion = null
  let user = {
    email: emailString,
    password: pswString,
  }

  try {
    let response = await fetch('http://localhost:5678/api/users/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
    let userToken = await response.json()
    if (response.status === 401) {
      errorGestion = 'password'
      throw new Error("incorrect password")
    }
    else if (response. status === 404) {
      errorGestion = 'email'
      throw new Error("incorrect email")
    }
    else if (response.status >= 400 && response.status < 600) {
      throw new Error("Bad response from server");
    }
    const localToken = JSON.stringify(userToken)
    window.localStorage.setItem('user_token', localToken)
    window.location.replace("./index.html");
  } catch (err) {
    const errorBox = document.getElementById('loginErrContainer')
    const errorMessage = document.getElementById('errMessage')

    if (errorGestion === 'password') {
      errorMessage.innerHTML = 'Mot de passe incorrect'
    } else if (errorGestion === 'email') {
      errorMessage.innerHTML = 'Utilisateur/email incorrect'
    }
    console.log("error => ", err)
    errorBox.classList.remove('is-hidden')
  }

}

loginSetup()