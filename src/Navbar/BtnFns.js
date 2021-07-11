// import M from  'materialize-css/dist/js/materialize.min.js';
export function sidenavFn(){
    console.log("sidenav clicked")
    var elems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(elems);
}