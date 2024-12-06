console.log('students.js is executing...');

// TODO: add your code here

const id_form_create_new_student = document.getElementById('id_form_create_new_student');
id_form_create_new_student.addEventListener('submit', handleCreateNewStudentEvent);

const div_create_new_student = document.getElementById('create_new_student');
const div_show_student_details = document.getElementById('show_student_details');
const div_update_student_details = document.getElementById('update_student_details');
const div_delete_student = document.getElementById('delete_student');
const div_list_of_students = document.getElementById("list_of_students");