document.addEventListener('DOMContentLoaded', () => {
    const btnCourse = document.querySelector('#cours');
    const btnAmis = document.querySelector('#amis');
    const course = document.querySelector('[data-id="cours"]');
    const amis = document.querySelector('[data-id="amis"]');
    const coursesList = Array.from(document.querySelectorAll('[data-id="cours-item"]'));
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

    coursesList.forEach((course) => {
        course.addEventListener('click', () => {
            const filtre = coursesList.filter((item) => item !== course && item.classList.contains('active'));
            filtre.forEach((course) => course.classList.remove('active'));
            course.classList.toggle('active');
        });
    });
});