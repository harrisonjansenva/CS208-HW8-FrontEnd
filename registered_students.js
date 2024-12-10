console.log('registered_students.js is executing...');

addEventListener('DOMContentLoaded', getAllClassesAndRefreshTheSelectClassForEnrollmentDropdown);
document.addEventListener("DOMContentLoaded", async () => {
    await getAndDisplayAllRegisteredStudents();
});

async function getAllClassesAndRefreshTheSelectClassForEnrollmentDropdown() {
    console.log('getAllClassesAndRefreshTheSelectClassForEnrollmentDropdown - START');

    const API_URL = "http://localhost:8080/classes";

    try {
        const response = await fetch(API_URL);
        console.log({response});
        console.log(`response.status = ${response.status}`);
        console.log(`response.statusText = ${response.statusText}`);
        console.log(`response.ok = ${response.ok}`);

        if (response.ok) {
            const listOfClassesAsJSON = await response.json();
            console.log({listOfClassesAsJSON});

            refreshTheSelectClassForEnrollmentDropdown(listOfClassesAsJSON);
        } else {
            // TODO: update the HTML with information that we failed to retrieve the classes

        }
    } catch (error) {
        console.error(error);
        // TODO: update the HTML with information that we failed to connect to the API to fetch the classes data
    }

    console.log('getAllClassesAndRefreshTheSelectClassForEnrollmentDropdown - END');
}


function refreshTheSelectClassForEnrollmentDropdown(listOfClassesAsJSON) {
    const selectClassForEnrollment = document.getElementById("selectClassForEnrollment");

    // delete all existing options (i.e., children) of the selectClassForEnrollment
    while (selectClassForEnrollment.firstChild) {
        selectClassForEnrollment.removeChild(selectClassForEnrollment.firstChild);
    }

    const option = document.createElement("option");
    option.value = "";
    option.text = "Select a class";
    option.disabled = true;
    option.selected = true;
    selectClassForEnrollment.appendChild(option);

    for (const classAsJSON of listOfClassesAsJSON) {
        const option = document.createElement("option");
        option.value = classAsJSON.id;                              // this is the value that will be sent to the server
        option.text = classAsJSON.code + ": " + classAsJSON.title;  // this is the value the user chooses from the dropdown

        selectClassForEnrollment.appendChild(option);
    }
}

addEventListener('DOMContentLoaded', getAllStudentsAndRefreshTheSelectClassForEnrollmentDropdown);

async function getAllStudentsAndRefreshTheSelectClassForEnrollmentDropdown() {
    console.log(`getAllStudentsAndRefreshTheSelectClassForEnrollmentDropdown - START`);

    const API_URL = `http://localhost:8080/students`;
    const selectStudentForEnrollment = document.getElementById("selectStudentForEnrollment");
    try {
        const response = await fetch(API_URL);
        console.log({response});
        console.log(`response.status = ${response.status}`);
        console.log(`response.statusText = ${response.statusText}`);
        console.log(`response.ok = ${response.ok}`);

        if (response.ok) {
            const listOfStudentsAsJSON = await response.json();
            console.log({listOfStudentsAsJSON});

            refreshTheSelectStudentForEnrollmentDropdown(listOfStudentsAsJSON);
        } else {
            console.log("ERROR: couldn't load students from API.");
            while (selectStudentForEnrollment.firstChild) {
                selectStudentForEnrollment.removeChild(selectStudentForEnrollment.firstChild);
            }

            const option = document.createElement("option");
            option.value = "";
            option.text = "ERROR: Students could not be loaded.";
            option.disabled = true;
            option.selected = true;
            selectStudentForEnrollment.appendChild(option);
        }

    } catch (error) {
        console.error(error);
        while (selectStudentForEnrollment.firstChild) {
            selectStudentForEnrollment.removeChild(selectStudentForEnrollment.firstChild);
        }

        const option = document.createElement("option");
        option.value = "";
        option.text = "ERROR: Students could not be loaded.";
        option.disabled = true;
        option.selected = true;
        selectStudentForEnrollment.appendChild(option);
    }
    console.log(`getAllStudentsAndRefreshTheSelectClassForEnrollmentDropdown - END`);
}

