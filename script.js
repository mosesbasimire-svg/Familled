const PASSWORD="DEO";
const WHATSAPP_LINK="https://chat.whatsapp.com/BA3yagA7oK6Ciaz51xmvoA";

const members=[
["Déo Vumilia Buuma","Père","26/12/1972","Père de la famille, gradué en sciences de l'éducation et enseignant dans une école secondaire."],
["Sirire Masirika Francine","Mère","01/03/1978","Mère de la famille, commerçante et cultivatrice."],
["Ameshinda Vumilia Alliance","Fils aîné — décédé","03/11/1996","Fils aîné de la famille. Il est décédé célibataire, après avoir atteint le niveau de Bac 2 en management. Que son âme repose en paix."],
["Salama Namwangasa Yvette","2e enfant — fille","14/07/2000","Infirmière, graduée de l'Institut Supérieur des Techniques Médicales de Bukavu. Elle est mariée à Justin Ushindi."],
["Buuma Vumilia Benjamin","3e fils","10/05/2002","Laborantin, licencié en laboratoire de l'Institut Supérieur des Techniques Médicales de Bukavu."],
["ATUKUZWE Vumilia Jonathan","4e fils","22/05/2005","Informaticien, licencié de l'Institut Supérieur Pédagogique de Bukavu."],
["Basimire Vumilia Moïse","5e fils","18/09/2007","Économiste, licencié de l'Université Officielle de Bukavu."],
["Barikiwa Vumilia Angélique","6e fille","20/03/2010","Commercialiste de l'Institut Kando."],
["Bwaashi Vumilia Gloire","7e fils","16/09/2012","Commercialiste de l'Institut Kando."],
["Chisiki Vumilia Bien-aimé","8e fils","16/10/2014","Histoire à compléter…"],
["Furaha Vumilia Noela","9e fille","26/12/2016","Histoire à compléter…"],
["Asifiwe Vumilia Victoire","10e enfant — fils, cadet","07/07/2018","Cadet de la famille."]
];

const DB_NAME="famille-deo-v3",DB_VERSION=1,STORE="photos";
let db;

const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));

