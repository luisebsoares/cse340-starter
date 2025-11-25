const form = document.querySelector("#updateForm")
const updateBtn = form.querySelector("button[type='submit']")

const originalData = new FormData(form)
const originalValues = Object.fromEntries(originalData.entries())

function dataChanged() {
  const currentData = new FormData(form)
  const currentValues = Object.fromEntries(currentData.entries())

    for (let key in originalValues) {
        if (originalValues[key] !== currentValues[key]) {
            return true
        }
    }
    return false
}
 
form.addEventListener("input", () => {
    if (dataChanged()) {
      updateBtn.removeAttribute("disabled")
    } else {
      updateBtn.setAttribute("disabled", true)
    }
  })