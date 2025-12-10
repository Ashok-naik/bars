
    // initial restaurants (example). You told me these images are in img/ folder.
    let restaurants = [
      {name: "Sri Sri Sri", img: "img/srisrisri.jpg"},
      {name: "Gayatri", img: "img/gayatri.jpeg"},
      {name: "Sitara", img: "img/sitara.jpeg"},
      // add other items (can be full URLs or local paths)
      {name: "Kinnera", img: "img/kinnera.png"},
      {name: "Bhimas", img: "img/bhimas.jpg"},
      {name: "Biryanis", img: "img/biryanis.jpg"}
    ];

    // DOM refs
    const resultEl = document.getElementById('result');
    const sponsorResultEl = document.getElementById('sponsorResult');
    const resultImgTag = document.getElementById('resultImgTag');
    const listWrapper = document.getElementById('listWrapper');
    const newRestaurantInput = document.getElementById('newRestaurant');
    const newImageInput = document.getElementById('newImageUrl');
    const pickBtn = document.getElementById('pickBtn');
    const addBtn = document.getElementById('addBtn');
    const clearBtn = document.getElementById('clearBtn');
    const countEl = document.getElementById('count');
    const sponsorOverlay = document.getElementById('sponsorOverlay');
    const sponsorName = document.getElementById('sponsorName');

    // fallback placeholder (SVG data URL)
    const PLACEHOLDER = 'data:image/svg+xml;utf8,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-family="Arial" font-size="28">No image</text></svg>'
    );

    // helper: returns array of candidate srcs for a given path (if has extension, try as-is; else try common extensions)
    function candidatesForPath(path) {
      if (!path) return [PLACEHOLDER];
      path = path.trim();
      // if it looks like a data URL or absolute URL or already has extension, try as-is first
      if (/^data:|^https?:\/\//.test(path) || /\.[a-zA-Z0-9]{2,5}$/.test(path)) {
        return [path];
      }
      return [path, path + '.jpg', path + '.png', path + '.webp'];
    }

    // Try a list of srcs in order by setting img.src and listening for onerror
    function tryLoadImageInto(imgEl, srcList, fallback) {
      let i = 0;
      function tryOne() {
        if (i >= srcList.length) {
          imgEl.src = fallback || PLACEHOLDER;
          imgEl.style.display = fallback ? 'block' : 'block';
          return;
        }
        const src = srcList[i++];
        imgEl.onerror = tryOne;
        imgEl.onload = () => {
          imgEl.onerror = null;
          imgEl.onload = null;
        };
        imgEl.src = src;
        imgEl.style.display = 'block';
      }
      tryOne();
    }

    // render list with thumbnail attempts
    function renderList(){
      listWrapper.innerHTML = '';
      if(restaurants.length === 0){
        listWrapper.innerHTML = '<div class="small" style="text-align:center;color:var(--muted)">No restaurants yet</div>';
      } else {
        restaurants.forEach((item, i) => {
          const row = document.createElement('div');
          row.className = 'list-item';

          const thumbSrc = item.img ? item.img : '';
          const thumbCandidates = candidatesForPath(thumbSrc);

          // build inner HTML with an <img> that we will supply srcs for
          row.innerHTML = `
            <div class="list-left">
              <div class="thumb"><img id="thumb-img-${i}" src="${PLACEHOLDER}" alt="${escapeHtml(item.name)} thumbnail"></div>
              <div style="font-weight:800">${escapeHtml(item.name)}</div>
            </div>
            <div>
              <button class="remove" data-i="${i}" aria-label="Remove ${escapeHtml(item.name)}">Remove</button>
            </div>
          `;
          listWrapper.appendChild(row);

          // attempt to load thumbnail candidates
          const imgEl = document.getElementById(`thumb-img-${i}`);
          tryLoadImageInto(imgEl, thumbCandidates, PLACEHOLDER);
        });
      }
      countEl.textContent = restaurants.length;
      attachRemoves();
    }

    function escapeHtml(s){ return String(s).replace(/[&<>"']/g, (m)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

    function attachRemoves(){
      document.querySelectorAll('.remove').forEach(btn => {
        btn.onclick = () => {
          const i = Number(btn.dataset.i);
          if(!Number.isNaN(i)){
            restaurants.splice(i,1);
            renderList();
          }
        };
      });
    }

    // confetti
    function launchConfetti(cnt = 36){
      const maxLeft = Math.max(window.innerWidth - 20, 100);
      for(let i=0;i<cnt;i++){
        const c = document.createElement('div');
        c.className = 'confetti';
        c.style.left = (Math.random() * maxLeft) + 'px';
        c.style.width = (6 + Math.random()*8) + 'px';
        c.style.height = (10 + Math.random()*12) + 'px';
        c.style.background = `hsl(${Math.floor(Math.random()*360)},80%,60%)`;
        c.style.animationDuration = (1.2 + Math.random()*1.4) + 's';
        c.style.transform = `rotate(${Math.random()*360}deg)`;
        document.body.appendChild(c);
        setTimeout(()=> c.remove(), 2600);
      }
    }

    // pick flow
    function pickRandomRestaurant(){
      if(restaurants.length === 0){
        alert('Please add at least one restaurant.');
        return;
      }

      const sponsors = ["Ashok","Ramakrishna","Balu","Sailaja"];
      const sponsor = sponsors[Math.floor(Math.random()*sponsors.length)];
      sponsorName.textContent = sponsor;
      sponsorOverlay.style.opacity = '1';
      sponsorOverlay.style.pointerEvents = 'auto';
      sponsorOverlay.setAttribute('aria-hidden','false');

      // randomly select index early (so image can start loading while overlay shows)
      const index = Math.floor(Math.random()*restaurants.length);
      const chosen = restaurants[index];

      // prepare image candidates
      const candidates = candidatesForPath(chosen.img);

      setTimeout(() => {
        // hide overlay
        sponsorOverlay.style.opacity = '0';
        sponsorOverlay.style.pointerEvents = 'none';
        sponsorOverlay.setAttribute('aria-hidden','true');

        // show name and sponsor
        resultEl.textContent = chosen.name;
        sponsorResultEl.textContent = `Sponsored by: ${sponsor}`;

        // load image into result image tag, try candidates
        resultImgTag.style.display = 'none';
        tryLoadImageInto(resultImgTag, candidates, PLACEHOLDER);

        // animate and confetti
        resultEl.classList.remove('pop');
        void resultEl.offsetWidth;
        resultEl.classList.add('pop');
        launchConfetti();
      }, 1800);
    }

    function clearResult(){
      resultEl.textContent = '🍽️';
      sponsorResultEl.textContent = '';
      resultImgTag.style.display = 'none';
      resultImgTag.src = '';
      resultEl.classList.remove('pop');
      newRestaurantInput.focus();
    }

    function addRestaurant(){
      const name = newRestaurantInput.value.trim();
      const img = newImageInput.value.trim();
      if(!name) return;
      restaurants.push({name, img});
      newRestaurantInput.value = '';
      newImageInput.value = '';
      renderList();
      newRestaurantInput.focus();
    }

    // keyboard support
    newRestaurantInput.addEventListener('keydown', (e)=>{ if(e.key === 'Enter') addRestaurant(); });
    newImageInput.addEventListener('keydown', (e)=>{ if(e.key === 'Enter') addRestaurant(); });

    pickBtn.addEventListener('click', pickRandomRestaurant);
    addBtn.addEventListener('click', addRestaurant);
    clearBtn.addEventListener('click', clearResult);

    // initial render
    renderList();

    // accessibility / close overlay
    window.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape'){
        sponsorOverlay.style.opacity = '0';
        sponsorOverlay.style.pointerEvents = 'none';
        sponsorOverlay.setAttribute('aria-hidden','true');
      }
    });

    // keep layout stable on orientation change
    window.addEventListener('resize', ()=> renderList());
