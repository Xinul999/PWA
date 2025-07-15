
const storeEvent = new Map();
document.addEventListener('DOMContentLoaded', () => {
    const btnCourse = boutonCourse();
    const btnAmis = boutonAmis();
    const course = document.querySelector('[data-id="cours"]');
    const amis = document.querySelector('[data-id="amis"]');
    const coursesList = allCourses();
    const btnAdd = document.querySelector('[data-id="add"]');

    if(course.classList.contains('active') || amis.classList.contains('active')) {
        btnAdd.parentElement.classList.toggle('active');
    }
    btnCourse.addEventListener('click', (event) => {
        if(!(btnCourse.classList.contains('active') || course.classList.contains('active'))) {
            btnCourse.classList.toggle('active');
            btnAmis.classList.remove('active');
            course.classList.toggle('active');
            amis.classList.remove('active');
        }

    });

    btnAmis.addEventListener('click', (event) => {
        if(!(btnAmis.classList.contains('active') || amis.classList.contains('active'))) {
            btnAmis.classList.toggle('active');
            btnCourse.classList.remove('active');
            amis.classList.toggle('active');
            course.classList.remove('active');
        }
    });

    initListener(coursesList);

    btnAdd.addEventListener('click', () => {
        if(btnCourse.classList.contains('active')) {
            const lastCourse = [...document.querySelectorAll('[data-id="cours-item"]')].at(-1);
            const newCourse = createEditableLesson();
            lastCourse.insertAdjacentElement('afterend', newCourse);
        }else if(btnAmis.classList.contains('active')) {

        }else{
            alert('Veuillez d\'abord selectionner un cours ou un ami.');
        }
    })
});


const createEditableLesson = () => {
    const lesson = document.createElement('div');
    lesson.classList.add('cours-item');
    lesson.dataset.id = 'cours-item';

    lesson.innerHTML = `
    <div>
        <h2 contenteditable="true" class="editable-title" placeholder="Nom du cours...">Nouveau cours</h2>
        <p contenteditable="true" class="editable-description" placeholder="Description...">Cliquez pour ajouter une description</p>
        <div class="edit-actions">
            <button class="btn-save">Sauvegarder</button>
            <button class="btn-cancel">Annuler</button>
        </div>
    </div>`;

    lesson.querySelector('.btn-save').addEventListener('click', () => {
        save(lesson);
    });

    lesson.querySelector('.btn-cancel').addEventListener('click', () => {
        lesson.remove();
    });

    return lesson;
};

const boutonCourse = () =>  document.querySelector('#cours');

const boutonAmis = () => document.querySelector('#amis');

const allCourses = () => Array.from(document.querySelectorAll('[data-id="cours-item"]'));

const initListener = (coursesList) => {
    coursesList.forEach((course) => {

        const clickEvent = () => {
            const filtre = coursesList.filter((item) => item !== course && item.classList.contains('active'));
            filtre.forEach((course) => course.classList.remove('active'));
            course.classList.toggle('active');
        }
        storeEvent.set(course, clickEvent);
        course.addEventListener('click', clickEvent);
    });
}
const removeListener = () => {
    storeEvent.forEach((clickEvent, course) => {
        course.removeEventListener('click', clickEvent);
    });
    storeEvent.clear();
}
const save = (course) => {
    let h2 = course.querySelector('.editable-title').textContent.trim();
    let p = course.querySelector('.editable-description').textContent.trim();
    h2 = h2.length > 0? h2 : 'Nouveau cours';
    p = p.length > 0? p : 'Description';
    course.innerHTML = `<div>
                            <h2>${h2}</h2>
                            <p>${p}</p>
                            <div class="top-right">
                                <button class="btn-delete"></button>
                            </div>
                        </div>`;
   removeListener();
   initListener(allCourses());
};