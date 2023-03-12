import { categories } from "./getfilters.js"

var works

function workFetch() {
  fetch('http://localhost:5678/api/works', { mode: 'cors' })
    .then(reponse => reponse.json())
    .then(reponse => works = reponse)
    .then(() => getGallery(works))
    .catch(err => {
      if (err === 500) {
        const body = document.getElementById('basePortfolio')
        const errorDiv = document.createElement('div')

        errorDiv.classList.add('general-error-style')
        errorDiv.innerHTML = "Erreur 500: Une erreur est survenue lors de la récupération des filtres"
        body.appendChild(errorDiv)
      }
    })
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


let modal = null
let imgCheck = null
let titleCheck = null

const openModal = function (e) {
  e.preventDefault()
  const target = document.querySelector(e.target.getAttribute('href'))
  target.style.display = null
  target.removeAttribute('aria-hidden')
  target.setAttribute('aria-modal', 'true')
  modal = target
  modal.addEventListener('click', closeModal)
  modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
  modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
  // inner modal creation 

  modalDeleteView()
}

function modalDeleteView() {
  const modalBody = document.getElementById("modalContent")
  modalBody.classList.add('modal-global-style')
  modalBody.innerHTML = ""
  const title = document.createElement("p")
  const modalGallery = document.createElement("div")
  modalGallery.classList.add("modal-gallery")
  const modalFooter = document.createElement("div")
  modalFooter.classList.add("modal-footer")
  const modalAddButton = document.createElement("button")
  const modalDeleteLink = document.createElement("a")
  const deleteLinkText = document.createTextNode("Supprimer la galerie")

  // Elements base content

  title.innerHTML = "Galerie Photo"
  title.classList.add("modal-title-style")
  modalAddButton.innerHTML = "Ajouter une photo"
  modalAddButton.classList.add("modal-add-button")
  modalDeleteLink.appendChild(deleteLinkText)
  modalDeleteLink.title = "Supprimer la galerie"
  modalDeleteLink.href = '#'
  // modalDeleteLink.innerHTML = "Supprimer la galerie"
  modalDeleteLink.classList.add("modal-delete-link")

  // Children append + class attribute

  modalBody.appendChild(title)
  modalBody.appendChild(modalGallery)
  modalFooter.appendChild(modalAddButton)
  modalFooter.appendChild(modalDeleteLink)
  modalBody.appendChild(modalFooter)

  modalAddButton.addEventListener("click", () => {
    title.remove()
    modalGallery.remove()
    modalFooter.remove()
    modalAddButton.remove()
    modalDeleteLink.remove()
    modalAddView()
  })
  gallerySetup(modalGallery, works)
  getGallery(works)
}

// addeventlistener('input', fonction)

function modalAddView() {
  const modalBody = document.getElementById('modalContent')
  modalBody.innerHTML = ""
  const modalFooter = document.createElement("div")
  const title = document.createElement('p')
  const inputTitle = document.createElement('p')
  const selectTitle = document.createElement('p')
  const imgInput = document.createElement('input')
  const imgInputContainer = document.createElement('div')
  const imgInputLabel = document.createElement('label')
  const imgSelectButton = document.createElement('span')
  const imgTitle = document.createElement('input')
  const imgCategory = document.createElement('select')
  const submitButton = document.createElement('button')
  const previousButton = document.createElement('button')

  previousButton.innerHTML = '<-'
  imgSelectButton.innerHTML = '+ Ajouter photo'

  // attach all necessary classes

  imgTitle.classList.add('input-style')
  imgCategory.classList.add('input-style')
  imgInputLabel.classList.add('label-style')
  previousButton.classList.add('modal-previous-button')
  imgInputContainer.classList.add('modal-add-container')
  imgSelectButton.classList.add('modal-add-image')
  modalFooter.classList.add("modal-footer")
  submitButton.classList.add('conditionnal-submit')
  inputTitle.classList.add('input-title-label')
  selectTitle.classList.add('input-title-label')

  imgCategory.setAttribute('id', 'filterName')
  submitButton.setAttribute('id', 'submitButton')
  submitButton.setAttribute('disabled', 'true')
  submitButton.innerHTML = 'Valider'

  for (let i = 0; i < categories.length; i++) {
    const dropOption = document.createElement('option')

    dropOption.value = categories[i].id
    dropOption.innerHTML = categories[i].name
    imgCategory.appendChild(dropOption)
  }

  title.innerHTML = 'Ajout photo'
  inputTitle.innerHTML = 'Titre'
  title.classList.add('modal-title-style')
  imgInput.type = 'file'
  imgInput.accept = 'images/png'
  imgInput.classList.add('is-hidden')
  imgInput.addEventListener('change', (e) => imgUpload(e.target.files))
  imgTitle.addEventListener('change', (e) => imgNameUpload(e.target.value))
  submitButton.addEventListener('click', () => workUpload())
  previousButton.addEventListener('click', () => modalDeleteView())
  imgInputContainer.appendChild(imgInputLabel)
  imgInputLabel.appendChild(imgInput)
  imgInputLabel.appendChild(imgSelectButton)
  modalFooter.appendChild(submitButton)
  modalBody.appendChild(title)
  modalBody.appendChild(imgInputContainer)
  modalBody.appendChild(inputTitle)
  modalBody.appendChild(imgTitle)
  modalBody.appendChild(selectTitle)
  modalBody.appendChild(imgCategory)
  modalBody.appendChild(previousButton)
  modalBody.appendChild(modalFooter)
  if (imgCheck && titleCheck) {
    submitButton.removeAttribute('disabled')
  }
}

function workUpload() {
  let workToSend = new FormData()
  const categoryElement = document.getElementById('filterName')
  const user = JSON.parse(localStorage.getItem('user_token'))
  // Bruh !!!!!
  workToSend.append('userId', user.userId)
  workToSend.append('category', categoryElement.value)
  workToSend.append('image', imgCheck)
  workToSend.append('title', titleCheck)

  fetch(`http://localhost:5678/api/works`, {
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Authorization': `Bearer ${user.token}`,
    },
    body: workToSend
  }).then(response => response.json())
    .then(data => works.push({
      category: {
        id: categoryElement.value,
        name: categories[(categoryElement.value - 1)].name
      },
      categoryId: categoryElement.value,
      imageUrl: URL.createObjectURL(imgCheck),
      title: titleCheck,
      userId: user.userId,
      id: data.id,
    }))
    .then(() => modalDeleteView())
    .catch(err => {
      const modalBody = document.getElementById('modalContent')
      const errorDiv = document.createElement('div')
      errorDiv.classList.add('general-error-style')

      if (err === 500) {
        errorDiv.innerHTML = "Erreur 500: Une erreur est survenue lors de l'envoi du projet"
        modalBody.appendChild(errorDiv)
      } else if (err === 401) {
        errorDiv.innerHTML = "Erreur 401: Non autorisé"
        modalBody.appendChild(errorDiv)
      } else if (err === 400) {
        errorDiv.innerHTML = "Erreur 400: Mauvaise requête"
        modalBody.appendChild(errorDiv)
      }
    })
}

