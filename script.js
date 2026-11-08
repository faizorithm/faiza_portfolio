document.addEventListener('DOMContentLoaded', () => {
    
    // Scroll Reveal Logic
    const reveals = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        for (let i = 0; i < reveals.length; i++) {
            const windowHeight = window.innerHeight;
            const elementTop = reveals[i].getBoundingClientRect().top;
            const elementVisible = 100; // Trigger when element is 100px into view

            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add('active');
            }
        }
    };

    // Listen for scroll events
    window.addEventListener('scroll', revealOnScroll);
    
    // Run once on load to reveal elements that are already in view
    revealOnScroll();
});


// Beyond the Code — an original, Zip-inspired path puzzle.
// The full path is guaranteed to be solvable; transformations provide new layouts.
document.addEventListener('DOMContentLoaded', () => {
  const hobbies = [
    ['🎨','Graphic design','I love turning ideas into visuals—playing with color, layout, and details until everything feels just right.'],
    ['🍵','Café hopping & chai lattes','There is always room on my list for a new café and another chai latte to try.'],
    ['💻','Creative coding','My favorite projects are the ones where logic and imagination get to work together.'],
    ['🍜','Finding food spots','Exploring a new neighborhood usually means discovering somewhere delicious along the way.'],
    ['✈️','Traveling','New places, new perspectives, and memories I can bring home with me.'],
    ['📊','Researching data','I like following questions through the data and seeing what surprising stories emerge.'],
    ['🍳','Trying new recipes','A little experimenting in the kitchen is part of the fun—even when the recipe needs a second attempt.'],
    ['📚','Reading e-books','There is something comforting about always having another story within reach.'],
    ['🌸','Exploring fragrances','I enjoy discovering different scents and finding the ones that fit a particular mood.'],
    ['🧩','Solving puzzles','Of course the last discovery is puzzles—you just solved one to get here!']
  ];
  const board = document.getElementById('game-board');
  if (!board) return;
  const status = document.getElementById('game-status');
  const progress = document.getElementById('game-progress');
  const collection = document.getElementById('discovery-collection');
  const checkpointsAt = [0, 6, 12, 19, 26, 33, 40, 47, 54, 63];
  let route = [], checkpoints = new Map(), path = [], layout = -1, dragging = false;
  const key = ([r,c]) => `${r},${c}`;
  const adjacent = (a,b) => Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])===1;
  function makeRoute(variant){
    const base=[];
    for(let r=0;r<8;r++) for(let j=0;j<8;j++) base.push([r,r%2===0?j:7-j]);
    return base.map(([r,c])=>{
      if(variant&1) [r,c]=[c,r];
      if(variant&2) r=7-r;
      if(variant&4) c=7-c;
      return [r,c];
    });
  }
  function discover(){
    const reached = path.reduce((n,p)=>Math.max(n,checkpoints.get(key(p))||0),0);
    const done = path.length===64 && reached===10;
    progress.textContent=`${path.length} / 64 SQUARES`;
    collection.innerHTML='';
    hobbies.forEach(([emoji,name],i)=>{
      const token=document.createElement('span');
      token.className='discovery-token'+(i<reached?' unlocked':'');
      token.textContent=i<reached?emoji:String(i+1);
      token.title=i<reached?name:`Checkpoint ${i+1} locked`;
      collection.append(token);
    });
    document.getElementById('discovery-kicker').textContent=`A NOTE FROM FAIZA · ${String(reached).padStart(2,'0')} / 10`;
    document.getElementById('discovery-emoji').textContent=reached?hobbies[reached-1][0]:'✉️';
    document.getElementById('discovery-title').textContent=done?'You found all ten! ♡':reached?hobbies[reached-1][1]:"There's more to me than code.";
    document.getElementById('discovery-description').textContent=done?'Thanks for taking the scenic route through my world. Now come explore the projects I love building!':reached?hobbies[reached-1][2]:'Draw your path through the numbered checkpoints to reveal ten of my favorite things. Each stop opens a little page from my world.';
    status.textContent=done?'✦ Puzzle complete! You discovered all ten little things.':path.length===0?'Start at 1. Visit every square, and reach 10 last.':`Keep going! ${64-path.length} squares left to visit.`;
  }
  function trailClass(i){
    const p=path[i], prev=path[i-1], next=path[i+1];
    const dirs=[];
    for(const q of [prev,next]) if(q){if(q[0]<p[0])dirs.push('u');else if(q[0]>p[0])dirs.push('d');else if(q[1]<p[1])dirs.push('l');else dirs.push('r');}
    if(dirs.length===1) return ({u:'up',d:'down',l:'left',r:'right'})[dirs[0]];
    if(dirs.includes('l')&&dirs.includes('r'))return 'horizontal';
    if(dirs.includes('u')&&dirs.includes('d'))return 'vertical';
    if(dirs.length===2)return 'corner-'+(dirs.includes('u')?'u':'d')+(dirs.includes('l')?'l':'r');
    return '';
  }
  function render(){
    const lookup=new Map(path.map((p,i)=>[key(p),i]));
    for(const cell of board.children){
      const k=cell.dataset.key, i=lookup.get(k), num=checkpoints.get(k);
      cell.classList.toggle('visited',i!==undefined);
      cell.classList.toggle('checkpoint',Boolean(num));
      cell.innerHTML='';
      if(i!==undefined){const line=document.createElement('span');line.className='trail '+trailClass(i);cell.append(line);}
      if(num){const label=document.createElement('span');label.className='checkpoint-label';label.textContent=num;cell.append(label);}
      cell.setAttribute('aria-label',`Row ${Number(cell.dataset.r)+1}, column ${Number(cell.dataset.c)+1}${num?`, checkpoint ${num}`:''}${i!==undefined?', visited':''}`);
    }
    discover();
  }
  function tryCell(p){
    const k=key(p);
    if(path.length===0){if(checkpoints.get(k)!==1)return;path.push(p);render();return;}
    const last=path[path.length-1];
    if(key(last)===k)return;
    if(path.length>1&&key(path[path.length-2])===k){path.pop();render();return;}
    if(path.length===64||!adjacent(last,p)||path.some(q=>key(q)===k))return;
    const nextNumber=1+Math.max(...path.map(q=>checkpoints.get(key(q))||0));
    const checkpoint=checkpoints.get(k);
    if(checkpoint && checkpoint!==nextNumber)return;
    if(checkpoint===10 && path.length!==63){status.textContent='Visit every other square before finishing at 10.';return;}
    if(path.length===63 && checkpoint!==10)return;
    path.push(p);render();
  }
  function reset(){path=[];render();}
  function newLayout(){
    layout=(layout+1+Math.floor(Math.random()*7))%8;
    route=makeRoute(layout);
    checkpoints=new Map(checkpointsAt.map((i,n)=>[key(route[i]),n+1]));
    board.innerHTML='';
    for(let r=0;r<8;r++)for(let c=0;c<8;c++){
      const cell=document.createElement('button');cell.type='button';cell.className='game-cell';
      cell.dataset.key=`${r},${c}`;cell.dataset.r=r;cell.dataset.c=c;
      cell.addEventListener('click',()=>tryCell([r,c]));
      board.append(cell);
    }
    reset();
  }
  board.addEventListener('pointerdown',event=>{
    const cell=event.target.closest('.game-cell');if(!cell)return;
    dragging=true;event.preventDefault();tryCell([+cell.dataset.r,+cell.dataset.c]);
  });
  board.addEventListener('pointermove',event=>{
    if(!dragging)return;
    const element=document.elementFromPoint(event.clientX,event.clientY);
    const cell=element?.closest('.game-cell');
    if(cell&&board.contains(cell))tryCell([+cell.dataset.r,+cell.dataset.c]);
  });
  window.addEventListener('pointerup',()=>dragging=false);
  window.addEventListener('pointercancel',()=>dragging=false);
  document.getElementById('game-undo').addEventListener('click',()=>{path.pop();render();});
  document.getElementById('game-reset').addEventListener('click',reset);
  document.getElementById('game-new').addEventListener('click',newLayout);
  newLayout();
});

