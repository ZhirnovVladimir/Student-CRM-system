import * as methods from "./methods.mjs"
import * as scripts from "./scripts.mjs"

const loadingContainer = document.getElementById('loading-container')
const loadingAnimation = document.getElementById('loading__circle')

let studentsList = await methods.getStudents()
let studentAfterList = studentsList
if (studentsList.length == 0) {
  alert('Список студентов пуст, вы можете наполнить список помощью формы ниже')
}
scripts.createSelectOption(document.getElementById('startYearSelect'))
addStudent(tableBody, studentsList)


const submitButton = document.getElementById('submitButton')
submitButton.addEventListener('click', (e) => {             // Вызов функции по кнопке
  e.preventDefault()
  if (scripts.validateFields()) {

    const tableBody = document.getElementById('tableBody')
    const studentArr = scripts.getStudentInfoInput()

    loadingContainer.classList.add('loading')
    loadingAnimation.classList.add('loading__circle-loading')

    methods.createStudent(studentArr[0].name, studentArr[0].surname, studentArr[0].middlename, studentArr[0].birth, studentArr[0].start, studentArr[0].facility) //Записывает студента в БД после чего обновляет лист студента
      .then(() => {
        methods.getStudents()
          .then(students => {
            studentsList = students
            studentAfterList = studentsList
            addStudent(tableBody, studentArr)
            scripts.clearValues()
            scripts.clearAlerts()
            loadingContainer.classList.remove('loading')
            loadingAnimation.classList.remove('loading__circle-loading')
          })
      })
  }
  else {
    e.stopPropagation()
  }
})


// Этап 1. В HTML файле создайте верстку элементов, которые будут статичны(неизменны).

// Этап 2. Создайте массив объектов студентов.Добавьте в него объекты студентов, например 5 студентов.

const sortArrow = document.querySelectorAll('svg.bi-arrow-down-short') //обработка стрелочек для сортировки
sortArrow.forEach(item => {
  item.addEventListener('click', () => {
    let actualList = scripts.getActualStudentList()
    scripts.deleteDomStudents()
    item.classList.toggle('arrow-down')
    scripts.studentListSortFilter(item, actualList)
    addStudent(tableBody, actualList)
  })
})


const filter = document.querySelectorAll('input.form-filter') //Обработка полей для ввода в фильтр
filter.forEach(item => {
  item.addEventListener('input', () => {
    if (scripts.checkEpmtyFilter(filter)) {
      scripts.deleteDomStudents()
      addStudent(tableBody, scripts.studentFilter(filter, studentsList))
    }
    else {
      scripts.deleteDomStudents()
      addStudent(tableBody, studentsList)
    }
  })
})


function addStudent(tableBody, studentInfo) { // Добавление DOM элементов нового студента
  for (let i of studentInfo) {
    let tableRow = document.createElement('tr')
    let tableCellId = document.createElement('th')
    let tableCellFirstName = document.createElement('td')
    let tableCellLastName = document.createElement('td')
    let tableCellMiddleName = document.createElement('td')
    let tableCellBirthDate = document.createElement('td')
    let tableCellStartYear = document.createElement('td')
    let tableCellFacility = document.createElement('td')


    tableRow.className = 'student__row'


    let corrcetBirthDate = i.birth.split('-')
    const currentDate = new Date()
    let studentAge                            // Вычисление возраста студента
    if (Number(corrcetBirthDate[1]) < Number(currentDate.getMonth()) + 1 ||
      (Number(corrcetBirthDate[1]) === Number(currentDate.getMonth()) + 1 && Number(currentDate.getDate()) >= Number(corrcetBirthDate[2]))) {
      studentAge = Number(currentDate.getFullYear()) - Number(corrcetBirthDate[0])
    }
    else {
      studentAge = Number(currentDate.getFullYear()) - Number(corrcetBirthDate[0]) - 1
    }

    let studentStudy                        // Вычисление курса
    if (Number(currentDate.getFullYear()) - Number(i.start) > 4 ||
      (Number(currentDate.getFullYear()) - Number(i.start) === 4 && Number(currentDate.getMonth()) + 1 >= 9)) {
      studentStudy = 'закончил'
    }
    else {
      studentStudy = `${Number(currentDate.getFullYear()) - Number(i.start)} курс`
    }

    tableCellId.setAttribute('scope', 'row')
    tableCellId.textContent = scripts.getId(tableBody)

    tableCellFirstName.textContent = i.name
    tableCellLastName.textContent = i.surname
    tableCellMiddleName.textContent = i.middlename
    tableCellBirthDate.textContent = `${corrcetBirthDate[2]}.${corrcetBirthDate[1]}.${corrcetBirthDate[0]} (${studentAge} лет)`
    tableCellStartYear.textContent = `${i.start}-${Number(i.start) + 4} (${studentStudy})`
    tableCellFacility.textContent = i.facility

    let deleteButton = document.createElement('button')
    deleteButton.className = 'btn btn-danger align-self-center'
    deleteButton.textContent = 'Удалить'
    deleteButton.addEventListener('click', (e) => {
      e.preventDefault()
      if (confirm('Вы уверены?')) {
        tableRow.remove()

        loadingContainer.classList.add('loading')
        loadingAnimation.classList.add('loading__circle-loading')

        methods.getStudents().then(students => {
          for (let student of students) {
            if (student.name === i.name && student.surname === i.surname && student.middlename === i.middlename && student.birth === i.birth && student.start === i.start
              && student.facility === i.facility) {
              methods.deleteStudent(student.id).then(() => {
                studentsList = methods.getStudents().then(students => {
                  studentAfterList = students
                  loadingContainer.classList.remove('loading')
                  loadingAnimation.classList.remove('loading__circle-loading')
                })
              })
            }
          }
        })
      }
    }
    )


    tableRow.append(tableCellId)
    tableRow.append(tableCellFirstName)
    tableRow.append(tableCellLastName)
    tableRow.append(tableCellMiddleName)
    tableRow.append(tableCellBirthDate)
    tableRow.append(tableCellStartYear)
    tableRow.append(tableCellFacility)
    tableRow.append(deleteButton)
    tableBody.append(tableRow)
  }
}
