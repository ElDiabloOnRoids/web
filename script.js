/* =====================================================
   SCRIPT.JS — Portofolio Arka Arthand Syach
   Berisi: menu hamburger, carousel, popup detail (achievements,
   connections, suggestions, trophies, projects, skills), pager
   Achievements & Connections, dan scroll reveal.
   Data yang paling sering diedit ditandai komentar "EDIT ... DI SINI".
   ===================================================== */
// =====================================
// DATA — EDIT KONTEN DETAIL DI SINI
// =====================================
const detailData = {
  achievements:{tag:"01 — Achievements", title:"Rank 1, XII TJKT 1", body:"Meraih peringkat 1 di kelas XII TJKT 1, SMKS Binong Permai, berkat konsistensi belajar dan fokus pada bidang jaringan serta pengembangan web. Pencapaian ini melanjutkan tren peningkatan peringkat sejak semester-semester sebelumnya.", extra:"<p>Lihat riwayat lengkap dari Sekolah Dasar sampai kelas XII — lengkap dengan trofi emas, perak, dan perunggu — di bagian Achievements pada halaman utama.</p>"},
  connections:{tag:"02 — Connections", title:"Sekolah & Relasi", body:"Selama di SMKS Binong Permai, kelas XII TJKT 1 dibimbing oleh wali kelas dan guru produktif TJKT yang mendukung proses belajar di bidang jaringan dan teknologi. Relasi ini terbentuk sejak SD, berlanjut ke SMP, hingga sekarang di bangku SMK.", extra:"<p>Buka bagian Connections di halaman utama untuk melihat detail wali kelas, guru produktif, dan teman sekelas di tiap jenjang pendidikan.</p>"},
  suggestions:{tag:"03 — Suggestions", title:"Rencana Ke Depan", body:"Rencana jangka pendek adalah memperdalam networking dan web development lewat proyek nyata, sambil mengejar sertifikasi MikroTik sebagai bekal profesional.", extra:"<ul style=\"margin-top:18px; padding-left:20px; color:#333; line-height:1.8;\"><li>Mengikuti sertifikasi MikroTik (MTCNA)</li><li>Membangun lebih banyak proyek web dan jaringan</li><li>Mengasah kemampuan creative editing lewat konten YouTube</li></ul>"},
  trophies:{tag:"04 — Trophies", title:"Sertifikat & Milestone", body:"Kumpulan sertifikat, penghargaan, dan milestone akan terus ditambahkan di sini seiring bertambahnya prestasi selama masa sekolah.", extra:"<div class=\"trophy-grid\" style=\"margin-top:20px\">"+[1,2,3,4].map(function(n){return "<div class=\"ph light\" data-label=\"sertifikat-"+n+".jpg\"><img src=\"images/sertifikat-"+n+".jpg\" alt=\"Sertifikat "+n+"\" loading=\"lazy\" onload=\"this.parentElement.classList.add('has-img')\" onerror=\"this.remove()\"></div>";}).join("")+"</div>"},
  projects:{tag:"05 — Projects", title:"Proyek yang Dibangun", body:"Empat proyek utama merepresentasikan tiga bidang minat: jaringan, pengembangan web, dan hardware — dikerjakan sebagai latihan praktik nyata di luar materi sekolah.", extra:"<ul style=\"margin-top:18px; padding-left:20px; color:#333; line-height:1.8;\"><li>MikroTik Configuration — konfigurasi routing jaringan</li><li>Website Project — portfolio responsif HTML/CSS/JS</li><li>Arduino Ultrasonic Sensor — deteksi jarak berbasis Arduino</li><li>Creative Editing Project — video editing kreatif</li></ul>"},
  skills:{tag:"06 — Skills", title:"Kemampuan Utama", body:"Empat bidang kemampuan yang terus diasah: web development, networking, hardware, dan creative editing.", extra:"<p>Klik masing-masing baris di bagian Skills pada halaman utama untuk melihat tools yang dipakai di tiap bidang.</p>"}
};

