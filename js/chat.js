function updateChatHeader(courseElement) {
    const courseName = courseElement.querySelector('h2')?.textContent.trim() || 'Cours inconnu';
    const chatHeader = document.getElementById('chat-header');
    if (chatHeader) chatHeader.textContent = courseName;

    // Enregistre le nom du cours actif pour plus tard
    localStorage.setItem('currentCourse', courseName);
    loadMessages(courseName);
}

/*chargement du chat*/
function loadMessages(courseName) {
    const container = document.getElementById('messages');
    container.innerHTML = ''; // Vide l'affichage

    const stored = localStorage.getItem(`chat-${courseName}`);
    const messages = stored ? JSON.parse(stored) : [];

    messages.forEach(msg => {
        const div = document.createElement('div');
        div.className = msg.side === 'right' ? 'message sent' : 'message';
        div.textContent = msg.text;
        container.appendChild(div);
    });
}
/*envoi du message*/
function sendMessage() {
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
