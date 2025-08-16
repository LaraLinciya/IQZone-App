// ----- Utilities -----
const DEFAULT_DOMAINS = [
  "Java","SQL","Web Basics","Cybersecurity","Data Science",
  "General Knowledge","Logical Reasoning","Aptitude",
  "Cloud Basics","Operating Systems"
];

function getDB(){
  const raw = localStorage.getItem("quizData");
  return raw ? JSON.parse(raw) : {};
}
function setDB(db){
  localStorage.setItem("quizData", JSON.stringify(db));
}
function ensureDomains(){
  const db = getDB();
  DEFAULT_DOMAINS.forEach(d=>{ if(!db[d]) db[d] = []; });
  setDB(db); return db;
}
function showToast(el, msg){
  if(!el) return; el.textContent = msg; el.classList.add("pop");
  setTimeout(()=> el.classList.remove("pop"), 300);
}

// ----- STAFF PAGE LOGIC -----
(function initStaff(){
  const form = document.getElementById("questionForm");
  if(!form) return; // Not staff page

  // populate domain dropdown
  const domainSel = document.getElementById("domain");
  const msg = document.getElementById("msg");
  const seedBtn = document.getElementById("seedBtn");

  const db = ensureDomains();
  domainSel.innerHTML = Object.keys(db).map(d=>`<option value="${d}">${d}</option>`).join("");

  // Current domain chips
  const domainList = document.getElementById("domainList");
  domainList.innerHTML = Object.entries(db).map(([name,arr])=>`<span class="chip">${name} • ${arr.length}</span>`).join("");

  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const domain = domainSel.value;
    const question = document.getElementById("question").value.trim();
    const options = ["opt1","opt2","opt3","opt4"].map(id=> document.getElementById(id).value.trim());
    const answer = parseInt(document.getElementById("answer").value,10);

    if(!question || options.some(o=>!o) || !(answer>=1 && answer<=4)){
      showToast(msg, "⚠️ Please fill all fields correctly.");
      return;
    }

    const dbNow = getDB();
    dbNow[domain] = dbNow[domain] || [];
    dbNow[domain].push({ question, options, answer });
    setDB(dbNow);

    form.reset();
    showToast(msg, "✅ Question added successfully!");

    // refresh chips
    const dbAfter = getDB();
    domainList.innerHTML = Object.entries(dbAfter).map(([name,arr])=>`<span class="chip">${name} • ${arr.length}</span>`).join("");
  });

  seedBtn.addEventListener("click", ()=>{
    // ----- SEED SAMPLE DATA -----
    const seed = {
      "Java":[
        {question:"Which keyword is used to inherit a class in Java?", options:["extends","implements","super","inherit"], answer:1},
        {question:"Default value of boolean in Java?", options:["true","false","null","0"], answer:2},
        {question:"Which collection allows key–value pairs?", options:["ArrayList","HashMap","LinkedList","Stack"], answer:2},
        {question:"Which method is the entry point in Java?", options:["start()","run()","main()","init()"], answer:3}
      ],
      "SQL":[
        {question:"Which SQL keyword is used to filter rows?", options:["WHERE","ORDER BY","GROUP BY","HAVING"], answer:1},
        {question:"To remove all rows but keep table structure:", options:["DROP","DELETE","TRUNCATE","REMOVE"], answer:3},
        {question:"Primary key ensures:", options:["Duplicate values allowed","NULL values allowed","Unique + Not Null","Foreign relation"], answer:3},
        {question:"Which clause groups rows with the same values?", options:["ORDER BY","GROUP BY","LIMIT","DISTINCT"], answer:2}
      ],
      "Web Basics":[
        {question:"Which HTML tag is semantic?", options:["<div>","<span>","<section>","<b>"], answer:3},
        {question:"CSS is used for:", options:["Database","Styling","Server Hosting","Compiling"], answer:2},
        {question:"JavaScript is mainly used for:", options:["Backend","Styling","Interactivity","Database"], answer:3},
        {question:"Which protocol is default for web pages?", options:["FTP","SMTP","HTTP","SSH"], answer:3}
      ],
      "Cybersecurity":[
        {question:"Phishing is:", options:["Sending fake emails to steal data","Encrypting data","Installing antivirus","Cloud hosting"], answer:1},
        {question:"HTTPS is secure because of:", options:["Cookies","SSL/TLS","VPN","Proxy"], answer:2},
        {question:"Strong password includes:", options:["Only letters","Letters + numbers + symbols","Just name reversed","Only numbers"], answer:2},
        {question:"Malware means:", options:["Malicious software","Firewall","Data backup","Router"], answer:1}
      ],
      "Data Science":[
        {question:"Which library is used for data manipulation in Python?", options:["Flask","Pandas","Django","React"], answer:2},
        {question:"Regression is used for:", options:["Classification","Predicting continuous values","Encryption","Sorting"], answer:2},
        {question:"Which chart is best for categorical data?", options:["Line","Bar","Scatter","Histogram"], answer:2},
        {question:"Data cleaning process is called:", options:["Wrangling","Mining","Visualization","Sorting"], answer:1}
      ],
      "General Knowledge":[
        {question:"Capital of Japan?", options:["Seoul","Beijing","Tokyo","Osaka"], answer:3},
        {question:"Who is known as the 'Missile Man of India'?", options:["C.V. Raman","A.P.J. Abdul Kalam","Homi Bhabha","Vikram Sarabhai"], answer:2},
        {question:"National sport of India (official)?", options:["Cricket","Hockey","Kabaddi","None"], answer:4},
        {question:"Largest planet in solar system?", options:["Earth","Saturn","Jupiter","Mars"], answer:3}
      ],
      "Logical Reasoning":[
        {question:"Series: 2, 4, 8, 16, ?", options:["18","20","32","24"], answer:3},
        {question:"If CAT = 24, DOG = 26, then BAT = ?", options:["23","24","25","26"], answer:1},
        {question:"Which is the odd one out?", options:["Apple","Banana","Mango","Potato"], answer:4},
        {question:"If 5 men can build a wall in 10 days, 10 men will build in:", options:["20","10","5","2"], answer:3}
      ],
      "Aptitude":[
        {question:"20% of 200 = ?", options:["20","30","40","50"], answer:3},
        {question:"Average of 10, 20, 30?", options:["15","20","25","30"], answer:2},
        {question:"If 3 pens cost ₹60, 1 pen costs?", options:["₹15","₹20","₹25","₹30"], answer:2},
        {question:"Ratio of 2:3 means?", options:["2 ÷ 3","2 + 3","2 × 3","2 − 3"], answer:1}
      ],
      "Cloud Basics":[
        {question:"Full form of SaaS?", options:["Software as a Service","Storage as a Service","Security as a Service","System as a Service"], answer:1},
        {question:"Which is not a cloud provider?", options:["AWS","Azure","GCP","BIOS"], answer:4},
        {question:"IaaS provides:", options:["Software only","Hardware resources (VMs, storage)","Applications","Security only"], answer:2},
        {question:"Example of PaaS:", options:["Google App Engine","Gmail","Dropbox","AWS EC2"], answer:1}
      ],
      "Operating Systems":[
        {question:"Which is not an OS?", options:["Windows","Linux","Oracle","macOS"], answer:3},
        {question:"OS manages:", options:["Hardware & software resources","Only hardware","Only software","Just files"], answer:1},
        {question:"Which scheduling is used in OS?", options:["FCFS","SJF","Round Robin","All of the above"], answer:4},
        {question:"Which memory is fastest?", options:["Cache","RAM","Hard Disk","SSD"], answer:1}
      ]
    };

    const db = ensureDomains();
    Object.keys(seed).forEach(k=>{
      db[k] = db[k] || [];
      const existingQ = new Set(db[k].map(x=>x.question));
      seed[k].forEach(q=>{ if(!existingQ.has(q.question)) db[k].push(q); });
    });
    setDB(db);
    showToast(msg, "🌱 All 10 domains & questions added!");
    domainList.innerHTML = Object.entries(getDB()).map(([name,arr])=>`<span class="chip">${name} • ${arr.length}</span>`).join("");
  });
})();

