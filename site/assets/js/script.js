/*
* SLIDESHOW
*/
const carousels = document.getElementsByClassName('carousel')

let carouselActive = []
let carouselIndex = []

for (let num = 0; num < carousels.length; num++) {
  carouselActive.push(true)
  carouselIndex.push(0)

  let nextButton = carousels[num].getElementsByClassName('next')[0]
  nextButton.addEventListener('click', () => {
    slideNext(carousels[num], num)
  })

  let prevButton = carousels[num].getElementsByClassName('prev')[0]
  prevButton.addEventListener('click', () => {
    slidePrev(carousels[num], num)
  })

  slideShow(carousels[num], num)
}

function slideNext(carousel, num) {
  carouselActive[num] = false

  const slides = carousel.getElementsByClassName('slide')
  const boxes = carousel.getElementsByClassName('box')

  let slideIndex = carouselIndex[num]
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
    boxes[i].classList.remove("filled")
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}
  slides[slideIndex-1].style.display = "block";
  boxes[slideIndex-1].classList.add("filled");
  
  carouselIndex[num] = slideIndex
}

function slidePrev(carousel, num) {
  carouselActive[num] = false

  const slides = carousel.getElementsByClassName('slide')
  const boxes = carousel.getElementsByClassName('box')

  let slideIndex = carouselIndex[num]
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
    boxes[i].classList.remove("filled")
  }
  slideIndex--;
  if (slideIndex < 1 ) {slideIndex = slides.length}
  slides[slideIndex-1].style.display = "block";
  boxes[slideIndex-1].classList.add("filled");

  carouselIndex[num] = slideIndex
}

function slideShow(carousel, num) {
  if (carouselActive[num]) {
    const slides = carousel.getElementsByClassName('slide')
    const boxes = carousel.getElementsByClassName('box')
  
    let slideIndex = carouselIndex[num]
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
      boxes[i].classList.remove("filled")
    }
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}
    slides[slideIndex-1].style.display = "block";
    boxes[slideIndex-1].classList.add("filled");
    
    carouselIndex[num] = slideIndex

    setTimeout(slideShow, 8000, carousel, num)
  }
}

/*
* MODAL
*/
let activeModal = false

const modalButtons = document.getElementsByClassName('modal-img-btn')

Array.from(modalButtons).forEach(button => {
  button.addEventListener("click", () => {
    showModal(button.dataset.image, button.dataset.subtext, button.dataset.width, button.dataset.height, button.dataset.alt)
  })
})

function showModal(image, subtext, width, height, alt) {
  if(!activeModal) {
    const modal = document.getElementById('modal')
    const source = modal.getElementsByTagName('source')[0]
    const img = modal.getElementsByTagName('img')[0]
    img.width = width
    img.height = height
    source.width = width
    source.height = height
    source.srcset = image+".webp"
    img.src= image+".jpg"
    img.alt = alt

    const sub = document.getElementsByClassName('subtext')[0]

    sub.innerHTML = decodeURIComponent(subtext)
    modal.style.display = "flex"
    setTimeout(() =>{
      activeModal = modal
    }, 100)
  }
}

window.onclick = function(event) {
  if (activeModal == event.target) {

    activeModal.style.display = "none"
    activeModal = false;
  }
}
