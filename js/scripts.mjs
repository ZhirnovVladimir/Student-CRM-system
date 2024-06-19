import * as methods from "./methods.mjs"



export function createSelectOption(formSelect) {                   // Добавление выбора начала обучения начиная с 2000 и заканичвая текущим годгом
  for (let i = 2000; i <= new Date().getFullYear(); i++) {
    let selectYear = document.createElement('option')
    formSelect.append(selectYear)
    selectYear.setAttribute('value', i)
    selectYear.textContent = i
  }
}

export function getId(tableBody) { // Получение последнего номера в таблице
  let count = tableBody.children
  if (count.length) {
    return count.length + 1
  }
  else {
    return 1
  }
}

export function clearValues() { // Отчищает значения в инпутах
  let clearValues = document.querySelectorAll('input.form-add-student')
  clearValues.forEach(item => {
    item.value = ''
  })
}


export function clearAlerts() { // Убирает алерты
  let alertedLables = document.querySelectorAll('div.alert-feedback')
  if (alertedLables.length > 0) {
    alertedLables.forEach(item => {
      item.classList.toggle('alert-feedback')
    })
  }
}

export function validateFields() { // Проверка ввода полей
  clearAlerts()
  let studentInfo = getStudentInfoInput()[0]
  let flag = true
  const today = new Date()
  const day = today.getDate()
  const month = today.getMonth() + 1
  const year = today.getFullYear()
  let birthDateArr = studentInfo.birth.split('-')
  let validateBirthDateText = document.getElementById('invalidFeedbackBirthDate')

  if (birthDateArr.length == 1) {
    validateBirthDateText.classList.toggle('alert-feedback')
    validateBirthDateText.textContent = 'Выберите дату рождения'
    flag = false
  }
  else {
    if (Number(birthDateArr[0]) > year || Number(birthDateArr[0]) < 1900) {
      flag = false
      validateBirthDateText.classList.toggle('alert-feedback')
      validateBirthDateText.textContent = 'Указанная дата меньше чем 01.01.1900'
    }
    else if (Number(birthDateArr[0]) === 1900 && parseInt(birthDateArr[1]) === 1 && birthDateArr[2] >= 1) {
      flag = false
      validateBirthDateText.classList.toggle('alert-feedback')
      validateBirthDateText.textContent = 'Указанная дата меньше чем 01.01.1900'
    }
    else if (Number(birthDateArr[0]) === year && parseInt(birthDateArr[1]) === month && birthDateArr[2] > day) {
      flag = false
      validateBirthDateText.classList.toggle('alert-feedback')
      validateBirthDateText.textContent = 'Указанная дата больше текущей'
    }
  }

  if (studentInfo.name.trim() == '') {
    document.getElementById('invalidFeedbackName').classList.toggle('alert-feedback')
    flag = false
  }
  if (studentInfo.surname.trim() == '') {
    document.getElementById('invalidFeedbackLastName').classList.toggle('alert-feedback')
    flag = false
  }
  if (studentInfo.middlename.trim() == '') {
    document.getElementById('invalidFeedbackMiddleName').classList.toggle('alert-feedback')
    flag = false
  }
  if (studentInfo.start.trim() == '') {
    document.getElementById('invalidFeedbackStartYear').classList.toggle('alert-feedback')
    flag = false
  }
  if (studentInfo.facility.trim() == '') {
    document.getElementById('invalidFeedbackFacility').classList.toggle('alert-feedback')
    flag = false
  }
  return flag
}


export function getActualStudentList() {
  let actualStudentList = []
  for (let cell of tableBody.children) {
    let standartBirth = cell.children[4].textContent.substring(0, 10).trim().split('.')
    let studentObj = {
      'name': cell.children[1].textContent,
      'surname': cell.children[2].textContent,
      'middlename': cell.children[3].textContent,
      'birth': `${standartBirth[2]}-${standartBirth[1]}-${standartBirth[0]}`,
      'start': cell.children[5].textContent.substring(0, 4),
      'facility': cell.children[6].textContent
    }
    actualStudentList.push(studentObj)
  }
  return actualStudentList
}