// =====================================
// ACHIEVEMENTS — RB-STYLE PAGER (EDIT RIWAYAT RANK DI SINI)
// =====================================
const achHistory=[
  {rank:"1", period:"XII TJKT 1", school:"SMKS Binong Permai", tier:"gold"},
  {rank:"1", period:"XI · Semester 2", school:"SMKS Binong Permai", tier:"gold"},
  {rank:"1", period:"XI · Semester 1", school:"SMKS Binong Permai", tier:"gold"},
  {rank:"1", period:"X · Semester 2", school:"SMKS Binong Permai", tier:"gold"},
  {rank:"1", period:"X · Semester 1", school:"SMKS Binong Permai", tier:"gold"},
  {rank:"4", period:"Kelas 9", school:"SMP", tier:"bronze"},
  {rank:"5", period:"Kelas 8", school:"SMP", tier:"bronze"},
  {rank:"8", period:"Kelas 7", school:"SMP", tier:"bronze"},
  {rank:"2–3", period:"Kelas 6", school:"SD Bina Benih Bangsa", tier:"silver"},
  {rank:"2–3", period:"Kelas 5", school:"SD Bina Benih Bangsa", tier:"silver"},
  {rank:"2–3", period:"Kelas 4", school:"SD Bina Benih Bangsa", tier:"silver"},
  {rank:"2–3", period:"Kelas 3", school:"SD Bina Benih Bangsa", tier:"silver"},
  {rank:"2–3", period:"Kelas 2", school:"SD Bina Benih Bangsa", tier:"silver"},
  {rank:"2–3", period:"Kelas 1", school:"SD Bina Benih Bangsa", tier:"silver"}
];
const tierGrad={
  gold:{t1:"#fff6d8",t2:"#f0c04a",t3:"#8a5b12",d1:"#c9922c",d2:"#6b430c"},
  silver:{t1:"#ffffff",t2:"#c9c9c9",t3:"#6e6e6e",d1:"#a8a8a8",d2:"#555555"},
  bronze:{t1:"#ffdcb8",t2:"#c57a3d",t3:"#6b3a15",d1:"#a5622c",d2:"#5c320f"}
};
let achIndex=0;
const achBigNum=document.getElementById('achBigNum');
const achCaption=document.getElementById('achCaption');
const achTrophySvg=document.getElementById('achTrophySvg');
const achTrophyStage=document.getElementById('achTrophyStage');
const panelTitle=document.getElementById('panelTitle');
const panelRank=document.getElementById('panelRank');
const panelTotal=document.getElementById('panelTotal');
if(panelTotal) panelTotal.textContent=achHistory.length;

// JOURNEY TIMELINE — dots dirender otomatis dari achHistory, klik buat loncat ke periode itu
const journeyTrack=document.getElementById('journeyTrack');
function renderJourneyTrack(){
  if(!journeyTrack) return;
  journeyTrack.innerHTML=achHistory.map((d,i)=>
    `<button class="journey-dot${i===achIndex?' active':''}" data-i="${i}" style="--jt:${tierGrad[d.tier].t2}" aria-label="${d.period}, ${d.school}"><span class="journey-dot-tip">${d.period}</span></button>`
  ).join('');
  journeyTrack.querySelectorAll('.journey-dot').forEach(btn=>{
    btn.addEventListener('click',()=>{ achIndex=parseInt(btn.dataset.i,10); renderAch(); });
  });
}
function updateJourneyActive(){
  if(!journeyTrack) return;
  journeyTrack.querySelectorAll('.journey-dot').forEach((btn,i)=>btn.classList.toggle('active', i===achIndex));
}

