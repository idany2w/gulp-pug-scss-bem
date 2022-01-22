console.log('app/assets/scripts/scripts.js');

window.cusomScrolToEl = function (el, offset){
    let top = window.scrollY + el.getBoundingClientRect().top
    
    window.scrollTo({
        top: top - offset,
        behavior: "smooth"
    })
}