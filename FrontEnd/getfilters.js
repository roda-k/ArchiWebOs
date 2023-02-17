function main() {
  const isLogged = localStorage.getItem("user_token")
  if (isLogged)
    adminPageView()
  fetch('http://localhost:5678/api/categories', { mode: 'cors' })
    .then(reponse => reponse.json())
    .then(reponse => getFilters(reponse))
    .catch(err => console.error(err))
}

function adminPageView() {
  const headerRef = document.getElementById("head")
  const loginChange = document.getElementById('loginout')
  const modifyTrigger = document.getElementById('basePortfolio')
  const adminNav = document.createElement('div')
  const adminNavText = document.createElement('p')
  const adminNavButton = document.createElement('button')
  const modifyGalleryButton = document.createElement('button')

  modifyGalleryButton.innerText = "modifier"
  adminNavButton.innerText = "publier les changements"
  adminNavText.innerText = "Mode édition"
  loginChange.innerHTML = "logout"
  adminNav.classList.add('admin-nav')
  adminNavText.classList.add('admin-nav-text')
  adminNavButton.classList.add('admin-nav-button')

  modifyTrigger.prepend(modifyGalleryButton)
  adminNav.appendChild(adminNavText)
  adminNav.appendChild(adminNavButton)
  headerRef.appendChild(adminNav)

  loginChange.addEventListener("click", () => HandleLogout(), { once: true })

}

function HandleLogout() {
  localStorage.removeItem("user_token")
  window.location.reload(true)
  window.location.replace('./index.html');
}

function HandleLogin() {
  window.location.href = "./login.html"
}

function displayAll() {
  const worksArray = document.getElementsByClassName('work')

  for (let i = 0; i < worksArray.length; i++) {
    worksArray[i].style.display = 'block'
  }
}

function orderBy(filter) {

  const worksArray = document.getElementsByClassName('work')

  for (let i = 0; i < worksArray.length; i++) {
    if (filter !== worksArray[i].getAttribute("id")) {
      worksArray[i].style.display = 'none'
    }
    else {
      worksArray[i].style.display = 'block'
    }
  }
}

function getFilters(filters) {

  const loginRef = document.getElementById('loginout')
  const allButton = document.getElementById("All")

  if (!localStorage.getItem("user_token"))
    loginRef.addEventListener("click", () => HandleLogin(), { once: true })

  allButton.addEventListener("click", () => displayAll())
  for (let i = 0; i < filters.length; i++) {
    const filterButton = document.createElement('button')

    filterButton.innerText = filters[i].name
    filterButton.classList.add("filter-button")

    const filterSection = document.querySelector(".filters")

    filterButton.addEventListener("click", () => orderBy(filterButton.innerText))
    filterSection.appendChild(filterButton)
  }
}

main()