function renderAch(){
  const d=achHistory[achIndex]; const g=tierGrad[d.tier];
  [achBigNum,achCaption,achTrophySvg,panelTitle,panelRank].forEach(el=>el.classList.add('rb-fade'));
  setTimeout(()=>{
    achBigNum.textContent=d.rank;
    achCaption.textContent=`${d.period} · ${d.school}`;
    panelTitle.innerHTML=`${d.period}<br>${d.school}`;
    panelRank.textContent=d.rank;
    Object.entries(g).forEach(([k,v])=>achTrophyStage.style.setProperty('--'+k,v));
    [achBigNum,achCaption,achTrophySvg,panelTitle,panelRank].forEach(el=>el.classList.remove('rb-fade'));
    updateJourneyActive();
  },160);
}
document.getElementById('achUp').addEventListener('click',()=>{ achIndex=(achIndex-1+achHistory.length)%achHistory.length; renderAch(); });
document.getElementById('achDown').addEventListener('click',()=>{ achIndex=(achIndex+1)%achHistory.length; renderAch(); });
renderJourneyTrack();
// =====================================
// PROJECTS — RICH DETAIL POPUP (EDIT KONTEN PROYEK DI SINI)
// =====================================
const projectDetail={
  mikrotik:{tag:"Networking — 2026", title:"MikroTik Configuration", img:"project-1.jpg",
    body:"Konfigurasi jaringan dan routing menggunakan router MikroTik untuk kebutuhan lab jaringan sekolah, mencakup pengaturan IP, firewall dasar, dan manajemen bandwidth antar client.",
    tags:["MikroTik","Routing","Bandwidth Management"]},
  website:{tag:"Web Development — 2026", title:"Website Project", img:"project-2.jpg",
    body:"Membangun website responsif dari nol menggunakan HTML, CSS, dan JavaScript murni — termasuk portfolio ini sendiri, lengkap dengan animasi scroll dan komponen interaktif.",
    tags:["HTML","CSS","JavaScript"]},
  arduino:{tag:"Hardware — 2026", title:"Arduino Ultrasonic Sensor", img:"project-3.jpg",
    body:"Proyek sensor jarak berbasis Arduino yang membaca jarak objek menggunakan sensor ultrasonik HC-SR04, lalu menampilkan hasilnya secara real-time.",
    tags:["Arduino","Sensor","C++"]},
  editing:{tag:"Creative — 2026", title:"Creative Editing Project", img:"project-4.jpg",
    body:"Proyek editing video kreatif menggunakan Premiere Pro, After Effects, dan Alight Motion — mulai dari cutting, color grading, sampai motion graphics sederhana.",
    tags:["Premiere Pro","After Effects","Alight Motion"]},
  // SLOT PROYEK BARU — GANTI tag, title, img (taruh file di images/project-5.jpg), body, dan tags
  project5:{tag:"Kategori — Tahun", title:"Judul Proyek Baru", img:"project-5.jpg",
    body:"Ganti dengan deskripsi lengkap proyek ini.",
    tags:["Tag1","Tag2"]},
  // SLOT PROYEK BARU — GANTI tag, title, img (taruh file di images/project-6.jpg), body, dan tags
  project6:{tag:"Kategori — Tahun", title:"Judul Proyek Baru", img:"project-6.jpg",
    body:"Ganti dengan deskripsi lengkap proyek ini.",
    tags:["Tag1","Tag2"]}
};
document.querySelectorAll('[data-project]').forEach(item=>{
  item.addEventListener('click',()=>{
    const d=projectDetail[item.dataset.project]; if(!d) return;
    const tagChips=d.tags.map(t=>`<span style="display:inline-block; border:1px solid #d8d6d0; border-radius:20px; padding:6px 14px; font-size:.78rem; margin:4px 8px 0 0;">${t}</span>`).join('');
    detailInner.innerHTML=`<div class="ph detail-banner" data-label="${d.img}"><img src="images/${d.img}" alt="${d.title}" loading="lazy" onload="this.parentElement.classList.add('has-img')" onerror="this.remove()"></div><div class="card-tag">${d.tag}</div><h3>${d.title}</h3><p>${d.body}</p><div>${tagChips}</div>`;
    detailView.classList.add('open'); detailClose.style.display='block'; document.body.style.overflow='hidden';
  });
});

document.getElementById('achMoreBtn').addEventListener('click',()=>{
  const d=achHistory[achIndex];
  detailInner.innerHTML=`<div class="card-tag">${d.period}</div><h3>Rank ${d.rank}</h3><p>${d.period}, ${d.school}.</p>`;
  detailView.classList.add('open'); detailClose.style.display='block'; document.body.style.overflow='hidden';
});

