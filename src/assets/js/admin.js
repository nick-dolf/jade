/*
* PAGES
*/

// Create POST
function createPage() {
  const name = document.getElementById('name').value

  axios.post("./pages/series", {"name": name})
    .then(res => {
      location.reload()
    })
    .catch(err => {
      console.error(err.message)
    })
}

// Update PUT
function updatePage() {
  const data = new FormData(document.getElementById('pageForm'))
  const saveButton = document.getElementById("saveChanges")

  for (const [key, value] of data) {
    console.log(`${key}: ${value}\n`)
  }
  saveButton.disabled = true
  saveButton.firstChild.textContent = "Loading"
  saveButton.lastChild.classList.remove("d-none")

  axios.put("", data)
    .then( res => {
      console.log(res)
    })
    .catch(err => {
      console.error(err.message)
    })
}

// Delete DELETE
function deletePage(page) {
  axios.delete("pages/series/" + page)
  .then( res => {
    location.reload()
  })
  .catch(err => {
    console.error(err.message)
  })
}

/*
* IMAGES
*/
// SUBMIT SPINNER
function submitSpinner() { 
  const submitButton = document.getElementById("submitButton")
  console.log(submitButton)

  submitButton.disabled = true
  submitButton.firstChild.textContent = "Loading"
  submitButton.lastChild.classList.remove("d-none")
}

// UPDATE (PUT)
function updateImage(img) {

  const imgForm = document.getElementById(img)
  const imgButton = document.getElementById(img+'-btn')
  const imgLi = document.getElementById(img+'-li')

  const data = new FormData(imgForm)

  imgButton.disabled = true
  imgButton.firstChild.textContent = "Loading"
  imgButton.lastChild.classList.remove("d-none")
  
  axios.put(img, data)
  .then( res => {
    
    if(res.data != 'no change') {
      imgLi.innerHTML = res.data.replaceAll("null", "")

      imgButton.firstChild.textContent = "Updated!!"
      imgButton.lastChild.classList.add("d-none")
      setTimeout(() => {
        imgButton.disabled = false
        imgButton.firstChild.textContent = "Update"
      }, 2000)
    } else {
      imgButton.disabled = false
      imgButton.firstChild.textContent = "Update"
      imgButton.lastChild.classList.add("d-none")
    }
 
  })
  .catch(err => {
    console.error(err.message)
  })

}

// DELETE
function deleteImage(img) {
  if(confirm('confirm delete?') == true) {
    axios.delete(img)
    .then( res => {
      window.location.href = window.location.href
    })
    .catch(err => {
      console.error(err.message)
    })
  }
}




//
function removeListItem(event) {
  event.preventDefault()
  event.target.parentElement.remove()
}

function newTextBox(name, parentId) {
  const parent = document.getElementById(parentId)
  const index = parent.children.length - 1

  const li = document.createElement('li')
  li.className = 'list-group-item d-flex align-items-start justify-content-between'
  const text = document.createElement('textarea')
  text.className = 'col-10'
  text.name = name
  li.appendChild(text)
  const button = document.createElement('button')
  button.className = 'btn btn-danger'
  button.innerText = 'Delete'
  button.onclick = (event) => removeListItem(event)
  li.appendChild(button)
  parent.insertBefore(li, parent.children[index])
}

function newCardImage(name, parentId) {
  const parent = document.getElementById(parentId)
  const index = parent.children.length - 1

  const li = document.createElement('li')
  li.className = 'list-group-item d-flex align-items-start justify-content-between'
  const text = document.createElement('textarea')
  text.className = 'col-10'
  text.name = name
  li.appendChild(text)
  const button = document.createElement('button')
  button.className = 'btn btn-danger'
  button.innerText = 'Delete'
  button.onclick = (event) => removeListItem(event)
  li.appendChild(button)
  parent.insertBefore(li, parent.children[index])
}

let activeImage

function addImageItem (parentId) {
  const parent = document.getElementById(parentId)
  const count = parent.childElementCount

  const li = document.createElement('li')
  li.className = "list-group-item"
  li.innerHTML = `
    <div class="row gy-1">
      <div class="col-md-4 container"><img class="img-fluid img-thumbnail" height="150" width="150" src=""/>
        <button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#imageModal" onclick="setActiveImage(event)">Select Image</button>
        <input class="form-control" name="${parentId}[0][image]" value="" type="hidden"/>
      </div>
      <div class="col-md-8">
        <label class="form-label">title</label>
        <textarea class="form-control" name="${parentId}[0][subtext]" rows=4/>**Bold**, date\ndescription\n*italic*</textarea>
      </div>
    </div>
    <div class="d-flex justify-content-between pt-2">
    <button class="btn btn-danger" type="button" onclick="deleteImageItem('${parentId}','0')">Delete</button>
    <button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#imageModal" onclick="setActiveImage(event)">Select Image</button>
  </div>
  `
  parent.prepend(li)

  const listItems = parent.children
  console.log(listItems)
  Array.from(listItems).forEach((item, index) => {
    item.getElementsByTagName('input')[0].name = `${parentId}[${index}][image]`
    item.getElementsByTagName('textarea')[0].name = `${parentId}[${index}][subtext]`

    item.getElementsByClassName('btn-danger')[0].setAttribute("onclick", `deleteImageItem('${parentId}','${index}')`)
  })
}

function deleteImageItem(parentId, index) {
  const parent = document.getElementById(parentId)
  const count = parent.childElementCount
  
  console.log(count)
  if (count > 1) {
    const listItems = parent.children
    listItems[index].remove()

    Array.from(listItems).forEach((item, index) => {
      item.getElementsByTagName('input')[0].name = `${parentId}[${index}][image]`
      item.getElementsByTagName('textarea')[0].name = `${parentId}[${index}][subtext]`

      item.getElementsByClassName('btn-danger')[0].setAttribute("onclick", `deleteImageItem('${parentId}','${index}')`)
    })
  } else if (count == 1) {
    const input = document.createElement('input')
    input.name = parent.id
    input.type = "hidden"
    input.id = parent.id+"-delete"
    parent.children[0].remove()
    parent.appendChild(input)
    updatePage()
  }



  // if (count > 2) {
  //   parent.children[count-2].remove()
  // } else if (count == 2) {
  //   const input = document.createElement('input')
  //   input.name = parent.id
  //   input.type = "hidden"
  //   input.id = parent.id+"-delete"
  //   parent.children[count-2].remove()
  //   parent.appendChild(input)
  //   updatePage()
  // }
}

function setActiveImage(event) {
  activeImage = event.target.parentNode.parentNode;
}

function changeImage(img) {
  const imgInput = activeImage.getElementsByTagName('input')[0]
  imgInput.value = img

  const imgTag = activeImage.getElementsByTagName('img')[0]
  
  const imDir = window.location.href.replace('/pages/', '/assets/images/')
  console.log(imDir)
  imgTag.src = imDir+"/modify/thumb/"+img
}