function openDB(){
 return new Promise((resolve,reject)=>{
  const r=indexedDB.open(DB_NAME,DB_VERSION);
  r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(STORE))r.result.createObjectStore(STORE,{keyPath:"id",autoIncrement:true})};
  r.onsuccess=()=>{db=r.result;resolve(db)};
  r.onerror=()=>reject(r.error);
 });
}
function idbGetAll(){return new Promise((res,rej)=>{const r=db.transaction(STORE,"readonly").objectStore(STORE).getAll();r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
function idbPut(v){return new Promise((res,rej)=>{const r=db.transaction(STORE,"readwrite").objectStore(STORE).put(v);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
function idbDelete(id){return new Promise((res,rej)=>{const r=db.transaction(STORE,"readwrite").objectStore(STORE).delete(id);r.onsuccess=()=>res();r.onerror=()=>rej(r.error)})}
async function getPhoto(type,index){const all=await idbGetAll();return all.find(x=>x.type===type&&x.index===index)}
async function compressImage(file,maxSide,quality=.78){
 return new Promise((resolve,reject)=>{
  if(!file||!file.type.startsWith("image/"))return reject(new Error("Fichier image invalide"));
  const reader=new FileReader();
  reader.onerror=()=>reject(new Error("Lecture impossible"));
  reader.onload=()=>{
   const img=new Image();
   img.onload=()=>{
    let w=img.naturalWidth,h=img.naturalHeight,s=Math.min(1,maxSide/Math.max(w,h));
    w=Math.max(1,Math.round(w*s));h=Math.max(1,Math.round(h*s));
    const c=document.createElement("canvas");c.width=w;c.height=h;c.getContext("2d").drawImage(img,0,0,w,h);
    c.toBlob(b=>{if(!b)return reject(new Error("Compression impossible"));resolve(b)}, "image/jpeg",quality);
   };
   img.onerror=()=>reject(new Error("Image invalide"));img.src=reader.result;
  };
  reader.readAsDataURL(file);
 });
}
function blobURL(blob){return URL.createObjectURL(blob)}
async function login(){
 if($("password").value!==PASSWORD){$("error").style.display="block";return}
 $("login").style.display="none";$("site").style.display="block";$("logout").style.display="block";$("welcome").style.display="grid";
 await openDB();await render();
}
async function render(){
 const all=await idbGetAll();
 $("members").innerHTML=members.map((m,i)=>`<article class="member" id="member-${i}">
  <div class="profile-wrap" id="profile-wrap-${i}"><div class="member-photo">👤</div></div>
  <h3>${esc(m[0])}</h3><b>${esc(m[1])}</b> — ${esc(m[2])}<p>${esc(m[3])}</p>
  <div class="actions"><input id="file-${i}" type="file" accept="image/*" hidden>
  <button class="small" type="button" data-pick="${i}">📷 Ajouter / changer</button>
  <button class="small delete" type="button" data-delete="${i}">🗑️ Supprimer</button></div>
 </article>`).join("");
 for(let i=0;i<members.length;i++){
  const p=all.find(x=>x.type==="profile"&&x.index===i);
  const wrap=$("profile-wrap-"+i);
  if(p){const img=document.createElement("img");img.className="member-photo";img.alt="Photo de "+members[i][0];img.src=blobURL(p.blob);img.onclick=()=>openViewer(img.src,members[i][0]);wrap.replaceChildren(img)}
  $("file-"+i).onchange=e=>saveProfile(i,e.target.files[0]);
 }
 document.querySelectorAll("[data-pick]").forEach(b=>b.onclick=()=>$("file-"+b.dataset.pick).click());
 document.querySelectorAll("[data-delete]").forEach(b=>b.onclick=()=>deleteProfile(Number(b.dataset.delete)));
 await renderGallery();
 $("whatsapp").href=WHATSAPP_LINK;
}
async function saveProfile(i,file){
 if(!file)return;
 try{
  const blob=await compressImage(file,1000,.82);
  const old=await getPhoto("profile",i);if(old)await idbDelete(old.id);
  await idbPut({type:"profile",index:i,blob,name:file.name,updatedAt:Date.now()});
  await render();
 }catch(e){alert("Cette photo n'a pas pu être enregistrée. Essayez une autre image.");}
}
async function deleteProfile(i){const p=await getPhoto("profile",i);if(p){await idbDelete(p.id);await render()}}
async function renderGallery(){
 const all=(await idbGetAll()).filter(x=>x.type==="memory").sort((a,b)=>b.createdAt-a.createdAt);
 $("gallery").innerHTML="";
 for(const p of all){
  const f=document.createElement("figure"),img=document.createElement("img"),btn=document.createElement("button"),cap=document.createElement("figcaption");
  img.src=blobURL(p.blob);img.alt=p.caption||"Souvenir";img.onclick=()=>openViewer(img.src,p.caption||"Souvenir");
  btn.textContent="×";btn.title="Supprimer";btn.onclick=async()=>{await idbDelete(p.id);await renderGallery()};
  cap.textContent=p.caption||"Souvenir de famille";f.append(img,btn,cap);$("gallery").appendChild(f);
 }
}
async function addPhotos(){
 const files=[...$("photosInput").files];if(!files.length){alert("Choisissez au moins une photo.");return}
 $("galleryStatus").textContent="Préparation des photos…";
 try{
  for(const file of files){const blob=await compressImage(file,1800,.80);await idbPut({type:"memory",blob,caption:$("caption").value.trim(),name:file.name,createdAt:Date.now()})}
  $("photosInput").value="";$("caption").value="";await renderGallery();$("galleryStatus").textContent=`${files.length} photo(s) ajoutée(s).`;
 }catch(e){$("galleryStatus").textContent="Une photo n'a pas pu être enregistrée.";alert("Impossible d'enregistrer cette image sur cet appareil.")}
}
function openViewer(src,title){$("viewerImg").src=src;$("viewerTitle").textContent=title||"";$("viewer").style.display="flex"}
function closeViewer(){$("viewer").style.display="none";$("viewerImg").src=""}

$("enter").onclick=login;
$("password").onkeydown=e=>{if(e.key==="Enter")login()};
$("closeWelcome").onclick=()=>$("welcome").style.display="none";
$("logout").onclick=()=>location.reload();
$("addPhotos").onclick=addPhotos;
$("viewerClose").onclick=closeViewer;
$("viewer").onclick=e=>{if(e.target===$("viewer"))closeViewer()};
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeViewer()});