// =====================================
// CONNECTIONS PAGER — EDIT RELASI DI SINI
// =====================================
const connHistory=[
  {title:"SMKS Binong Permai", sub:"Kelas X – XII", rows:[
    {label:"Wali Kelas", val:"Kelas X: Pa Dwi Karyanto<br>Kelas XI–XII: Pa Sukardi"},
    {label:"Guru Produktif", val:"Pa Andre, Pa Panji, Pa Dwi, Pa Dede Imam"},
    {label:"Teman Sekelas", val:"Omar Benezka Athaya, Mufti Raharja Putra, Dian Wahyu Juvanda, Ghalih Sumadinata, Afif Al-Maturidi"}
  ]},
  {title:"SMP", sub:"Kelas 7 – 9", rows:[
    {label:"Wali Kelas", val:"Kelas 7: Bu Evi<br>Kelas 8: Bu Sumi<br>Kelas 9: Bu Indah"},
    {label:"Teman Sekelas", val:"Omar Benezka Athaya, Mufti Raharja Putra, Dian Wahyu Juvanda, Ghalih Sumadinata, Afif Al-Maturidi"}
  ]},
  {title:"Bina Benih Bangsa", sub:"Kelas 1 – 6 (SD)", rows:[
    {label:"Wali Kelas", val:"—"},
    {label:"Teman Sekelas", val:"Koresy, Jevier"}
  ]}
];
let connIndex=0;
const connTitleEl=document.getElementById('connTitle');
const connSubEl=document.getElementById('connSub');
const connDetailsEl=document.getElementById('connDetails');
const connCountEl=document.getElementById('connCount');
function renderConn(){
  const d=connHistory[connIndex];
  const hero=document.getElementById('connHero');
  hero.classList.add('conn-fade');
  setTimeout(()=>{
    connTitleEl.textContent=d.title; connSubEl.textContent=d.sub;
    connDetailsEl.innerHTML=d.rows.map(r=>`<div><dt>${r.label}</dt><dd>${r.val}</dd></div>`).join('');
    connCountEl.textContent=`${String(connIndex+1).padStart(2,'0')} / ${String(connHistory.length).padStart(2,'0')}`;
    hero.classList.remove('conn-fade');
  },150);
}
document.getElementById('connPrev').addEventListener('click',()=>{ connIndex=(connIndex-1+connHistory.length)%connHistory.length; renderConn(); });
document.getElementById('connNext').addEventListener('click',()=>{ connIndex=(connIndex+1)%connHistory.length; renderConn(); });
renderConn();

// =====================================
// HEADER SCROLL BEHAVIOR
// =====================================
const header=document.getElementById('siteHeader');
window.addEventListener('scroll',()=>{ header.classList.toggle('scrolled', window.scrollY>40); });

// =====================================
// HAMBURGER MENU / FULLSCREEN NAVIGATION
// =====================================
const overlay=document.getElementById('navOverlay');
const openBtn=document.getElementById('menuOpen');
const closeBtn=document.getElementById('menuClose');
function openMenu(){ overlay.classList.add('open'); openBtn.classList.add('active'); document.body.style.overflow='hidden'; }
function closeMenu(){ overlay.classList.remove('open'); openBtn.classList.remove('active'); document.body.style.overflow=''; }
openBtn.addEventListener('click',()=>{ overlay.classList.contains('open') ? closeMenu() : openMenu(); });
closeBtn.addEventListener('click',closeMenu);
overlay.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',closeMenu));

// =====================================
// ACTIVE NAV LINK WHILE SCROLLING
// =====================================
const navLinks=[...overlay.querySelectorAll('nav a')];
const trackedSections=navLinks.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
const navObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const id='#'+entry.target.id;
      navLinks.forEach(a=>a.classList.toggle('active', a.getAttribute('href')===id));
    }
  });
},{rootMargin:'-45% 0px -50% 0px'});
trackedSections.forEach(sec=>navObserver.observe(sec));

// =====================================
// SCROLL PROGRESS BAR
// =====================================
const scrollProgress=document.getElementById('scrollProgress');
function updateScrollProgress(){
  const scrollTop=window.scrollY;
  const docHeight=document.documentElement.scrollHeight-window.innerHeight;
  const pct=docHeight>0 ? (scrollTop/docHeight)*100 : 0;
  if(scrollProgress) scrollProgress.style.width=pct+'%';
}
window.addEventListener('scroll',updateScrollProgress,{passive:true});
updateScrollProgress();

// =====================================
// BACK TO TOP
// =====================================
const backToTop=document.getElementById('backToTop');
if(backToTop){
  window.addEventListener('scroll',()=>{ backToTop.classList.toggle('show', window.scrollY>500); },{passive:true});
  backToTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
}