function refreshTheSelectStudentForEnrollmentDropdown(listOfStudentsAsJSON) {
    const selectStudentForEnrollment = document.getElementById("selectStudentForEnrollment");

    while (selectStudentForEnrollment.firstChild) {
        selectStudentForEnrollment.removeChild(selectStudentForEnrollment.firstChild);
    }

    const option = document.createElement("option");
    option.value = "";
    option.text = "Select a student:";
    option.disabled = true;
    option.selected = true;
    selectStudentForEnrollment.appendChild(option);

    for (const studentAsJSON of listOfStudentsAsJSON) {
        const option = document.createElement("option");
        option.value = studentAsJSON.id;
        option.text = studentAsJSON.firstName + " " + studentAsJSON.lastName;

        selectStudentForEnrollment.appendChild(option);
    }
}
const id_form_register_student_to_class = document.getElementById(`id_form_add_new_student_to_a_class`) ;
id_form_register_student_to_class.addEventListener(`submit`, handleRegisterStudentEvent);


async function getAndDisplayAllRegisteredStudents() {
    console.log('getAndDisplayAllRegisteredStudents - START');
    const API_URL = `http://localhost:8080/registered_students`;
    const div_list_of_registered_students = document.getElementById("list_of_registered_students");

    div_list_of_registered_students.innerHTML = "Fetching registered students...";

    try {
        const response = await fetch(API_URL);
        console.log({response});
        if (response.ok) {
            const registeredStudents = await response.json();
            console.log({registeredStudents});

           await displayRegisteredStudents(registeredStudents);
        } else {
            div_list_of_registered_students.innerHTML = `<p class="failure">ERROR: Failed to fetch registered students.</p>`;
        }
    } catch (error) {
        console.error(error);
        div_list_of_registered_students.innerHTML = `<p class="failure">ERROR: Unable to connect to the API.</p>`;
    }

    console.log('getAndDisplayAllRegisteredStudents - END');
}



