// Update PUT
function updatePage(page) {
  const data = new FormData(document.getElementById('pageForm'))
  axios.put("./" + page, data)
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
    console.log(res)
  })
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