// =====================================
// ANIMATED COUNTERS (About stats)
// =====================================
const statEls=document.querySelectorAll('.stat-animate');
function animateCount(el){
  const target=parseInt(el.dataset.count,10)||0;
  const duration=1100; const start=performance.now();
  function tick(now){
    const p=Math.min((now-start)/duration,1);
    const eased=1-Math.pow(1-p,3);
    el.textContent=Math.round(eased*target);
    if(p<1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const statObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){ animateCount(entry.target); statObserver.unobserve(entry.target); }
  });
},{threshold:0.6});
statEls.forEach(el=>statObserver.observe(el));

// =====================================
// HERO LOAD-IN (satu momen animasi pas halaman dibuka)
// =====================================
requestAnimationFrame(()=>{ document.getElementById('hero').classList.add('loaded'); });

// =====================================
// "ALIVE" EXTRAS — cursor glow, tilt 3D, cycling word
// Semua dimatikan otomatis kalau user pakai prefers-reduced-motion
// atau device-nya touch (gak ada mouse beneran)
// =====================================
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasFinePointer=window.matchMedia('(hover:hover) and (pointer:fine)').matches;

// --- cursor glow mengikuti mouse ---
const cursorGlow=document.getElementById('cursorGlow');
if(cursorGlow && hasFinePointer && !reduceMotion){
  window.addEventListener('mousemove',e=>{
    cursorGlow.style.transform=`translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%,-50%)`;
    cursorGlow.classList.add('show');
  },{passive:true});
  window.addEventListener('mouseleave',()=>cursorGlow.classList.remove('show'));
}

// --- tilt 3D di carousel card, project item, testimonial card ---
if(hasFinePointer && !reduceMotion){
  document.querySelectorAll('.tilt-card').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      const px=(e.clientX-r.left)/r.width; const py=(e.clientY-r.top)/r.height;
      const rx=(0.5-py)*10; const ry=(px-0.5)*10;
      card.style.transform=`perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
      card.style.transition='transform .08s linear';
    });
    card.addEventListener('mouseleave',()=>{
      card.style.transform=''; card.style.transition='';
    });
  });
}

// --- trophy 3D: ikut muter sesuai posisi kursor di area Achievements ---
const achTrophyStageEl=document.getElementById('achTrophyStage');
const achRbMain=document.querySelector('.ach-rb-main');
if(achTrophyStageEl && achRbMain && hasFinePointer && !reduceMotion){
  achRbMain.addEventListener('mousemove',e=>{
    const r=achRbMain.getBoundingClientRect();
    const px=(e.clientX-r.left)/r.width; const py=(e.clientY-r.top)/r.height;
    const ry=(px-0.5)*34; const rx=(0.5-py)*22;
    achTrophyStageEl.style.transform=`perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  achRbMain.addEventListener('mouseleave',()=>{
    achTrophyStageEl.style.transform='perspective(900px) rotateX(0deg) rotateY(0deg)';
  });
}

// --- cycling word di subtitle hero ---
const cycleEl=document.getElementById('cycleWord');
if(cycleEl){
  const cycleWords=['networking','pengembangan web','hardware komputer','creative editing'];
  let cycleIndex=0;
  if(!reduceMotion){
    setInterval(()=>{
      cycleEl.classList.add('swap');
      setTimeout(()=>{
        cycleIndex=(cycleIndex+1)%cycleWords.length;
        cycleEl.textContent=cycleWords[cycleIndex];
        cycleEl.classList.remove('swap');
      },250);
    },2600);
  }
}

// =====================================
// CAROUSEL
// =====================================
const carousel=document.getElementById('carousel');
document.getElementById('carPrev').addEventListener('click',()=>carousel.scrollBy({left:-360,behavior:'smooth'}));
document.getElementById('carNext').addEventListener('click',()=>carousel.scrollBy({left:360,behavior:'smooth'}));

// =====================================
// CARD DETAIL OVERLAY
// =====================================
const detailView=document.getElementById('detailView');
const detailInner=document.getElementById('detailInner');
const detailClose=document.getElementById('detailClose');
document.querySelectorAll('[data-detail]').forEach(card=>{
  card.addEventListener('click',()=>{
    const d=detailData[card.dataset.detail];
    detailInner.innerHTML=`<div class="ph detail-banner" data-label="${card.dataset.detail}.jpg"><img src="images/${card.dataset.detail}.jpg" alt="${d.title}" loading="lazy" onload="this.parentElement.classList.add('has-img')" onerror="this.remove()"></div><div class="card-tag">${d.tag}</div><h3>${d.title}</h3><p>${d.body}</p>${d.extra||''}`;
    detailView.classList.add('open'); detailClose.style.display='block'; document.body.style.overflow='hidden';
  });
});