function imgNameUpload(value) {
  const submitButton = document.getElementById('submitButton')
  titleCheck = value
  if (imgCheck && titleCheck && titleCheck != '') {
    submitButton.removeAttribute('disabled')
  } else if (titleCheck === '') {
    titleCheck = null
    submitButton.setAttribute('disabled', 'true')
  }
}

function imgUpload(files, value) {
  const submitButton = document.getElementById('submitButton')
  const modalBody = document.getElementById('modalContent')
  const inputLabelToDelete = document.getElementsByClassName('label-style')
  const previewContainer = document.getElementsByClassName('modal-add-container')
  const imgPreviewURL = URL.createObjectURL(files[0])
  const imgPreview = document.createElement("img")
  imgPreview.classList.add('uploaded-img')

  imgPreview.src = imgPreviewURL

  inputLabelToDelete[0].remove()
  previewContainer[0].appendChild(imgPreview)
  imgCheck = files[0]
  if (imgCheck && titleCheck && titleCheck != '') {
    submitButton.removeAttribute('disabled')
  } else if (titleCheck === '') {
    titleCheck = null
    submitButton.setAttribute('disabled', 'true')
  }
}

function gallerySetup(modalGallery) {

  modalGallery.innerHTML = ""

  for (let i = 0; i < works.length; i++) {
    const workContainer = document.createElement("div")
    const workContent = document.createElement("figure")
    const workCaption = document.createElement("figcaption")
    const workImage = document.createElement("img")
    const deleteIconContainer = document.createElement('div')
    const deleteIcon = document.createElement('img')

    deleteIconContainer.classList.add('delete-icon-container')
    deleteIcon.src = './assets/icons/delete_FILL0_wght400_GRAD0_opsz48.svg'

    workImage.crossOrigin = "anonymous"
    workImage.src = works[i].imageUrl
    workImage.alt = "éditer"
    workImage.classList.add("work-image")
    workCaption.innerText = "éditer"
    workContent.classList.add('modal-work')
    workContainer.classList.add('work-container')
    workContent.setAttribute("id", `${works[i].category.name}-id=${works[i].id}`)

    deleteIconContainer.addEventListener("click", async function (e) {
      e.preventDefault()
      await removeWork(workContainer, works[works.findIndex(item => item.imageUrl === workImage.src)].id)
    })

    deleteIconContainer.appendChild(deleteIcon)
    workContent.appendChild(workImage)
    workContent.appendChild(workCaption)
    workContainer.appendChild(workContent)
    workContainer.appendChild(deleteIconContainer)
    modalGallery.appendChild(workContainer)
  }
}

const closeModal = function (e) {
  e.preventDefault()


  if (modal === null)
    return

  modal.setAttribute('aria-hidden', 'true')
  modal.removeAttribute('aria-modal')
  modal.removeEventListener('click', closeModal)
  modal.querySelector('.js-modal-close').removeEventListener('click', closeModal)
  modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
  modal.style.display = 'none'
}

async function removeWork(workContainer, id) {
  const user = JSON.parse(localStorage.getItem('user_token'))
  await fetch(`http://localhost:5678/api/works/${id}`, {
    method: 'DELETE',
    redirect: 'manual',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Authorization': `Bearer ${user.token}`,
    },
  }).then(response => console.log(response, response.redirected, response.type))
    .catch(err => {
      const modalBody = document.getElementById('modalContent')
      const errorDiv = document.createElement('div')
      errorDiv.classList.add('general-error-style')

      if (err === 500) {
        errorDiv.innerHTML = "Erreur 500: Une erreur est survenue lors de l'envoi du projet"
        modalBody.appendChild(errorDiv)
      } else if (err === 401) {
        errorDiv.innerHTML = "Erreur 401: Non autorisé"
        modalBody.appendChild(errorDiv)
      }
    })
  workContainer.remove()
  const indexToDelete = works.findIndex((element) => element.id === id)
  works.splice(indexToDelete, 1)
  getGallery(works)
}

const stopPropagation = function (e) {
  e.stopPropagation()
}

window.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' || e.key == 'Esc')
    closeModal(e)
})

document.querySelectorAll('.js-modal').forEach(a => {
  a.addEventListener('click', openModal)
})

workFetch()