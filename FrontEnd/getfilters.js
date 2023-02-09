function main() {
  fetch('http://localhost:5678/api/categories', { mode: 'cors' })
    .then(reponse => reponse.json())
    .then(reponse => getFilters(reponse))
    .catch(err => console.error(err))
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

  const allButton = document.getElementById("All")

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