async function displayRegisteredStudents(registeredStudents) {
    const div_list_of_registered_students = document.getElementById("list_of_registered_students");
    div_list_of_registered_students.innerHTML = "Loading registered students...";

    try {
        div_list_of_registered_students.innerHTML = "";
        for (const student of registeredStudents) {
            div_list_of_registered_students.innerHTML += `
            <div class="registered-student">
                <p>Student: ${student.studentId} - ${student.studentFullName}</p>
                <p>Class: ${student.code} - ${student.title}</p>
                <br>
            </div>
        `;
        }
    } catch (error) {
        console.error("Error loading registered students:", error);
        div_list_of_registered_students.innerHTML = `<p class="failure">Failed to load registered students.</p>`;
    }
}
async function handleRegisterStudentEvent(event) {
    console.log('handleRegisterStudentEvent - START');
    event.preventDefault();

    const formData = new FormData(id_form_register_student_to_class);
    const studentClassData = {
        studentID: formData.get("studentId"),
        classID: formData.get("classId")
    };

    const API_URL = `http://localhost:8080/add_student_to_class`;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams(studentClassData)
        });
        console.log({response});
        if (response.ok) {
            const result = await response.json();
            console.log({result});

            document.getElementById("register_student_feedback").innerHTML = `<p class="success">Student successfully registered to the class.</p>`;
            await getAndDisplayAllRegisteredStudents();
        } else {
            document.getElementById("register_student_feedback").innerHTML = `<p class="failure">ERROR: Failed to register the student.</p>`;
        }
    } catch (error) {
        console.error(error);
        document.getElementById("register_student_feedback").innerHTML = `<p class="failure">ERROR: Unable to connect to the API.</p>`;
    }

    console.log('handleRegisterStudentEvent - END');
}
document.addEventListener(`DOMContentLoaded`, getAllRegisteredStudentsAndRefreshTheDropStudentDropdown)
async function getAllRegisteredStudentsAndRefreshTheDropStudentDropdown() {
    console.log(`getAllRegisteredStudentsAndRefreshTheDropStudentDropdown- START`);

    const API_URL = `http://localhost:8080/registered_students`;
    const selectStudentToDrop = document.getElementById("id_form_drop_student_from_class");
    try {
        const response = await fetch(API_URL);
        console.log({response});
        console.log(`response.status = ${response.status}`);
        console.log(`response.statusText = ${response.statusText}`);
        console.log(`response.ok = ${response.ok}`);

        if (response.ok) {
            const listOfRegisteredStudentsAsJSON = await response.json();
            console.log({listOfRegisteredStudentsAsJSON});

            refreshTheSelectStudentToDropDropdown(listOfRegisteredStudentsAsJSON);
        } else {
            console.log("ERROR: couldn't load students from API.");
            while (selectStudentToDrop.firstChild) {
                selectStudentToDrop.removeChild(selectStudentToDrop.firstChild);
            }

            const option = document.createElement("option");
            option.value = "";
            option.text = "ERROR: Students could not be loaded.";
            option.disabled = true;
            option.selected = true;
            selectStudentToDrop.appendChild(option);
        }

    } catch (error) {
        console.error(error);
        while (selectStudentToDrop.firstChild) {
            selectStudentToDrop.removeChild(selectStudentToDrop.firstChild);
        }

        const option = document.createElement("option");
        option.value = "";
        option.text = "ERROR: Students could not be loaded.";
        option.disabled = true;
        option.selected = true;
        selectStudentForEnrollment.appendChild(option);
    }
    console.log(`getAllRegisteredStudentsAndRefreshTheDropStudentDropdown - END`);
}
 function refreshTheSelectStudentToDropDropdown(listOfRegisteredStudentsAsJSON) {
         const selectStudentToDrop = document.getElementById("selectRegisteredStudentToDrop");

         // delete all existing options (i.e., children) of the selectClassForEnrollment
         while (selectStudentToDrop.firstChild) {
             selectStudentToDrop.removeChild(selectStudentToDrop.firstChild);
         }

         const option = document.createElement("option");
         option.value = "";
         option.text = "Select a student";
         option.disabled = true;
         option.selected = true;
         selectClassForEnrollment.appendChild(option);

         for (const studentAsJSON of listOfRegisteredStudentsAsJSON) {
             const option = document.createElement("option");
             option.value = `${studentAsJSON.studentId}:${studentAsJSON.classId}`;
             option.text = `${studentAsJSON.studentFullName} - ${studentAsJSON.code} ${studentAsJSON.title}`;

             selectStudentToDrop.appendChild(option);
         }
}
const id_form_drop_student_from_class = document.getElementById("id_form_drop_student_from_class");
id_form_drop_student_from_class.addEventListener(`submit`, handleDropStudentEvent);

async function handleDropStudentEvent(event) {
    console.log("handleDropStudentEvent - START");
    event.preventDefault();

    const formData = new FormData(id_form_drop_student_from_class);
    const selectedValue = formData.get("registeredStudentId");

    if (!selectedValue) {
        console.error("No student selected for dropping.");
        return;
    }

    // Split the combined value into studentID and classID
    const [studentID, classID] = selectedValue.split(":");

    const API_URL = `http://localhost:8080/drop_student_from_class?studentID=${studentID}&classID=${classID}`;
    console.log(`Student ID: ${studentID} Class ID: ${classID}`);
    try {
        const response = await fetch(API_URL, {
            method: "DELETE"
        });
        console.log({response});

        if (response.ok) {
            document.getElementById("drop_student_feedback").innerHTML = `<p class="success">Student successfully dropped from the class.</p>`;
            await getAllRegisteredStudentsAndRefreshTheDropStudentDropdown(); // Refresh the list
        } else {
            document.getElementById("drop_student_feedback").innerHTML = `<p class="failure">ERROR: Failed to drop the student from class.</p>`;
        }
    } catch (error) {
        console.error(error);
        document.getElementById("drop_student_feedback").innerHTML = `<p class="failure">ERROR: Unable to connect to the API.</p>`;
    }

    console.log("handleDropStudentEvent - END");
    // refreshTheSelectStudentToDropDropdown();
}


