
let modal = null

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
  const testContent = document.createElement("div")
  testContent.innerHTML = "oulala"
  const test = document.getElementsByClassName('modal-wrapper')[0]
  test.appendChild(testContent)
}

const closeModal = function (e) {
  e.preventDefault()

  if (modal === null)
    return

  modal.style.display = 'none'
  modal.setAttribute('aria-hidden', 'true')
  modal.removeAttribute('aria-modal')
  modal.removeEventListener('click', closeModal)
  modal.querySelector('.js-modal-close').removeEventListener('click', closeModal)
  modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
  modal = null
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