// =====================================
// SKILLS — TOOL BADGE POPUP (EDIT TOOLS DI SINI)
// =====================================
const skillTools={
  web:{title:"Web Development", tools:[
    {abbr:"HT",color:"#e34c26",name:"HTML",img:"html.jpg",desc:"Bahasa dasar untuk menyusun struktur halaman — heading, paragraf, gambar, dan elemen konten lainnya."},
    {abbr:"CS",color:"#2965f1",name:"CSS",img:"css.jpg",desc:"Mengatur tampilan visual: warna, layout, spacing, dan responsivitas di berbagai ukuran layar."},
    {abbr:"JS",color:"#c9a227",name:"JavaScript",img:"javascript.jpg",desc:"Menambahkan interaktivitas — menu, animasi, dan logika di sisi browser."}
  ]},
  networking:{title:"Networking", tools:[
    {abbr:"MT",color:"#2b3a42",name:"MikroTik",img:"mikrotik.jpg",desc:"Konfigurasi router, routing, dan manajemen bandwidth untuk jaringan lokal maupun lab sekolah."},
    {abbr:"NW",color:"#1b4e8c",name:"Network Config",img:"network-config.jpg",desc:"Setup, pengkabelan, dan troubleshooting jaringan dari sisi hardware maupun software."}
  ]},
  hardware:{title:"Hardware", tools:[
    {abbr:"PC",color:"#4a4a4a",name:"PC Hardware",img:"pc-hardware.jpg",desc:"Perakitan komputer dari komponen dasar serta pemeliharaan rutin perangkat."},
    {abbr:"TS",color:"#6b6b6b",name:"Troubleshooting",img:"troubleshooting.jpg",desc:"Mendiagnosa dan memperbaiki masalah umum pada PC dan perangkat jaringan."}
  ]},
  creative:{title:"Creative Editing", tools:[
    {abbr:"Pr",color:"#26205c",name:"Premiere Pro",img:"premiere-pro.jpg",desc:"Software editing video utama — memotong, menyusun timeline, color grading, dan mixing audio untuk hasil akhir."},
    {abbr:"Ae",color:"#1c1830",name:"After Effects",img:"after-effects.jpg",desc:"Dipakai untuk motion graphics, visual effect, dan animasi teks yang memperkuat video."},
    {abbr:"AM",color:"#7c3aed",name:"Alight Motion",img:"alight-motion.jpg",desc:"Editor mobile untuk mengedit dan membuat animasi cepat langsung dari HP, cocok untuk konten singkat."}
  ]}
};
document.querySelectorAll('.skill-row').forEach(row=>{
  row.addEventListener('click',()=>{
    const d=skillTools[row.dataset.skill]; if(!d) return;
    const grid=d.tools.map(t=>`<div class="tool-card"><div class="ph tool-thumb" data-label="${t.img}"><img src="images/${t.img}" alt="${t.name}" loading="lazy" onload="this.parentElement.classList.add('has-img')" onerror="this.remove()"></div><div class="tool-card-body"><div class="tool-head"><div class="tool-icon" style="background:${t.color}">${t.abbr}</div><div class="tool-name">${t.name}</div></div><div class="tool-desc">${t.desc}</div></div></div>`).join('');
    detailInner.innerHTML=`<div class="card-tag">Skills — ${d.title}</div><h3>${d.title}</h3><p>Berikut tools utama yang dipakai untuk bidang ${d.title.toLowerCase()}, lengkap dengan fungsinya masing-masing.</p><div class="tool-grid">${grid}</div>`;
    detailView.classList.add('open'); detailClose.style.display='block'; document.body.style.overflow='hidden';
  });
});
detailClose.addEventListener('click',()=>{ detailView.classList.remove('open'); detailClose.style.display='none'; document.body.style.overflow=''; });

// =====================================
// SCROLL REVEAL
// =====================================
const io=new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
},{threshold:0.15});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
renderAch();
