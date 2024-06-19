export async function getStudents() {
  const response = await fetch('http://localhost:3000/api/students')
  const data = await response.json()
  return data
}

export async function createStudent(firstName, secondName, lastName, birthDate, startYear, faculity) {
  const response = await fetch('http://localhost:3000/api/students', {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({
      name: firstName,
      surname: secondName,
      middlename: lastName,
      birth: birthDate,
      start: startYear,
      facility: faculity
    })
  })
  const data = await response.json()
  return data
}

export async function deleteStudent(studentId) {
  const response = await fetch(`http://localhost:3000/api/students/${studentId}`, {
    method: 'DELETE',
    headers: { 'Content-type': 'application/json' },
  })
  const data = await response.json()
  return data
}