// Accessible theme toggle with saved preference.
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;
  const root = document.documentElement;
  function syncTheme() {
    const dark = root.dataset.theme === 'dark';
    toggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    toggle.setAttribute('aria-pressed', String(dark));
    toggle.querySelector('.theme-icon').textContent = dark ? '☀' : '☾';
    toggle.querySelector('.theme-label').textContent = dark ? 'Light mode' : 'Dark mode';
  }
  syncTheme();
  toggle.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('faiza-theme', root.dataset.theme); } catch (e) {}
    syncTheme();
  });
});

document.addEventListener("DOMContentLoaded", () => {
    const typingName = document.getElementById("typing-name");

    if (!typingName) return;

    const fullText = "I'm Faiza Sarker!";
    let index = 0;

    function typeName() {
        if (index < fullText.length) {
            index++;

            const currentText = fullText.slice(0, index);
            const faizaStart = currentText.indexOf("Faiza");

            if (faizaStart !== -1) {
                const beforeName = currentText.slice(0, faizaStart);
                const faizaPart = currentText.slice(faizaStart);

                typingName.textContent = beforeName;

                const wrap = document.createElement("span");
                wrap.className = "faiza-wrap";

                const outline = document.createElement("span");
                outline.className = "faiza-outline";
                outline.setAttribute("aria-hidden", "true");
                outline.textContent = faizaPart;

                const text = document.createElement("span");
                text.className = "faiza-text";
                text.textContent = faizaPart;

                wrap.append(outline, text);
                typingName.append(wrap);
            } else {
                typingName.textContent = currentText;
            }

            setTimeout(typeName, 110);
        }
    }

    setTimeout(typeName, 500);
});

