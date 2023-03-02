import { getGallery, works } from "./getworks.js"
import { categories } from "./getfilters.js"

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
  console.log("works =>", works)

  modalAddButton.addEventListener("click", () => {
    title.remove()
    modalGallery.remove()
    modalFooter.remove()
    modalAddButton.remove()
    modalDeleteLink.remove()
    modalAddView()
  })
  gallerySetup(modalGallery)
  getGallery(works)
  console.log("number of works =>", works.length)
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
  console.log("imgtitle => ", imgTitle.value)
  console.log("value =>", imgInput.value)
  console.log("imgcategory => ", imgCategory)
  if (imgCheck && titleCheck) {
    submitButton.removeAttribute('disabled')
  }
}

async function workUpload() {
  let workToSend = new FormData()
  const categoryElement = document.getElementById('filterName')
  const user = JSON.parse(localStorage.getItem('user_token'))
  // Bruh !!!!!
  workToSend.append('userId', user.userId)
  workToSend.append('category', categoryElement.value)
  workToSend.append('image', imgCheck)
  workToSend.append('title', titleCheck)

  console.log('works before => ', works)
  await fetch(`http://localhost:5678/api/works`, {
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Authorization': `Bearer ${user.token}`,
    },
    body: workToSend
  }).then(console.log('holy shit it worked'))
  works.push({
    category: {
      id: categoryElement.value,
      name: categories[(categoryElement.value - 1)].name
    },
    categoryId: categoryElement.value,
    imageUrl: URL.createObjectURL(imgCheck),
    title: titleCheck,
    userId: user.userId,
  })
  modalDeleteView()
}

function imgNameUpload(value) {
  const submitButton = document.getElementById('submitButton')
  titleCheck = value
  if (imgCheck && titleCheck && titleCheck != '') {
    console.log('ok dood')
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
  console.log('files => ', files)
  const imgPreviewURL = URL.createObjectURL(files[0])
  const imgPreview = document.createElement("img")
  imgPreview.classList.add('uploaded-img')
  console.log("img =>", files[0])

  imgPreview.src = imgPreviewURL

  inputLabelToDelete[0].remove()
  previewContainer[0].appendChild(imgPreview)
  imgCheck = files[0]
  if (imgCheck && titleCheck && titleCheck != '') {
    console.log('ok dood')
    submitButton.removeAttribute('disabled')
  } else if (titleCheck === '') {
    titleCheck = null
    submitButton.setAttribute('disabled', 'true')
  }
}

function gallerySetup(modalGallery) {

  modalGallery.innerHTML = ""

  console.log('works in gallery setup =>', works.length)

  for (let i = 0; i < works.length; i++) {
    const workContent = document.createElement("figure")
    const workCaption = document.createElement("figcaption")
    const workImage = document.createElement("img")

    workImage.crossOrigin = "anonymous"
    workImage.src = works[i].imageUrl
    workImage.alt = "éditer"
    workImage.classList.add("work-image")
    workCaption.innerText = "éditer"
    workContent.classList.add('modal-work')
    workContent.setAttribute("id", `${works[i].category.name}-id=${works[i].id}`)

    workImage.addEventListener("click", async function (e) {
      console.log('mdr')
      e.preventDefault()
      await removeWork(workContent, works[i].id)
    })

    workContent.appendChild(workImage)
    workContent.appendChild(workCaption)
    modalGallery.appendChild(workContent)
  }
}

const closeModal = function (e) {
  e.preventDefault()

  console.log('closemodal')

  if (modal === null)
    return

  modal.setAttribute('aria-hidden', 'true')
  modal.removeAttribute('aria-modal')
  modal.removeEventListener('click', closeModal)
  modal.querySelector('.js-modal-close').removeEventListener('click', closeModal)
  modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
  modal.style.display = 'none'
}

async function removeWork(workContent, id) {
  const user = JSON.parse(localStorage.getItem('user_token'))
  await fetch(`http://localhost:5678/api/works/${id}`, {
    method: 'DELETE',
    redirect: 'manual',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Authorization': `Bearer ${user.token}`,
    },
  }).then(response => console.log(response, response.redirected, response.type))
  workContent.remove()
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

/* 
$('#formFileMultiple10').on('change', function() {
    console.log($('#formFileMultiple10')[0]['files']);
    if($('#formFileMultiple10')[0]['files'].length === 0) {
      var content = "<p>Aucun nouveau fichier sélectionné</p>";
      $('#preview10').html(content);
    } else {
      var content = "";
      for (var i = $('#formFileMultiple10')[0]['files'].length - 1; i >= 0; i--) {   
        if(validFileType($('#formFileMultiple10')[0]['files'][i])) {
            content += '<p>Nom du fichier : ' + $('#formFileMultiple10')[0]['files'][i].name + ' | Taille du fichier : ' + returnFileSize($('#formFileMultiple10')[0]['files'][i].size) + '.</p>';
            var src = window.URL.createObjectURL($('#formFileMultiple10')[0]['files'][i]);
            content += '<img class="img-fluid mb-3" src="' + src + '">';
        } else {
            content += '<p>Nom du fichier : ' + $('#formFileMultiple10')[0]['files'][i].name + ' | Fichier invalide. Veuillez modifier votre sélection.</p>';

        }
      }
      $('#preview9').html(content);
    }
  });
  
  https://developer.mozilla.org/fr/docs/Web/API/URL/createObjectURL
  https://developer.mozilla.org/fr/docs/Web/API/FileReader/readAsDataURL

  pour le post: 
  https://developer.mozilla.org/fr/docs/Web/API/FormData/FormData
  https://javascript.info/formdata
  https://www.w3schools.com/TAGs/att_form_enctype.asp
  */