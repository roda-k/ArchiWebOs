export let works

function workFetch() {
  fetch('http://localhost:5678/api/works', { mode: 'cors' })
    .then(reponse => reponse.json())
    .then(reponse => works = reponse)
    .then(() => getGallery(works))
    .catch(err => console.error(err))
}

export function getGallery(props) {

  const workSection = document.querySelector(".gallery")
  workSection.innerHTML = ""

  for (let i = 0; i < props.length; i++) {
    const workContent = document.createElement("figure")
    const workCaption = document.createElement("figcaption")
    const workImage = document.createElement("img")

    workImage.crossOrigin = "anonymous"
    workImage.src = props[i].imageUrl
    workImage.alt = props[i].title
    workCaption.innerText = props[i].title
    workContent.classList.add('work')
    workContent.setAttribute("id", `${props[i].category.name}-id=${props[i].id}`)


    workContent.appendChild(workImage)
    workContent.appendChild(workCaption)
    workSection.appendChild(workContent)
  }
}

workFetch()