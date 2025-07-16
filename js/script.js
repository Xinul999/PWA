const storeEvent = new Map();

// ---------- Fonctions utilitaires ----------

const boutonCourse = () => document.querySelector('#cours');
const boutonAmis = () => document.querySelector('#amis');
const allCourses = () => Array.from(document.querySelectorAll('[data-id="cours-item"]'));

const generateCourseElement = (title, desc) => {
    const div = document.createElement('div');
    div.classList.add('cours-item');
    div.dataset.id = 'cours-item';
    div.innerHTML = `
        <div>
            <h2>${title}</h2>
            <p>${desc}</p>
        </div>
        <div class="top-right">
            <button class="btn-delete"></button>
        </div>
    `;
    return div;
};

const removeListener = () => {
    storeEvent.forEach((clickEvent, course) => {
        course.removeEventListener('click', clickEvent);
    });
    storeEvent.clear();
};

const initListener = (coursesList) => {
    coursesList.forEach((course) => {
        const clickEvent = () => {
            const filtre = coursesList.filter((item) => item !== course && item.classList.contains('active'));
            filtre.forEach((c) => c.classList.remove('active'));
            course.classList.toggle('active');
            updateChatHeader(course);
        };

        storeEvent.set(course, clickEvent);
        course.addEventListener('click', clickEvent);

        const deleteBtn = course.querySelector('.btn-delete');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const titleToDelete = course.querySelector('h2')?.textContent.trim();

                if (confirm("Voulez-vous vraiment supprimer ce cours ?")) {
                    course.remove();

                    const existingCourses = JSON.parse(localStorage.getItem('cours-list') || '[]');
                    const updatedCourses = existingCourses.filter(c => c.title !== titleToDelete);
                    localStorage.setItem('cours-list', JSON.stringify(updatedCourses));

                    removeListener();
                    initListener(allCourses());
                }
            });
        }
    });
};

const save = (course) => {
    let h2 = course.querySelector('.editable-title').textContent.trim();
    let p = course.querySelector('.editable-description').textContent.trim();
    h2 = h2.length > 0 ? h2 : 'Nouveau cours';
    p = p.length > 0 ? p : 'Description';

    course.innerHTML = `
        <div>
            <h2>${h2}</h2>
            <p>${p}</p>
        </div>
        <div class="top-right">
            <button class="btn-delete"></button>
        </div>
    `;

    const newCours = { title: h2, desc: p };
    const existingCourses = JSON.parse(localStorage.getItem('cours-list') || '[]');
    existingCourses.push(newCours);
    localStorage.setItem('cours-list', JSON.stringify(existingCourses));

    removeListener();
    initListener(allCourses());
};

const createEditableLesson = () => {
    const lesson = document.createElement('div');
    lesson.classList.add('cours-item');
    lesson.dataset.id = 'cours-item';

    lesson.innerHTML = `
        <div>
            <h2 contenteditable="true" class="editable-title">Nouveau cours</h2>
            <p contenteditable="true" class="editable-description">Cliquez pour ajouter une description</p>
            <div class="edit-actions">
                <button class="btn-save">Sauvegarder</button>
                <button class="btn-cancel">Annuler</button>
            </div>
        </div>
    `;

    lesson.querySelector('.btn-save').addEventListener('click', () => save(lesson));
    lesson.querySelector('.btn-cancel').addEventListener('click', () => lesson.remove());

    return lesson;
};

// ---------- Initialisation DOM ----------

document.addEventListener('DOMContentLoaded', () => {
    const btnCourse = boutonCourse();
    const btnAmis = boutonAmis();
    const course = document.querySelector('[data-id="cours"]');
    const amis = document.querySelector('[data-id="amis"]');
    const btnAdd = document.querySelector('[data-id="add"]');

    course.innerHTML = '';
    const savedCourses = JSON.parse(localStorage.getItem('cours-list') || '[]');
    savedCourses.forEach(courseData => {
        const div = generateCourseElement(courseData.title, courseData.desc);
        course.appendChild(div);
    });

    removeListener();
    initListener(allCourses());

    if (course.classList.contains('active') || amis.classList.contains('active')) {
        btnAdd.parentElement.classList.toggle('active');
    }

    btnCourse.addEventListener('click', () => {
        if (!(btnCourse.classList.contains('active') || course.classList.contains('active'))) {
            btnCourse.classList.toggle('active');
            btnAmis.classList.remove('active');
            course.classList.toggle('active');
            amis.classList.remove('active');
        }
    });

    btnAmis.addEventListener('click', () => {
        if (!(btnAmis.classList.contains('active') || amis.classList.contains('active'))) {
            btnAmis.classList.toggle('active');
            btnCourse.classList.remove('active');
            amis.classList.toggle('active');
            course.classList.remove('active');
        }
    });

    btnAdd.addEventListener('click', () => {
        if (btnCourse.classList.contains('active')) {
            const lastCourse = [...document.querySelectorAll('[data-id="cours-item"]')].at(-1);
            const newCourse = createEditableLesson();
            lastCourse.insertAdjacentElement('afterend', newCourse);
        } else if (btnAmis.classList.contains('active')) {
            // à implémenter si nécessaire
        } else {
            alert('Veuillez d\'abord sélectionner un cours ou un ami.');
        }
    });
});
