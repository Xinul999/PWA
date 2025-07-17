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
            chatHistory: []
        };
        StorageData.saveToStorage(UserProfile.USER_KEY.USER, userProfile);
    },
    getCourses: () => {
        return StorageData.loadFromStorage(UserProfile.USER_KEY.USER).courses;
    },
    getFriends: () => {
        return StorageData.loadFromStorage(UserProfile.USER_KEY.USER).friends;
    },
    getChatHistory() {
        return StorageData.loadFromStorage(UserProfile.USER_KEY.USER).chatHistory;
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
        StorageData.saveToStorage(UserProfile.USER_KEY.USER, userProfile);
    },
    addFriend: (id, username, date) => {
        const friends = [...UserProfile.getFriends()];
        friends.push({
            id: id,
            username: username,
            date: date
        });
        const userProfile = StorageData.loadFromStorage(UserProfile.USER_KEY.USER);
        userProfile.friends = friends;
        StorageData.saveToStorage(UserProfile.USER_KEY.USER, userProfile);
    },
    removeFriend: (id) => {
        const friends = [...UserProfile.getFriends()];
        const index = friends.findIndex((friend) => friend.id === id);
        if(index > -1) {
            friends.splice(index, 1);
        }
        const userProfile = StorageData.loadFromStorage(UserProfile.USER_KEY.USER);
        userProfile.friends = friends;
        StorageData.saveToStorage(UserProfile.USER_KEY.USER, userProfile);
    },
    addChatHistory: (idChat,idCourse, message, date) => {
        const chatHistory = [...UserProfile.getChatHistory()];
        chatHistory.push({
            id: idChat,
            idCourse: idCourse,
            message: message,
            date: date
        });
        const userProfile = StorageData.loadFromStorage(UserProfile.USER_KEY.USER);
        userProfile.chatHistory = chatHistory;
        StorageData.saveToStorage(UserProfile.USER_KEY.USER, userProfile);
    },
    removeChatHistory: (id) => {
        const chatHistory = [...UserProfile.getChatHistory()];
        const index = chatHistory.findIndex((chat) => chat.id === id);
        if(index > -1) {
            chatHistory.splice(index, 1);
        }
        const userProfile = StorageData.loadFromStorage(UserProfile.USER_KEY.USER);
        userProfile.chatHistory = chatHistory;
        StorageData.saveToStorage(UserProfile.USER_KEY.USER, userProfile);
    }

};

const storeEvent = new Map();
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

const initializeApp = () => {
    listener(boutonCourse(), boutonAmis(), boutonAdd());
    searchData();
    let user = UserProfile.getUserProfile();
    if(user === undefined) {
        const id = gernerarId()
        UserProfile.createUserProfile(id);
    }else{
        displayCourses();
        displayFriends();
    }

};
const createEditableLesson = () => {
    const lesson = document.createElement('div');
    lesson.classList.add('cours-item');
    lesson.dataset.id = 'cours-item';

    lesson.innerHTML = `
    <div>
        <h2 contenteditable="true" class="editable-title" >Nouveau cours</h2>
        <p contenteditable="true" class="editable-description" >Cliquez pour ajouter une description</p>
        <div class="edit-actions">
            <button class="btn-save">Sauvegarder</button>
            <button class="btn-cancel">Annuler</button>
        </div>
    </div>`;

    lesson.querySelector('.btn-save').addEventListener('click', () => {
        saveCourse(lesson);
    });

    lesson.querySelector('.btn-cancel').addEventListener('click', () => {
        lesson.remove();
    });
    return lesson;
};

const createEditableFriend = () => {
    const friend = document.createElement('div');
    friend.classList.add('amis-item');
    friend.dataset.id = 'amis-item';

    friend.innerHTML = `
    <div>
        <h2 contenteditable="true" class="editable-friend">Nouvel amis</h2>
        <div class="edit-actions">
            <button class="btn-save">Sauvegarder</button>
            <button class="btn-cancel">Annuler</button>
        </div>
    </div>`;

    friend.querySelector('.btn-save').addEventListener('click', () => {
        saveFriend(friend);
    });

    friend.querySelector('.btn-cancel').addEventListener('click', () => {
        friend.remove();
    });

    return friend;
};


const searchData = () => {
    const searchInput = document.querySelector('#search-bar');


    searchInput.addEventListener('input', (event) => {
        const searchValue = searchInput.value.toLowerCase();

        if(searchValue === ""){
            allCourses().forEach((course) => course.style.display = '');
            return;
        }
        const pattern = new RegExp(searchValue, 'gi');
        const coursesList = [...document.querySelectorAll('[data-id="cours-item"]')];
        coursesList.forEach((course) => {
            const title = course.querySelector('h2').textContent.toLowerCase();
            const description = course.querySelector('p').textContent.toLowerCase();
            if(pattern.test(title) || pattern.test(description)) {
                course.style.display = '';
            } else {
                course.style.display = 'none';
            }
        });
    })
};

const boutonCourse = () =>  document.querySelector('#cours');

