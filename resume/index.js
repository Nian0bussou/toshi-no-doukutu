const collapsible1 = document.querySelector('.collapsible1')
const content1 = document.querySelector('.content1')
collapsible1.addEventListener('click', () => {
    content1.classList.toggle('open')
    console.log('toggle content1')
})

const collapsible2 = document.querySelector('.collapsible2')
const content2 = document.querySelector('.content2')
collapsible2.addEventListener('click', () => {
    content2.classList.toggle('open')
    console.log('toggle content2')
})
