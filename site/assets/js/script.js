/*
* SLIDESHOW
*/
function slideShow(id, index, active) {

  if(window[active]) {
    const parent = document.getElementById(id)
    const slides = parent.getElementsByClassName('slide')
    const boxes = parent.getElementsByClassName('box')
  
    let slideIndex = window[index]
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
      boxes[i].classList.remove("filled")
    }
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}
    slides[slideIndex-1].style.display = "block";
    boxes[slideIndex-1].classList.add("filled");
    
    window[index] = slideIndex
    setTimeout(slideShow, 8000, id, index, active); 
  }
}

function next(id, index, active) {
  window[active] = false
  const parent = document.getElementById(id)
  const slides = parent.getElementsByClassName('slide')
  const boxes = parent.getElementsByClassName('box')

  let slideIndex = window[index]
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
    boxes[i].classList.remove("filled")
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}
  slides[slideIndex-1].style.display = "block";
  boxes[slideIndex-1].classList.add("filled");

  window[index] = slideIndex
}

function prev(id, index, active) {
  window[active] = false
  const parent = document.getElementById(id)
  const slides = parent.getElementsByClassName('slide')
  const boxes = parent.getElementsByClassName('box')

  let slideIndex = window[index]
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
    boxes[i].classList.remove("filled")
  }
  slideIndex--;
  if (slideIndex < 1 ) {slideIndex = slides.length}
  slides[slideIndex-1].style.display = "block";
  boxes[slideIndex-1].classList.add("filled");

  window[index] = slideIndex
}

/*
* MODAL
*/
let activeModal = false

function showModal(id) {
  if(!activeModal) {
    const modal = document.getElementById(id)
    modal.style.display = "flex"
  
    setTimeout(() =>{
      activeModal = modal
    }, 100)
  }
}

window.onclick = function(event) {
  console.log(event.target)
  if (activeModal == event.target) {

    activeModal.style.display = "none"
    activeModal = false;
  }
}


// function hideModal(id) {
//   const modal = document.getElementById(id)
//   modal.style.display = "none"
// }