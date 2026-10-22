// Front-end demo: Map represents ISBN lookup, Queue is FIFO, Stack is LIFO.
// Data is stored in localStorage so the demo persists in this browser without a backend.
const seedBooks = [
 {isbn:"9780061120084",title:"To Kill a Mockingbird",author:"Harper Lee",subject:"Fiction",copies:4,available:2},
 {isbn:"9780132350884",title:"Clean Code",author:"Robert C. Martin",subject:"Programming",copies:3,available:1},
 {isbn:"9780743273565",title:"The Great Gatsby",author:"F. Scott Fitzgerald",subject:"Classic Literature",copies:2,available:2},
 {isbn:"9780596007126",title:"Head First Design Patterns",author:"Eric Freeman",subject:"Programming",copies:2,available:0},
 {isbn:"9780140449136",title:"The Odyssey",author:"Homer",subject:"Classics",copies:3,available:1},
 {isbn:"9780451524935",title:"1984",author:"George Orwell",subject:"Fiction",copies:4,available:3}
];
const starterQueue = [
 {id:1,student:"Aarav Menon",isbn:"9780596007126",book:"Head First Design Patterns",requested:"Today"},
 {id:2,student:"Maya Thomas",isbn:"9780132350884",book:"Clean Code",requested:"Today"}
];
let books = JSON.parse(localStorage.getItem("libra_books") || "null") || seedBooks;
let queue = JSON.parse(localStorage.getItem("libra_queue") || "null") || starterQueue;
let returns = JSON.parse(localStorage.getItem("libra_returns") || "null") || [
 {isbn:"9780140449136",title:"The Odyssey",student:"Nikhil Raj",date:"Yesterday"},
 {isbn:"9780061120084",title:"To Kill a Mockingbird",student:"Ananya S.",date:"Yesterday"}
];
let nextQueueId = Math.max(0,...queue.map(q=>q.id))+1;
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function save(){localStorage.setItem("libra_books",JSON.stringify(books));localStorage.setItem("libra_queue",JSON.stringify(queue));localStorage.setItem("libra_returns",JSON.stringify(returns));}
function initials(s){return s.split(/\s+/).map(x=>x[0]).join("").slice(0,2).toUpperCase()}
function bookByIsbn(isbn){return books.find(b=>b.isbn===isbn)}
function status(b){return b.available>0?`<span class="pill green-pill">${b.available} available</span>`:`<span class="pill orange-pill">All issued</span>`}
function bookCell(b){return `<div class="book-cell"><div class="book-cover">${esc(b.title.slice(0,1))}</div><div><div class="book-title">${esc(b.title)}</div><div class="book-author">${esc(b.author)}</div></div></div>`}
function empty(msg){return `<div class="empty"><b>⌁</b>${msg}</div>`}
function render(){
 save();
 $("totalBooks").textContent=books.length;
 $("availableBooks").textContent=books.reduce((n,b)=>n+b.available,0);
 $("waitingBooks").textContent=queue.length;
 $("returnedBooks").textContent=returns.length;
 $("navQueueCount").textContent=queue.length;
 $("queuePill").textContent=`${queue.length} waiting`;
 $("queueCountLabel").textContent=`${queue.length} requests`;
 renderDashboard($("dashboardSearch").value||"");
 renderCatalog($("catalogSearch").value||"");
 renderQueue();
 renderReturns();
 renderSubjects();
}
function renderDashboard(query=""){
 const filtered=books.filter(b=>(b.title+" "+b.author+" "+b.isbn+" "+b.subject).toLowerCase().includes(query.toLowerCase())).slice(0,5);
 $("dashboardTable").innerHTML=filtered.map(b=>`<tr><td>${bookCell(b)}</td><td>${esc(b.isbn)}</td><td>${esc(b.subject)}</td><td>${status(b)}</td><td><button class="mini-btn" data-action="issue" data-isbn="${esc(b.isbn)}">Issue</button></td></tr>`).join("")||`<tr><td colspan="5">${empty("No matching books found.")}</td></tr>`;
 $("queuePreview").innerHTML=queue.slice(0,3).map((q,i)=>`<div class="queue-person"><div class="person-icon">${initials(q.student)}</div><div><strong>${esc(q.student)}</strong><small>${esc(q.book)}</small></div><span class="position">#${i+1}</span></div>`).join("")||empty("No students waiting right now.");
 $("returnPreview").innerHTML=returns.slice(0,3).map(r=>`<div class="return-item"><div class="person-icon">↶</div><div><strong>${esc(r.title)}</strong><small>Returned by ${esc(r.student)}</small></div></div>`).join("")||empty("No returns yet.");
}
function renderCatalog(query=""){
 const filter=$("statusFilter").value;
 const list=books.filter(b=>(b.title+" "+b.author+" "+b.isbn+" "+b.subject).toLowerCase().includes(query.toLowerCase())&&(filter==="all"||(filter==="available"?b.available>0:b.available===0)));
 $("catalogTable").innerHTML=list.map(b=>`<tr><td>${bookCell(b)}</td><td>${esc(b.isbn)}</td><td>${esc(b.subject)}</td><td>${status(b)}</td><td><div class="row-actions">${b.available>0?`<button class="mini-btn" data-action="issue" data-isbn="${esc(b.isbn)}">Issue</button>`:`<button class="mini-btn" data-action="request" data-isbn="${esc(b.isbn)}">Join queue</button>`}<button class="mini-btn" data-action="return" data-isbn="${esc(b.isbn)}">Return</button><button class="mini-btn danger" data-action="delete" data-isbn="${esc(b.isbn)}">×</button></div></td></tr>`).join("")||`<tr><td colspan="5">${empty("No books match your search.")}</td></tr>`;
}
function renderQueue(){
 $("requestsList").innerHTML=queue.map((q,i)=>`<div class="request-row"><div class="request-number">${i+1}</div><div class="request-info"><strong>${esc(q.book)}</strong><p>${esc(q.student)} · Requested ${esc(q.requested)}</p></div><span class="pill orange-pill">Waiting</span><button class="mini-btn" data-action="fulfill" data-id="${q.id}">Issue book</button><button class="mini-btn danger" data-action="cancel" data-id="${q.id}">Remove</button></div>`).join("")||empty("The waiting list is clear. Great work!");
}
function renderReturns(){
 $("returnsList").innerHTML=returns.map(r=>`<div class="history-row"><div class="book-cover">${esc(r.title.slice(0,1))}</div><div class="history-info"><strong>${esc(r.title)}</strong><small>ISBN ${esc(r.isbn)} · Returned by ${esc(r.student)}</small></div><span class="history-date">${esc(r.date)}</span></div>`).join("")||empty("Returned books will appear here.");
}
function renderSubjects(){
 const subjects={};books.forEach(b=>subjects[b.subject]=(subjects[b.subject]||0)+1);
 $("subjectChips").innerHTML=Object.entries(subjects).sort((a,b)=>a[0].localeCompare(b[0])).map(([s,n])=>`<button class="chip" data-subject="${esc(s)}">${esc(s)} <span>${n}</span></button>`).join("")||empty("Add books to explore subjects.");
}
function toast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove("show"),2400)}
function openModal(){$("bookModal").classList.remove("hidden")}
function closeModal(){$("bookModal").classList.add("hidden");$("bookForm").reset()}
function navigate(view){
 document.querySelectorAll(".view").forEach(v=>v.classList.add("hidden"));
 $(view+"View").classList.remove("hidden");
 document.querySelectorAll(".nav-item").forEach(n=>n.classList.toggle("active",n.dataset.view===view));
 const titles={dashboard:["Good afternoon 👋","OVERVIEW"],catalog:["Book catalog","BOOK CATALOG"],requests:["Waiting list","BORROWING REQUESTS"],returns:["Recent returns","RETURN HISTORY"]};
 $("pageTitle").textContent=titles[view][0];$("crumb").textContent=titles[view][1];
}
function addRequest(b){
 if(queue.some(q=>q.isbn===b.isbn)){toast("This title is already in the waiting list.");return}
 queue.push({id:nextQueueId++,student:"Student "+String(nextQueueId-1),isbn:b.isbn,book:b.title,requested:"Just now"});
 toast("Added to the end of the waiting list.");render();
}
function issueBook(isbn){
 const b=bookByIsbn(isbn);if(!b)return;
 if(b.available>0){b.available--;toast(`Issued “${b.title}”.`);render();return}
 addRequest(b);
}
function returnBook(isbn){
 const b=bookByIsbn(isbn);if(!b)return;
 if(b.available>=b.copies){toast("All copies are already marked available.");return}
 b.available++;
 returns.unshift({isbn:b.isbn,title:b.title,student:"Demo Student",date:"Just now"});
 const waiting=queue.findIndex(q=>q.isbn===isbn);
 if(waiting>=0){const q=queue.splice(waiting,1)[0];if(b.available>0){b.available--;toast(`Returned copy routed to ${q.student} from the waiting list.`)}}
 else toast(`“${b.title}” marked as returned.`);
 render();
}
document.addEventListener("click",e=>{
 const nav=e.target.closest("[data-view]");if(nav){navigate(nav.dataset.view);return}
 const go=e.target.closest("[data-goto]");if(go){navigate(go.dataset.goto);return}
 const subj=e.target.closest("[data-subject]");if(subj){navigate("catalog");$("catalogSearch").value=subj.dataset.subject;renderCatalog(subj.dataset.subject);return}
 const a=e.target.closest("[data-action]");if(!a)return;
 const isbn=a.dataset.isbn;const b=bookByIsbn(isbn);
 switch(a.dataset.action){
 case "issue": issueBook(isbn);break;
 case "request": if(b)addRequest(b);break;
 case "return": returnBook(isbn);break;
 case "delete": if(confirm(`Remove "${b?.title}" from the catalog?`)){books=books.filter(x=>x.isbn!==isbn);queue=queue.filter(q=>q.isbn!==isbn);render();toast("Book removed.");}break;
 case "cancel": queue=queue.filter(q=>q.id!==Number(a.dataset.id));render();toast("Request removed.");break;
 case "fulfill": {const q=queue.find(x=>x.id===Number(a.dataset.id));const qb=q&&bookByIsbn(q.isbn);if(q&&qb&&qb.available>0){qb.available--;queue=queue.filter(x=>x.id!==q.id);toast(`Issued to ${q.student}.`);render()}else if(qb){toast("No copy available yet. Return a copy first.")}break}
 }
});
$("addTopBtn").addEventListener("click",openModal);$("addCatalogBtn").addEventListener("click",openModal);
$("closeModal").addEventListener("click",closeModal);$("cancelModal").addEventListener("click",closeModal);
$("bookModal").addEventListener("click",e=>{if(e.target===$("bookModal"))closeModal()});
$("bookForm").addEventListener("submit",e=>{
 e.preventDefault();const f=new FormData(e.target);const isbn=String(f.get("isbn")).trim();
 if(books.some(b=>b.isbn===isbn)){toast("That ISBN already exists. ISBN must be unique.");return}
 const copies=Number(f.get("copies"));
 books.push({isbn,title:String(f.get("title")).trim(),author:String(f.get("author")).trim(),subject:String(f.get("subject")).trim(),copies,available:copies});
 closeModal();render();toast("Book added to catalog.");
});
$("dashboardSearch").addEventListener("input",e=>renderDashboard(e.target.value));
$("catalogSearch").addEventListener("input",e=>renderCatalog(e.target.value));
$("statusFilter").addEventListener("change",()=>renderCatalog($("catalogSearch").value));
$("clearReturns").addEventListener("click",()=>{if(confirm("Clear all return history?")){returns=[];render();toast("Return history cleared.")}});
render();
