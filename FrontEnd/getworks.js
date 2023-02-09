function main() {
  fetch('http://localhost:5678/api/works', { mode: 'cors' })
    .then(reponse => reponse.json())
    .then(reponse => getGallery(reponse))
    .catch(err => console.error(err))
}

function getGallery(works) {

  for (let i = 0; i < works.length; i++) {
    const workContent = document.createElement("figure")
    const workCaption = document.createElement("figcaption")
    const workImage = document.createElement("img")

    workImage.crossOrigin = "anonymous"
    workImage.src = works[i].imageUrl
    workImage.alt = works[i].title
    workCaption.innerText = works[i].title
    workContent.classList.add('work')
    workContent.setAttribute("id", works[i].category.name)
    
    const workSection = document.querySelector(".gallery")

    workContent.appendChild(workImage)
    workContent.appendChild(workCaption)
    workSection.appendChild(workContent)
  }
}

main()