// ----- STUDENT PAGE LOGIC -----
(function initStudent(){
  const cardsWrap = document.getElementById("domainCards");
  if(!cardsWrap) return; // Not student page

  const quizArea = document.getElementById("quizArea");
  const quizDomain = document.getElementById("quizDomain");
  const qIndex = document.getElementById("qIndex");
  const qTotal = document.getElementById("qTotal");
  const qText = document.getElementById("quizQuestion");
  const optionsWrap = document.getElementById("options");
  const nextBtn = document.getElementById("nextBtn");
  const result = document.getElementById("result");

  let domain = null;
  let questions = [];
  let current = 0;
  let score = 0;

  // Render domain cards
  function renderDomains(){
    const db = ensureDomains();
    const entries = Object.entries(db);
    cardsWrap.innerHTML = entries.map(([name,arr])=>{
      return `<div class="card" data-domain="${name}">
        <h3>${name}</h3>
        <small>${arr.length} question(s)</small>
      </div>`;
    }).join("");

    [...cardsWrap.querySelectorAll('.card')].forEach(card=>{
      card.addEventListener('click', ()=> startQuiz(card.dataset.domain));
    });
  }

  function startQuiz(selDomain){
    domain = selDomain;
    const db = getDB();
    questions = (db[domain] || []).slice();
    if(questions.length === 0){
      alert("No questions available for this domain yet. Ask Staff to add some.");
      return;
    }
    current = 0; score = 0;
    quizDomain.textContent = `${domain} Quiz`;
    qTotal.textContent = questions.length;
    result.style.display = 'none';
    quizArea.style.display = 'block';
    loadQ();
  }

  function loadQ(){
    if(current >= questions.length){
      quizArea.style.display = 'none';
      const percent = Math.round((score/questions.length)*100);
      const points = score;
      result.innerHTML = `
        <h2>Scorecard</h2>
        <div class="panel">
          <p><strong>Domain:</strong> ${domain}</p>
          <p><strong>Your Score:</strong> ${score} / ${questions.length} (${percent}%)</p>
          <p><strong>Points:</strong> ${points}</p>
          <div class="actions">
            <button class="btn" onclick="location.reload()">Try Another Domain</button>
          </div>
        </div>`;
      result.style.display = 'block';
      return;
    }

    const q = questions[current];
    qIndex.textContent = current+1;
    qText.textContent = q.question;
    optionsWrap.innerHTML = q.options.map((opt,i)=>{
      const id = `opt_${current}_${i+1}`;
      return `<label><input type="radio" name="opt" value="${i+1}" id="${id}"> ${opt}</label>`;
    }).join("");
  }

  nextBtn.addEventListener('click', ()=>{
    const chosen = document.querySelector('input[name="opt"]:checked');
    if(!chosen){ alert('Please select an option'); return; }
    if(parseInt(chosen.value,10) === questions[current].answer){ score++; }
    current++;
    loadQ();
  });

  renderDomains();
})();