/* ==========================================
   INTERACTIVE EXPERIENCE TIMELINE
   ========================================== */

   document.addEventListener("DOMContentLoaded", () => {
    const experiences = [
      {
        type: "DATABASE ADMINISTRATION · INFRASTRUCTURE",
        role: "Database Administrator Intern",
        org: "NYC Department of Health",
        description:
          "Performing SQL Server patch installations through Remote Desktop across development, pre-production, staging, and production environments within a 50+ server infrastructure. Monitoring SQL Server Agent job failures, notifying the appropriate technical teams, and performing database backup and restoration procedures.",
        tags: [
          "Microsoft SQL Server",
          "RDP",
          "Server Patching",
          "SQL Server Agent",
          "Backup & Restore"
        ]
      },
      {
        type: "TECHNICAL LEADERSHIP · WEB DEVELOPMENT",
        role: "Technical Lead",
        org: "Women in Computer Science · Hunter College",
        description:
          "Leading the development of the Hunter College Women in Computer Science website, collaborating with designers to improve the user experience, implement new features, and create a welcoming digital space for students to discover events and resources.",
        tags: [
          "Next.js",
          "Tailwind CSS",
          "UI/UX",
          "Technical Leadership"
        ]
      },
      {
        type: "TECHNOLOGY · INNOVATION",
        role: "Workplace Technology Innovation & Engineering Intern",
        org: "Voya Financial",
        description:
          "Supported workplace technology initiatives, including tracking Microsoft Copilot adoption, improving visibility into engagement with emerging AI tools, assisting with technical incident coordination, access restoration, and documentation validation.",
        tags: [
          "Microsoft Copilot",
          "Technology Operations",
          "AI Adoption"
        ]
      },
      {
        type: "SOFTWARE DEVELOPMENT · COLLABORATION",
        role: "Developer",
        org: "Google Code Next",
        description:
          "Built programming and creative problem-solving skills through hands-on software development projects, technical exploration, and collaboration with other aspiring developers.",
        tags: [
          "Programming",
          "Software Development",
          "Collaboration"
        ]
      }
    ];
  
    const tabs = document.querySelectorAll(".experience-tab");
    const panel = document.querySelector(".experience-panel");
  
    if (!tabs.length || !panel) return;
  
    function showExperience(index) {
      const exp = experiences[index];
      if (!exp) return;
  
      tabs.forEach((tab, i) => {
        const selected = i === index;
        tab.classList.toggle("active", selected);
        tab.setAttribute("aria-pressed", String(selected));
      });
  
      document.getElementById("exp-index").textContent =
        `EXPERIENCE / ${String(index + 1).padStart(2, "0")}`;
  
      document.getElementById("exp-type").textContent = exp.type;
      document.getElementById("exp-role").textContent = exp.role;
      document.getElementById("exp-org").textContent = exp.org;
      document.getElementById("exp-description").textContent =
        exp.description;
  
      const tagsContainer = document.getElementById("exp-tags");
      tagsContainer.replaceChildren();
  
      exp.tags.forEach(tag => {
        const span = document.createElement("span");
        span.textContent = tag;
        tagsContainer.appendChild(span);
      });
  
      document.getElementById("exp-count").textContent =
        `${String(index + 1).padStart(2, "0")} / 04`;
    }
  
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        showExperience(Number(tab.dataset.experience));
      });
    });
  });
  