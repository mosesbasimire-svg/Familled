const SUPABASE_URL="";
const SUPABASE_ANON_KEY="";
const WHATSAPP_LINK="COLLEZ-ICI-LE-LIEN-DU-GROUPE";
const FAMILY_PASSWORD="DEO";

const members=[
["Déo Vumilia Buuma","Père","26/12/1972"],["Sirire Masirika Francine","Mère","01/03/1978"],["Ameshinda Vumilia Alliance","Fils aîné • décédé","03/11/1996"],["Salama Namwangasa Yvette","2e enfant • fille","14/07/2000"],["Buuma Vumilia Benjamin","3e fils","10/05/2002"],["ATUKUZWE Vumilia Jonathan","4e fils","22/05/2005"],["Basimire Vumilia Moïse","5e fils","18/09/2007"],["Barikiwa Vumilia Angélique","6e fille","20/03/2010"],["Bwaashi Vumilia Gloire","7e fils","16/09/2012"],["Chisiki Vumilia Bien-aimé","8e fils","16/10/2014"],["Furaha Vumilia Noela","9e fille","26/12/2016"],["Asifiwe Vumilia Victoire","10e enfant • fils, cadet","07/07/2018"]
];
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]));
const readJSON=(k,d=[])=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(d))}catch{return d}};
const writeJSON=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const readFile=file=>new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file)});

function showApp(){$("#login").style.display="none";$("#app").style.display="block";renderMembers();renderPosts();renderMemories()}

function renderMembers(){
 const photos=readJSON("family_profile_photos",{});
 $("#membersGrid").innerHTML=members.map((m,i)=>{
  const photo=photos[m[0]];
  return `<article class="member"><div class="avatar">${photo?`<img src="${photo}" alt="Photo de ${esc(m[0])}">`:`<span>👤</span>`}</div><h3>${esc(m[0])}</h3><div class="muted">${esc(m[1])}</div><div class="muted">${esc(m[2])}</div><div class="row"><button class="ghost profile-btn" data-index="${i}">📷 ${photo?"Changer":"Ajouter"}</button>${photo?`<button class="ghost delete-profile" data-index="${i}">🗑️</button>`:""}<input class="profile-file hidden" data-index="${i}" type="file" accept="image/*"></div></article>`
 }).join("");
 document.querySelectorAll(".profile-btn").forEach(b=>b.onclick=()=>document.querySelector(`.profile-file[data-index="${b.dataset.index}"]`).click());
 document.querySelectorAll(".profile-file").forEach(input=>input.onchange=async()=>{const f=input.files[0];if(!f)return;const i=Number(input.dataset.index);const photos=readJSON("family_profile_photos",{});photos[members[i][0]]=await readFile(f);writeJSON("family_profile_photos",photos);renderMembers()});
 document.querySelectorAll(".delete-profile").forEach(b=>b.onclick=()=>{const i=Number(b.dataset.index);const photos=readJSON("family_profile_photos",{});delete photos[members[i][0]];writeJSON("family_profile_photos",photos);renderMembers()});
}

function renderPosts(){
 const a=readJSON("family_demo_posts",[]);
 $("#posts").innerHTML=a.length?a.map((p,i)=>`<article class="post"><div class="post-head"><div class="mini">${esc((p.author||"M").slice(0,1).toUpperCase())}</div><div><h3>${esc(p.author||"Membre de la famille")}</h3><div class="muted">${esc(p.date||"")}</div></div></div>${p.text?`<p>${esc(p.text)}</p>`:""}${p.image?`<img src="${p.image}" alt="Souvenir">`:""}<div class="reactions">${["❤️","👍","😂","🙏","🎉"].map(r=>`<button class="reaction" onclick="reactDemo(${i},'${r}')">${r} ${p.reactions?.[r]||0}</button>`).join("")}</div>${(p.comments||[]).map(c=>`<div class="comment"><strong>${esc(c.author)}</strong> <span class="muted">${esc(c.date)}</span><div>${esc(c.text)}</div></div>`).join("")}<div class="comment-form"><input id="c${i}" placeholder="Écrire un commentaire..."><button class="ghost" onclick="commentDemo(${i})">Publier</button></div></article>`).join(""):`<div class="composer"><p class="muted">Aucune publication pour le moment. Soyez le premier à partager un souvenir ❤️</p></div>`;
}
function reactDemo(i,r){const a=readJSON("family_demo_posts",[]);if(!a[i])return;a[i].reactions=a[i].reactions||{};a[i].reactions[r]=(a[i].reactions[r]||0)+1;writeJSON("family_demo_posts",a);renderPosts()}
function commentDemo(i){const x=$("#c"+i);if(!x||!x.value.trim())return;const a=readJSON("family_demo_posts",[]);if(!a[i])return;a[i].comments=a[i].comments||[];a[i].comments.push({author:"Membre",text:x.value.trim(),date:new Date().toLocaleString("fr-FR")});writeJSON("family_demo_posts",a);renderPosts()}

function renderMemories(){
 const a=readJSON("family_memories",[]);
 $("#gallery").innerHTML=a.length?a.map((m,i)=>`<article class="member"><img src="${m.image}" alt="Souvenir" style="width:100%;height:220px;object-fit:cover;border-radius:16px"><p>${esc(m.caption||"")}</p><div class="muted">${esc(m.date||"")}</div><button class="ghost" onclick="deleteMemory(${i})">🗑️ Supprimer</button></article>`).join(""):`<div class="composer"><p class="muted">Aucun souvenir ajouté pour le moment.</p></div>`;
}
async function addMemory(){const input=$("#memoryImage");const f=input.files[0];if(!f)return alert("Choisissez une photo.");const a=readJSON("family_memories",[]);a.unshift({image:await readFile(f),caption:$("#memoryCaption").value.trim(),date:new Date().toLocaleString("fr-FR")});writeJSON("family_memories",a);input.value="";$("#memoryCaption").value="";renderMemories()}
function deleteMemory(i){const a=readJSON("family_memories",[]);a.splice(i,1);writeJSON("family_memories",a);renderMemories()}

$("#loginBtn").onclick=()=>$("#password").value===FAMILY_PASSWORD?showApp():$("#loginMsg").textContent="Mot de passe incorrect.";
$("#password").addEventListener("keydown",e=>{if(e.key==="Enter")$("#loginBtn").click()});
$("#logoutBtn").onclick=()=>location.reload();
$("#addMemoryBtn").onclick=addMemory;

document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>{["feed","members","memories"].forEach(id=>$("#"+id).classList.toggle("hidden",id!==b.dataset.go));window.scrollTo({top:0,behavior:"smooth"})});
$("#waBtn").onclick=()=>{if(WHATSAPP_LINK.startsWith("http"))location.href=WHATSAPP_LINK;else alert("Le lien WhatsApp sera configuré avec vous.")};
$("#publishBtn").onclick=async()=>{const text=$("#postText").value.trim(),f=$("#postImage").files[0];if(!text&&!f)return alert("Ajoutez un message ou une photo.");let image="";if(f)image=await readFile(f);const a=readJSON("family_demo_posts",[]);a.unshift({author:"Membre",text,image,date:new Date().toLocaleString("fr-FR"),reactions:{},comments:[]});writeJSON("family_demo_posts",a);$("#postText").value="";$("#postImage").value="";renderPosts()};
