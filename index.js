let SaveTheCity =document.querySelector(".SaveTheCity");
window.addEventListener("click",(e)=>{
    let target = e.target;
    openingAModalWindow(target);
    choosingACityBadge(target);
    deleteBadge(target);
    saveButton(target);
    clearingTheInput();
    ElasticSearch();
});
// открытия  и закрытия модального окна
function openingAModalWindow(target){
    if(target.classList.contains("Contentb2img") || target.classList.contains("b2img")){
        let modal = document.querySelector(".closee");
        if(modal.classList.contains("modalContent")) modal.classList.remove("modalContent");  
        else if(!modal.classList.contains("modalContent")){
            modal.classList.add("modalContent");   
            ApiSity();
        }
    }
}
// запрос списка городов 
function ApiSity(){
    let xhr = new XMLHttpRequest();
    xhr.open("POST","https://studika.ru/api/areas");
    xhr.addEventListener("load",()=>{
        if( xhr.status == 200 ){
            let pleolider = document.querySelector(".preolider");
            pleolider.classList.remove("preolider");
            let json = JSON.parse(xhr.response);
            let sity = document.querySelector(".sity");
       
            for (let i = 1; i < json.length; i++){
               for (const citi of json[i].cities) {
                    let result =`
                         <div class="textContent">
                              <div class="area"> ${citi.name}</div> <br>
                              <div class = "citi">${json[i].name}</div>
                         </div>`;
                     sity.innerHTML+=result;
                    }     
             }
        }
});
xhr.send();
}

let a = [];
// добавить бейджик с городом
function choosingACityBadge(e){
   let sity = document.querySelector(".sity"); 
    if(sity){
       if (e.classList.contains("area") ) {
        console.log(e.textContent);
        let badgeСities =`
                <div class="selectedCity">
                  <div class="baijikcontent">
                      <div class="textVector">${e.textContent}</div> 
                      <div class="closeContent">
                         <img class="close" src="./img/close_24px.png" alt="" srcset="">
                      </div>
                   </div>
            </div>`;
        let SaveTheCity = document.querySelector(".SaveTheCity");
        SaveTheCity.innerHTML+=badgeСities;
        a.push(e.textContent);
    }
 }
}
//  удаление  бейджик
function deleteBadge(e){ if(e.classList.contains("close")){
    e.closest(".selectedCity").style.display = "none";
    //    удаления из массива элементы
    let close_text = e.parentElement.parentElement.querySelector(".textVector").textContent;
    for (let i = 0; i < a.length; i++) {
         if(a.length == 1) a.splice(-1,1);
         if(a[i] === close_text) a.splice(a[i],1);
     }
    } 
}
SaveTheCity.addEventListener("mouseout",()=>{ badgeFields ();});
//   удаление  линий Бордер
function badgeFields (){
    if(SaveTheCity.clientHeight >  0){  SaveTheCity.classList.add("SaveTheCity1");    }
    if(SaveTheCity.clientHeight == 0){  SaveTheCity.classList.remove("SaveTheCity1"); }
}

function saveButton(e){
    if(e.classList.contains("modalbtn")){  localStoregSetItm(a)  }
} 
// запомнить выбранный город
function localStoregSetItm(e){ localStorage.setItem("key", JSON.stringify(e));}

window.addEventListener("DOMContentLoaded",()=>  localStorageGetItm()  );
//   запрос и вывод данных из хранилища сайта 
function localStorageGetItm(){
    let b =  JSON.parse(localStorage.getItem("key"));
    if(b.length > 0){
        for (const key of b){
            a.push(key);
            let badgeСities =`
            <div class="selectedCity">
            <div class="baijikcontent">
                <div class="textVector">${key}</div> 
                <div class="closeContent">
                    <img class="close" src="./img/close_24px.png" alt="" srcset="">
                </div>
            </div>
        </div>`;
        let SaveTheCity = document.querySelector(".SaveTheCity");
        SaveTheCity.innerHTML+=badgeСities;
        }
    }
} 
// очистка и удаление поля поиска
function clearingTheInput(){
    let search = document.querySelector(".search");
    let searchImg = document.querySelector(".searchImgNone");
    search.addEventListener("input",()=>{
        if(!search.value == "")  searchImg.classList.add("searchImgBlock");
        if(search.value == "")   searchImg.classList.remove("searchImgBlock");
    });
    searchImg.addEventListener("click",()=>{  
        search.value = "";
        if(search.value == "") {
          searchImg.classList.remove("searchImgBlock");
          let area = document.querySelectorAll(".area");
          for (let i = 0; i < area.length; i++){  area[i].closest(".textContent").classList.remove("hiden")};
        }
    }); 
}
//  фильтрация списка городов
function ElasticSearch(){
     let search = document.querySelector(".search");
     search.oninput = function filtr(){
         let val = search.value.trim();
         let area = document.querySelectorAll(".area");
            if(!val == ""){
                for (let i = 0; i < area.length; i++) {
                     if(area[i].textContent.search(val)==-1){  area[i].closest(".textContent").classList.add("hiden")}
                     else{
                        area[i].closest(".textContent").classList.remove("hiden");  
                        let str = area[i].innerText;
                        area[i].innerHTML = innserMarck(str,area[i].innerText.search(val),val.length); 
                     }
                }
            }else{  for (let i = 0; i < area.length; i++){  area[i].closest(".textContent").classList.remove("hiden");  } }
     }
}
function innserMarck(str,pos,len){  return str.slice(0,pos)+ "<mark>"+str.slice(pos,pos+len)+"</mark>"+ str.slice(pos+len);  }