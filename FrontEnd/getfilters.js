export let categories

function main() {
  const isLogged = localStorage.getItem("user_token")
  if (isLogged)
    adminPageView()
  fetch('http://localhost:5678/api/categories', { mode: 'cors' })
    .then(reponse => reponse.json())
    .then(reponse => categories = reponse)
    .then(reponse => getFilters(reponse))
    .catch(err => console.error(err))
}

function adminPageView() {
  const headerRef = document.getElementById("head")
  const loginChange = document.getElementById('loginout')
  const introSection = document.querySelector('#introduction figure')
  const modifyTrigger = document.getElementById('basePortfolio')
  // const editIcon = document.createElement('svg')
  const editIcon = document.createElement('span')
  const adminNav = document.createElement('div')
  const adminNavText = document.createElement('p')
  const adminNavButton = document.createElement('button')
  const modifyGalleryButton = document.createElement('a')

  modifyGalleryButton.setAttribute('href', "#modal")
  modifyGalleryButton.classList.add('js-modal')
  // editIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg' )
  // editIcon.setAttribute('fill', '#525252' )
  // editIcon.setAttribute('height', '24' )
  // editIcon.setAttribute('width', '24' )
  // editIcon.setAttribute('viewBox', '0 96 960 960' )
  editIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="#525252" height="24" viewBox="0 96 960 960" width="24"><path d="M180 876h44l443-443-44-44-443 443v44Zm614-486L666 262l42-42q17-17 42-17t42 17l44 44q17 17 17 42t-17 42l-42 42Zm-42 42L248 936H120V808l504-504 128 128Zm-107-21-22-22 44 44-22-22Z"/></svg>'
  modifyGalleryButton.innerHTML = "modifier"
  adminNavButton.innerText = "publier les changements"
  adminNavText.innerText = "Mode édition"
  loginChange.innerHTML = "logout"
  adminNav.classList.add('admin-nav')
  adminNavText.classList.add('admin-nav-text')
  adminNavButton.classList.add('admin-nav-button')

  introSection.appendChild(editIcon)
  modifyTrigger.appendChild(modifyGalleryButton)
  modifyTrigger.appendChild(editIcon.cloneNode(true))
  modifyTrigger.appendChild(modifyGalleryButton)
  adminNav.appendChild(editIcon.cloneNode(true))
  adminNav.appendChild(adminNavText)
  adminNav.appendChild(adminNavButton)
  headerRef.prepend(adminNav)

  editIcon.classList.add('edit-icon-style')

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
    if (filter !== worksArray[i].getAttribute("id").split('-id=')[0]) {
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