export function studentListSortFilter(item, actualList) {   // Сортировка
  const sortList = [{               // Массив с параметрами для сортировки
    'arrowName': 'name',
    'arrowSurName': 'surname',
    'arrowMiddleName': 'middlename',
    'arrowFacility': 'facility'
  }
  ]
  if (item.id == 'arrowBirthDate') {
    actualList.sort(function (a, b) {
      let aArr = a.birth.split('-')
      let bArr = b.birth.split('-')
      if (Number(aArr[0]) > Number(bArr[0])) {
        return 1
      }
      else if (Number(aArr[0]) === Number(bArr[0])) {
        if (Number(aArr[1]) > Number(bArr[1])) {
          return 1
        }
        else if (Number(aArr[1]) === Number(bArr[1])) {
          if (Number(aArr[2]) >= Number(bArr[2])) {
            return 1
          }
          else {
            return -1
          }
        }
      }
      else {
        return -1
      }
    })
  }
  else if (item.id == 'arrowStartYear') {
    actualList.sort(function (a, b) {
      if (Number(a.start) >= Number(b.start)) {
        return 1
      }
      else {
        return -1
      }
    })
  }
  else {
    let sortParam = sortList[0][item.id]
    actualList.sort(function (a, b) {
      if (a[sortParam].toLowerCase() >= b[sortParam].toLowerCase()) {
        return 1
      }
      else {
        return -1
      }
    })
  }
}



export function studentFilter(filter, studentsList) {   //Фильтр студентов
  let filteredStudentList = []
  let filterName = filter[0].value
  let filterSurName = filter[1].value
  let filterMiddleName = filter[2].value
  let filterStartYear = filter[3].value
  let filterEndYear = filter[4].value
  for (let student of studentsList) {
    if (filterStartYear !== '' || filterEndYear !== '') {
      if (filterStartYear !== '' && filterEndYear !== '') {
        if (student.name.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 && student.surname.toLowerCase().indexOf(filterSurName.toLowerCase()) >= 0
          && student.middlename.toLowerCase().indexOf(filterMiddleName.toLowerCase()) >= 0
          && Number(filterStartYear) === Number(student.start) && Number(student.start) + 4 === Number(filterEndYear)) {
          filteredStudentList.push(student)
        }
      }
      else if (filterStartYear !== '') {
        if (student.name.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 && student.surname.toLowerCase().indexOf(filterSurName.toLowerCase()) >= 0
          && student.middlename.toLowerCase().indexOf(filterMiddleName.toLowerCase()) >= 0
          && Number(filterStartYear) === Number(student.start)) {
          filteredStudentList.push(student)
        }
      }
      else if (filterEndYear !== '') {
        if (student.name.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 && student.surname.toLowerCase().indexOf(filterSurName.toLowerCase()) >= 0
          && student.middlename.toLowerCase().indexOf(filterMiddleName.toLowerCase()) >= 0
          && Number(student.start) + 4 === Number(filterEndYear)) {
          filteredStudentList.push(student)
        }
      }
    }
    else if (student.name.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 && student.surname.toLowerCase().indexOf(filterSurName.toLowerCase()) >= 0 &&
      student.middlename.toLowerCase().indexOf(filterMiddleName.toLowerCase()) >= 0) {
      filteredStudentList.push(student)
    }
  }

  return filteredStudentList
}

export function checkEpmtyFilter(filter) {
  for (let item of filter) {
    if (item.value !== '') {
      return true
    }
  }
  return false
}

export function deleteDomStudents() {  // Удаляет все строки с данными студентов
  let deleteRow = document.querySelectorAll('tr.student__row')
  deleteRow.forEach(item => { item.remove() })
}

export function getStudentInfoInput() { // Получение значений из полей
  let firstName = document.getElementById('firstName').value
  let lastName = document.getElementById('lastName').value
  let middleName = document.getElementById('middleName').value
  let birthDate = document.getElementById('birthDate').value
  let startYear = document.getElementById('startYearSelect').value
  let facility = document.getElementById('facility').value
  let studentInfoArr = [{ 'name': firstName, 'surname': lastName, 'middlename': middleName, 'birth': birthDate, 'start': startYear, 'facility': facility }]
  return studentInfoArr
}


