(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))t(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&t(n)}).observe(document,{childList:!0,subtree:!0});function o(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function t(s){if(s.ep)return;s.ep=!0;const r=o(s);fetch(s.href,r)}})();function p(){return`
    <div class="setup-container">
      <header class="setup-header">
        <h1>Create Your Connections Game</h1>
        <p>Enter 4 categories with 4 words each to create your custom Connections puzzle</p>
        <button type="button" id="load-example" class="action-button">Load Example</button>
      </header>

      <form id="setup-form" class="setup-form">
        ${["Yellow","Blue","Green","Purple"].map((e,o)=>w(o+1,e)).join("")}
        
        <div class="form-actions">
          <button type="button" id="start-game" class="start-button">Start Game</button>
        </div>
      </form>
    </div>
  `}function w(i,e){return`
    <div class="category-input category-${e.toLowerCase()}">
      <h3>${e} Category</h3>
      <div class="category-fields">
        <input 
          type="text" 
          id="category-${i}-title" 
          placeholder="Category title (e.g., 'Colors')" 
          class="category-title-input"
          required
        />
        <div class="words-grid">
          <input 
            type="text" 
            id="category-${i}-word-1" 
            placeholder="Word 1" 
            class="word-input"
            required
          />
          <input 
            type="text" 
            id="category-${i}-word-2" 
            placeholder="Word 2" 
            class="word-input"
            required
          />
          <input 
            type="text" 
            id="category-${i}-word-3" 
            placeholder="Word 3" 
            class="word-input"
            required
          />
          <input 
            type="text" 
            id="category-${i}-word-4" 
            placeholder="Word 4" 
            class="word-input"
            required
          />
        </div>
      </div>
    </div>
  `}function y(i){return`
    <div class="game-container">
      <header class="game-header">
        <h1>Connections</h1>
        <p>Find groups of four related words</p>
        <div class="game-actions">
          <button id="back-to-setup" class="action-button secondary">New Game</button>
          <button id="restart-game" class="action-button secondary">Restart</button>
        </div>
      </header>

      <div class="game-content">
        <div id="found-categories" class="found-categories">
          <!-- Found categories will be displayed here -->
        </div>

        <div id="word-grid" class="word-grid">
          <!-- Word buttons will be generated here -->
        </div>

        <div class="game-controls">
          <div id="attempts-indicator" class="attempts-indicator">
            <div class="attempt-dot"></div>
            <div class="attempt-dot"></div>
            <div class="attempt-dot"></div>
            <div class="attempt-dot"></div>
          </div>
          <button id="submit-guess" class="submit-button" disabled>Submit</button>
        </div>

        <div id="game-feedback" class="feedback">
          Select 4 words that belong together
        </div>
      </div>
    </div>
  `}function b(i){const e=new TextEncoder;let o=0;const t=[];for(const a of i.categories){const c=e.encode(a.title);t.push(c.length,c),o+=1+c.length;for(const d of a.words){const l=e.encode(d);t.push(l.length,l),o+=1+l.length}}const s=new Uint8Array(o);let r=0;for(let a=0;a<t.length;a+=2){const c=t[a],d=t[a+1];s[r++]=c,s.set(d,r),r+=c}let n="";for(let a=0;a<s.length;a++)n+=String.fromCharCode(s[a]);return btoa(n).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function v(i){let e=i.replace(/-/g,"+").replace(/_/g,"/");for(;e.length%4;)e+="=";const o=atob(e),t=new Uint8Array(o.length);for(let a=0;a<o.length;a++)t[a]=o.charCodeAt(a);const s=new TextDecoder,r=[];let n=0;for(let a=0;a<4;a++){const c=t[n++],d=t.slice(n,n+c),l=s.decode(d);n+=c;const u=[];for(let h=0;h<4;h++){const m=t[n++],g=t.slice(n,n+m),f=s.decode(g);u.push(f),n+=m}r.push({title:l,words:u})}return{categories:r}}class S{constructor(){this.gameData=null,this.currentPage="setup",window.addEventListener("popstate",()=>{this.handleNavigation()}),this.handleNavigation()}handleNavigation(){const e=new URLSearchParams(window.location.search),o=window.location.pathname;if(e.has("game"))try{const r=v(e.get("game"));this.setGameData(r,!0);return}catch{this.redirectToSetup();return}const t="/connections-clone/";if(!(o===t||o===t.replace(/\/$/,"")||o==="/")){this.redirectToSetup();return}this.showSetup()}redirectToSetup(){const e="/connections-clone/",o=new URL(e,window.location.origin);window.history.replaceState({},"",o),this.showSetup()}init(){this.render()}setGameData(e,o=!1){const t=["yellow","blue","green","purple"];if(e.categories.forEach((s,r)=>{s.color||(s.color=t[r])}),this.gameData=e,!o){const s=b(e),r="/connections-clone/",n=new URL(r,window.location.origin);n.searchParams.set("game",s),window.history.pushState({},"",n)}this.showGame()}showSetup(){this.currentPage="setup";const e="/connections-clone/",o=new URL(e,window.location.origin);o.searchParams.delete("game"),window.history.pushState({},"",o),this.render()}showGame(){this.currentPage="game",this.render()}render(){const e=document.querySelector("#app");this.currentPage==="setup"?(e.innerHTML=p(),this.initSetupPage()):this.currentPage==="game"&&(e.innerHTML=y(this.gameData),this.initGamePage())}initSetupPage(){document.querySelector("#setup-form");const e=document.querySelector("#start-game");document.querySelector("#load-example").addEventListener("click",()=>{[{title:"Colors",words:["Red","Blue","Green","Yellow"]},{title:"Animals",words:["Cat","Dog","Bird","Fish"]},{title:"Fruits",words:["Apple","Orange","Banana","Grape"]},{title:"Sports",words:["Soccer","Tennis","Baseball","Basketball"]}].forEach((s,r)=>{document.querySelector(`#category-${r+1}-title`).value=s.title,s.words.forEach((n,a)=>{document.querySelector(`#category-${r+1}-word-${a+1}`).value=n})})}),e.addEventListener("click",t=>{t.preventDefault();const s=[];for(let r=1;r<=4;r++){const n=document.querySelector(`#category-${r}-title`).value.trim(),a=[document.querySelector(`#category-${r}-word-1`).value.trim(),document.querySelector(`#category-${r}-word-2`).value.trim(),document.querySelector(`#category-${r}-word-3`).value.trim(),document.querySelector(`#category-${r}-word-4`).value.trim()];if(!n||a.some(c=>!c)){alert(`Please fill in all fields for category ${r}`);return}s.push({title:n,words:a})}this.setGameData({categories:s})})}initGamePage(){const e=document.querySelector("#back-to-setup"),o=document.querySelector("#restart-game");e&&e.addEventListener("click",()=>this.showSetup()),o&&o.addEventListener("click",()=>this.showGame()),this.initGame()}initGame(){let e=[],o=[],t=4;const s=this.gameData.categories.flatMap(c=>c.words),r=this.shuffleArray([...s]);this.renderWordGrid(r);const n=document.querySelectorAll(".word-button");n.forEach(c=>{c.addEventListener("click",()=>{const d=c.textContent;e.includes(d)?(e=e.filter(l=>l!==d),c.classList.remove("selected")):e.length<4&&(e.push(d),c.classList.add("selected")),this.updateSubmitButton(e.length===4)})}),document.querySelector("#submit-guess").addEventListener("click",()=>{if(e.length!==4)return;const c=this.findCategory(e);if(c)o.push(c),this.markCategoryFound(c,e),e=[],o.length===4&&this.showWinMessage();else{this.animateIncorrectGuess(e),t--;const d=this.checkOneAway(e);this.showIncorrectGuess(t,d),t===0&&setTimeout(()=>this.showGameOver(),1e3)}setTimeout(()=>{n.forEach(d=>d.classList.remove("selected")),e=[],this.updateSubmitButton(!1)},600)})}shuffleArray(e){const o=[...e];for(let t=o.length-1;t>0;t--){const s=Math.floor(Math.random()*(t+1));[o[t],o[s]]=[o[s],o[t]]}return o}renderWordGrid(e){const o=document.querySelector("#word-grid");o.innerHTML=e.map(t=>`<button class="word-button">${t}</button>`).join("")}findCategory(e){return this.gameData.categories.find(o=>o.words.every(t=>e.includes(t))&&e.every(t=>o.words.includes(t)))}markCategoryFound(e,o){document.querySelectorAll(".word-button").forEach(a=>{o.includes(a.textContent)&&a.remove()});const s=document.querySelector("#found-categories"),r=document.createElement("div");r.className=`found-category category-${e.color}`,r.innerHTML=`
      <h3>${e.title}</h3>
      <p>${e.words.join(", ")}</p>
    `,s.appendChild(r);const n=document.querySelector("#game-feedback");n.textContent=`Great! You found "${e.title}"`,n.className="feedback success",setTimeout(()=>{s.children.length<4&&(n.textContent="Select 4 words that belong together",n.className="feedback")},2e3)}updateSubmitButton(e){const o=document.querySelector("#submit-guess");o.disabled=!e}animateIncorrectGuess(e){document.querySelectorAll(".word-button").forEach(t=>{e.includes(t.textContent)&&(t.classList.add("shake"),setTimeout(()=>{t.classList.remove("shake")},600))})}checkOneAway(e){return this.gameData.categories.some(o=>e.filter(s=>o.words.includes(s)).length===3)}showIncorrectGuess(e,o=!1){const t=document.querySelector("#game-feedback");if(this.updateAttemptsIndicator(4-e),o)t.textContent="One away...",t.className="feedback warning";else{const s=["Not quite...","Try again!","Keep looking...","Almost there!"],r=s[Math.floor(Math.random()*s.length)];t.textContent=`${r} ${e} ${e===1?"attempt":"attempts"} remaining.`,t.className="feedback error"}setTimeout(()=>{t.textContent="Select 4 words that belong together",t.className="feedback"},2e3)}updateAttemptsIndicator(e){document.querySelectorAll(".attempt-dot").forEach((t,s)=>{s<e?t.classList.add("used"):t.classList.remove("used")})}showWinMessage(){const e=document.querySelector("#game-feedback");e.textContent="Congratulations! You found all categories!",e.className="feedback success"}showGameOver(){const e=document.querySelector("#game-feedback");e.textContent="Game Over! Better luck next time.",e.className="feedback error",document.querySelectorAll(".word-button").forEach(o=>o.disabled=!0)}}new S;
