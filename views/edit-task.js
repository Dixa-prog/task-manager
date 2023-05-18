const taskIDDOM = document.querySelector('.task-edit-id')
const taskDateDOM = document.querySelector('.task-edit-finishdate')
const taskDetailsDOM = document.querySelector('.task-edit-details')
const taskDescriptionDOM = document.querySelector('.task-edit-description')
const taskCategoryDOM = document.querySelector('.task-edit-category')
const taskStartDateDOM = document.querySelector('.task-edit-startdate')
const taskDaysDOM = document.querySelector('.task-edit-days')
const taskCompletedDOM = document.querySelector('.task-edit-completed')
const editFormDOM = document.querySelector('.single-task-form')
const editBtnDOM = document.querySelector('.task-edit-btn')
const formAlertDOM = document.querySelector('.form-alert')
const params = window.location.search
const id = new URLSearchParams(params).get('id')
let tempName

const showTask = async () => {
  try {
    const {
      data: { task },
    } = await axios.get(`/api/v1/tasks/${id}`)
    const { _id: taskID, complete, taskDescription,category,startDate,finishDate,days,details } = task

    taskIDDOM.textContent = taskID
    taskDescriptionDOM.textContent = taskDescription
    taskCategoryDOM.textContent = category
    
    // Parse the start date from the server and format it as dd/mm/yyyy
    const startDateObj = new Date(startDate)
    const startDateFormatted = `${startDateObj.getDate()}/${startDateObj.getMonth() + 1}/${startDateObj.getFullYear()}`
    taskStartDateDOM.textContent = startDateFormatted

    taskDaysDOM.textContent = days
    const finishDateObj = new Date(finishDate);
    const finishDateFormatted = finishDateObj.toISOString().substring(0, 10);
    taskDateDOM.value = finishDateFormatted
    taskDetailsDOM.value = details
    tempName = taskDescription
    if (complete) {
      taskCompletedDOM.checked = true
    }
  } catch (error) {
    console.log(error)
  }
}



showTask()

editFormDOM.addEventListener('submit', async (e) => {
  editBtnDOM.textContent = 'Loading...'
  e.preventDefault()
  try {
    const taskdate = taskDateDOM.value
    const taskdetails = taskDetailsDOM.value
    const taskCompleted = taskCompletedDOM.checked
    // const taskDescrip = taskDescriptionDOM.value

    const {
      data: { task },
    } = await axios.patch(`/api/v1/tasks/${id}`, {
      // taskDescription: taskDescrip,
      finishDate: taskdate,
      details:taskdetails,
      complete: taskCompleted,
    })

    const { _id: taskID, complete, finishDate,details } = task

    const finishDateObj = new Date(finishDate);
    const finishDateFormatted = finishDateObj.toISOString().substring(0, 10);
    taskDateDOM.value = finishDateFormatted
    taskIDDOM.textContent = taskID
   
    taskDetailsDOM.value = details
    // taskDescriptionDOM.textContent = taskDescription
    // tempName = taskDescrip
    if (complete) {
      taskCompletedDOM.checked = true
    }
    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = `success, edited task`
    formAlertDOM.classList.add('text-success')
  } catch (error) {
    console.error(error)
    // taskDescriptionDOM.value = tempName
    formAlertDOM.style.display = 'block'
    formAlertDOM.innerHTML = `error, please try again`
  }
  editBtnDOM.textContent = 'Edit'
  setTimeout(() => {
    formAlertDOM.style.display = 'none'
    formAlertDOM.classList.remove('text-success')
  }, 3000)
})
