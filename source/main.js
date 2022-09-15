import initTHREE from './view';

document.getElementById("id_btn_createSpace").addEventListener("click",btn_createSpace);
function btn_createSpace(){
    document.getElementById("id_btn_createSpace").disabled = 'false';
    initTHREE();
};