const boutonAmis = () => document.querySelector('#amis');
const boutonAdd = () => document.querySelector('[data-id="add"]');
const allCourses = () => Array.from(document.querySelectorAll('[data-id="cours-item"]'));
const allFriends = () => Array.from(document.querySelectorAll('[data-id="amis-item"]'));
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
    storeEvent.forEach((clickEvent, item) => {
        item.removeEventListener('click', clickEvent);
    });
    storeEvent.clear();
}
const saveCourse = (course) => {
    let h2 = course.querySelector('.editable-title').textContent.trim();
    let p = course.querySelector('.editable-description').textContent.trim();
    const date = new Date().toISOString().split('T')[0];
    h2 = h2.length > 0? h2 : 'Nouveau cours';
    p = p.length > 0? p : 'Description';
    let id = gernerarId();
    course.innerHTML = `
                        <div>
                          <h2>${h2}</h2>
                          <p><small>(${date}): </small>${p}</p>
                          <div class="top-right">
                              <button class="btn-delete"></button>
                          </div>
                        </div>`;
    
    // Ajouter le listener pour le bouton delete
    course.querySelector('.btn-delete').addEventListener('click', () => {
        UserProfile.removeCourse(id);
        updateChatHeader(undefined);

        if(storeEvent.has(course)){
            const evt = storeEvent.get(course);
            course.removeEventListener('click', evt);
            storeEvent.delete(course);
        }
        
        course.remove();
    });

    // Créer et ajouter le listener combiné pour le click
    const combinedClickHandler = () => {
        const allCourseElements = allCourses();
        const filtre = allCourseElements.filter((item) => item !== course && item.classList.contains('active'));
        filtre.forEach((courseItem) => courseItem.classList.remove('active'));
        course.classList.toggle('active');
        
        // Mettre à jour le chat header
        updateChatHeader(course);
    };

    // Stocker et ajouter le listener
    storeEvent.set(course, combinedClickHandler);
    course.addEventListener('click', combinedClickHandler);

    UserProfile.addCourse(id, h2, p, date);
};

const saveFriend = (friend) => {
    let h2 = friend.querySelector('.editable-friend').textContent.trim();
    const date = new Date().toISOString().split('T')[0];
    h2 = h2.length > 0? h2 : 'Nouvel ami';
    let id = gernerarId();
    friend.innerHTML = `
                        <div id="${id}">
                          <h2>${h2}</h2>
                          <p><small>${date}</small></p>
                          <div class="top-right">
                              <button class="btn-delete"></button>
                          </div>
                        </div>`;
    removeListener();
    initListener(allFriends());
    initListener(allCourses());
   UserProfile.addFriend(id, h2, date);
}
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
            const lastFriend = allFriends();
            const newFriend = createEditableFriend();
            if(lastFriend.length > 0) {
                lastFriend.at(-1).insertAdjacentElement('afterend', newFriend);
            }else{
                const parentNode = document.querySelector('[data-id="amis"]');
                parentNode.appendChild(newFriend);
            }
        }else{
            alert('Veuillez d\'abord selectionner un cours ou un ami.');
        }
    })
}

const displayCourses = () => {
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
            updateChatHeader(undefined);

            if(storeEvent.has(courseElement)){
                const evt = storeEvent.get(courseElement);
                courseElement.removeEventListener('click', evt);
                storeEvent.delete(courseElement);
            }
            
            courseElement.remove();
        });

        const combinedClickHandler = () => {
            const allCourseElements = allCourses();
            const filtre = allCourseElements.filter((item) => item !== courseElement && item.classList.contains('active'));
            filtre.forEach((course) => course.classList.remove('active'));
            courseElement.classList.toggle('active');
            
            // Mettre à jour le chat header
            updateChatHeader(courseElement);
        };

        // Stocker et ajouter le listener
        storeEvent.set(courseElement, combinedClickHandler);
        courseElement.addEventListener('click', combinedClickHandler);

        document.querySelector('[data-id="cours"]').appendChild(courseElement);
    });
}

const displayFriends = () => {
    UserProfile.getFriends().forEach((friend) => {
        const friendElement = document.createElement('div');
        friendElement.classList.add('amis-item');
        friendElement.dataset.id = 'amis-item';
        friendElement.innerHTML = `
            <div>
                <h2>${friend.username}</h2>
                <p>${friend.date}</p>
            </div>
            <div class="top-right">
                <button class="btn-delete"></button>
            </div>
            `;

        friendElement.querySelector('.btn-delete').addEventListener('click', () => {
            UserProfile.removeFriend(friend.id);
            friendElement.remove();
        });

        document.querySelector('[data-id="amis"]').appendChild(friendElement);
    });
}

/*Intégration code de chat*/
const updateChatHeader = (course) => {
    const courseName = document.getElementById('chat-header');
    if(course === undefined){
        courseName.textContent = 'Cours inconnu';
        return;
    }
    if(document.querySelector('[data-id="cours"]').classList.contains('active')){
        const title = course.querySelector('h2').textContent;
        courseName.textContent = (title) ? title : 'Cours inconnu';
        loadMessages(courseName);
    }


}

/*chargement du chat*/
const loadMessages = (courseName) => {

    const container = document.getElementById('messages');
    container.innerHTML = ''; // Vide l'affichage

    const stored = courseName.id;
    const messages = UserProfile.getChatHistory().chatHistory.filter(chatHistory => chatHistory.id === stored);

    messages.forEach(msg => {
        const div = document.createElement('div');
        div.className = msg.side === 'right' ? 'message sent' : 'message';
        div.textContent = msg.text;
        container.appendChild(div);
    });
}

const sendMessage = () => {
    const input = document.getElementById("msgInput");
    const msg = input.value.trim();
    if (!msg) return;

    const courseName = localStorage.getItem('currentCourse');
    if (!courseName) return;

    // Affiche visuellement
    const div = document.createElement('div');
    div.className = 'message sent';
    div.textContent = msg;
    document.getElementById('messages').appendChild(div);

    // Stocke dans localStorage
    const stored = localStorage.getItem(`chat-${courseName}`);
    const messages = stored ? JSON.parse(stored) : [];
    messages.push({ text: msg, side: 'right' });
    localStorage.setItem(`chat-${courseName}`, JSON.stringify(messages));

    input.value = '';
}