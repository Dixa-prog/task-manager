const tasksDOM = document.querySelector('.tasks')
const loadingDOM = document.querySelector('.loading-text')
const formDOM = document.querySelector('.task-form')
const taskInputDOM1 = document.querySelector('.task-input1')
const taskInputDOM3 = document.querySelector('.task-input3')
const taskInputDOM4 = document.querySelector('.task-input4')
const taskInputDOM5 = document.querySelector('.task-input5')
const taskInputDOM6 = document.querySelector('.task-input6')
const taskInputDOM7 = document.querySelector('.task-input7')
const formAlertDOM = document.querySelector('.form-alert')
// Load tasks from /api/tasks


// form

formDOM.addEventListener('submit', async (e) => {
  e.preventDefault()
  const taskDescription = taskInputDOM1.value
  const assignedTo = taskInputDOM3.value
  const category = taskInputDOM4.value
  const startDate = taskInputDOM5.value
  const finishDate = taskInputDOM6.value

  // Calculate days
  const start = new Date(startDate)
  const finish = new Date(finishDate)
  const days = Math.ceil((finish - start) / (1000 * 60 * 60 * 24))

  // Set days value
  taskInputDOM7.value = days

  try {
    await axios.post('/api/v1/tasks', { 
      taskDescription, 
      assignedTo, 
      category,
      startDate, 
      finishDate,  
      days,
     })
    console.log(taskDescription)
    taskInputDOM1.value = ''
    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = `success, task added`
    formAlertDOM.classList.add('text-success')
  } catch (error) {
    formAlertDOM.style.display = 'block'
    formAlertDOM.innerHTML = `error, please try again`
    console.log(error)
  }
  setTimeout(() => {
    formAlertDOM.style.display = 'none'
    formAlertDOM.classList.remove('text-success')
  }, 3000)
})
