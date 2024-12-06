console.log('students.js is executing...');

// TODO: add your code here

const id_form_create_new_student = document.getElementById('id_form_create_new_student');
id_form_create_new_student.addEventListener('submit', handleCreateNewStudentEvent);

const div_create_new_student = document.getElementById('create_new_student');
const div_show_student_details = document.getElementById('show_student_details');
const div_update_student_details = document.getElementById('update_student_details');
const div_delete_student = document.getElementById('delete_student');
const div_list_of_students = document.getElementById("list_of_students");

document.addEventListener("DOMContentLoaded", async function () {
    await getAndDisplayAllStudents();
});



async function getAndDisplayAllStudents() {
    console.log(`getAndDisplayAllStudents - START`);
    const API_URL = "http://localhost:8080/students";

    div_list_of_students.innerHTML = "Calling the API to get the list of students...";

    try {
        const response = await fetch(API_URL);

        console.log({response});
        console.log(`response.status = ${response.status}`);
        console.log(`response.statusText = ${response.statusText}`);
        console.log(`response.ok = ${response.ok}`);
        if (response.ok) {
            div_list_of_students.innerHTML = "Retrieved Students, not just processing....";

            const listOfStudentsAsJSON = await response.json();
            console.log({listOfStudents: listOfStudentsAsJSON});

            displayStudents(listOfStudentsAsJSON);
        } else {
            div_list_of_students.innerHTML = `<p class ="failure">ERROR: failed to retrieve the students.</p>`;
        }
    } catch (error) {
        console.error(error);
        div_list_of_classes.innerHTML = '<p class="failure">ERROR: failed to connect to the API to fetch the students data.</p>';
    }
    console.log(`getAndDisplayAllStudents - END`);
}


async function createNewStudent(studentData) {
    const API_URL = 'http://localhost:8080/students';
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams(studentData)
        });
        console.log({response});
        console.log(`response.status = ${response.status}`);
        console.log(`response.statusText = ${response.statusText}`);
        console.log(`response.ok = ${response.ok}`);

        if (response.ok) {
            const createdStudent = await response.json();
            div_create_new_student.innerHTML = `<p class="success">Student with id ${createdStudent.id} created successfully. </p>`;
            await getAndDisplayAllStudents();
        } else {
            div_create_new_student.innerHTML = '<p class="failure">ERROR';
        }
    } catch (error) {
        console.error(error);
        div_create_new_student.innerHTML = `<p class="failure">ERROR: failed to connect to API to create new student.</p>`;
    }
}

async function getStudent(studentId) {
    console.log(`getStudent(${studentId}) - START`);
    console.log(`studentId = ${studentId}`);

    const API_URL = "http://localhost:8080/students/" + studentId;

    console.log(`Calling the API to get the student with id ${studentId}`);

    try {
        const response = await fetch(API_URL);

        console.log({response});
        console.log(`response.status = ${response.status}`);
        console.log(`response.statusText = ${response.statusText}`);
        console.log(`response.ok = ${response.ok}`);

        if (response.ok) {
            console.log("Retrieved the student successfully, now we just need to process it...");

            const studentAsJSON = await response.json();
            console.log({studentAsJSON});

            return studentAsJSON;
        } else {
            console.log(`ERROR: could not retrieve student with id ${studentId}`);
        }

    } catch (error) {
        console.error(error);
        console.log(`ERROR: couldn't connect to API to get student with id ${studentId}`);

    }
    console.log(`getStudent(${studentId}) - END`);
    return null;
}

async function updateStudent(studentData) {
    const API_URL = `http://localhost:8080/students/${studentData.id}`;

    try {
        const response = await fetch(API_URL, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams(studentData)
        });
        console.log({response});
        console.log(`response.status = ${response.status}`);
        console.log(`response.statusText = ${response.statusText}`);
        console.log(`response.ok = ${response.ok}`);

        if (response.ok) {
            div_update_student_details.innerHTML = `<p class ="success"> Student updated successfully.</p>`;
            await getAndDisplayAllStudents();
        } else {
            div_update_student_details.innerHTML = `<p class ="failure">ERROR: could not update student.</p>`;
        }
    } catch (error) {
        console.error(error);
        div_update_student_details.innerHTML = `<p class ="failure">ERROR: API call to update student with id ${studentData.id} failed.</p>`;
    }
}
