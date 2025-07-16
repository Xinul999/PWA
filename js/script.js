const StorageData = {
    loadFromStorage: (key) => {
        try {
            const dataStorage = localStorage.getItem(key);
            return dataStorage !== null ? JSON.parse(dataStorage) : undefined;
        } catch (error) {
            console.error('Erreur de cahrgement du localStorage:', error);
            return null;
        }
    },

    saveToStorage: (key, value) => {
        try {
            const dataString = JSON.stringify(value);
            localStorage.setItem(key, dataString);
        } catch (error) {
            console.error('Erreur sauvegarde du localStorage:', error);
        }
    },

    removeFromStorage: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Impossible de supprimer localStorage:', error);
        }
    }
};

const UserProfile = {
    USER_KEY: {
        USER: 'user_profile'
    },

    getUserProfile: () => {
        return StorageData.loadFromStorage(UserProfile.USER_KEY.USER);
    },

    createUserProfile: (id) => {
        const userProfile = {
            id:  id,
            username: 'Utilisateur',
            friends: [],
            courses: [],
        };
        StorageData.saveToStorage(UserProfile.USER_KEY.USER, userProfile);
    },
    getCourses: () => {
        return StorageData.loadFromStorage(UserProfile.USER_KEY.USER).courses;
    },
    getFriends: () => {
        return StorageData.loadFromStorage(UserProfile.USER_KEY.USER).friends;
    },
    addCourse: (id, titre, contenu, date) => {
        const courses = [...UserProfile.getCourses()];
        courses.push({
            id: id,
            titre: titre,
            contenu: contenu,
            date: date,
        });
        const userProfile = StorageData.loadFromStorage(UserProfile.USER_KEY.USER);
        userProfile.courses = courses;
        StorageData.saveToStorage(UserProfile.USER_KEY.USER, userProfile);
    },
    removeCourse: (id) => {
        const courses = [...UserProfile.getCourses()];
        const index = courses.findIndex((course) => course.id === id);
        if(index > -1) {
            courses.splice(index, 1);
        }
        const userProfile = StorageData.loadFromStorage(UserProfile.USER_KEY.USER);
        userProfile.courses = courses;
        StorageData.saveToStorage(UserProfile.USER_KEY, userProfile);
    },
    addFriend: (id, username, date) => {

    }

};

const storeEvent = new Map();
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();


});

const initializeApp = () => {
    listener(boutonCourse(), boutonAmis(), boutonAdd());
    let user = UserProfile.getUserProfile();
    if(user === undefined) {
        const id = gernerarId()
        UserProfile.createUserProfile(id);
    }else{
       UserProfile.getCourses().forEach((course) => {
            const courseElement = document.createElement('div');
            courseElement.classList.add('cours-item');
            courseElement.dataset.id = 'cours-item';
            courseElement.id = course.id;
            courseElement.innerHTML = `
            <div>
                <h2>${course.titre}</h2>
                <p>${course.date}: ${course.contenu}</p>
            </div>
            <div class="top-right">
                <button class="btn-delete"></button>
            </div>
            
            `;

            courseElement.querySelector('.btn-delete').addEventListener('click', () => {
                UserProfile.removeCourse(course.id);
                courseElement.remove();
            });

            document.querySelector('[data-id="cours"]').appendChild(courseElement);
        });
        initListener(allCourses());
    }

};
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
const boutonAdd = () => document.querySelector('[data-id="add"]');
const allCourses = () => Array.from(document.querySelectorAll('[data-id="cours-item"]'));
const allFriends = () => Array.from(document.querySelectorAll('[data-id="amis-item"]'));
const friend = () => document.querySelector('[data-id="amis"]');
const course = () => document.querySelector('[data-id="cours"]');
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
    const date = new Date().toISOString().split('T')[0];
    h2 = h2.length > 0? h2 : 'Nouveau cours';
    p = p.length > 0? p : 'Description';
    let id = gernerarId();
    course.innerHTML = `
                        <div id="${id}">
                          <h2>${h2}</h2>
                          <p><small>(${date}): </small>${p}</p>
                          <div class="top-right">
                              <button class="btn-delete"></button>
                          </div>
                        </div>`;
    removeListener();
    initListener(allCourses());
    initListener(allFriends());
   UserProfile.addCourse(id, h2, p, date);
};

const gernerarId = () => {
    return self.crypto.randomUUID();
}

const listener = (btnCourse, btnAmis, btnAdd) => {
    const menuCours = document.querySelector('[data-id="cours"]');
    const menuAmis = document.querySelector('[data-id="amis"]');
    btnCourse.addEventListener('click', (event) => {
        if(!btnCourse.classList.contains('active')) {
            btnCourse.classList.toggle('active');
            btnAmis.classList.remove('active');
            menuCours.classList.add('active');
            menuAmis.classList.remove('active');
        }

    });

    btnAmis.addEventListener('click', (event) => {
        if(!btnAmis.classList.contains('active')) {
            btnAmis.classList.toggle('active');
            btnCourse.classList.remove('active');
            menuAmis.classList.add('active');
            menuCours.classList.remove('active');
        }
    });


    btnAdd.addEventListener('click', () => {
        if(btnCourse.classList.contains('active')) {
            const lastCourse = allCourses();
            const newCourse = createEditableLesson();
            if(lastCourse.length > 0) {
                lastCourse.at(-1).insertAdjacentElement('afterend', newCourse);
            }else{
                const parentNode = document.querySelector('[data-id="cours"]');
                parentNode.appendChild(newCourse);
            }
        }else if(btnAmis.classList.contains('active')) {

        }else{
            alert('Veuillez d\'abord selectionner un cours ou un ami.');
        }
    })
}
