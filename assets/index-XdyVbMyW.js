(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))t(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&t(a)}).observe(document,{childList:!0,subtree:!0});function r(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function t(o){if(o.ep)return;o.ep=!0;const s=r(o);fetch(o.href,s)}})();function p(){return`
    <div class="setup-container">
      <header class="setup-header">
        <h1>Create Your Connections Game</h1>
        <p>Enter 4 categories with 4 words each to create your custom Connections puzzle</p>
        <button type="button" id="load-example" class="action-button">Load Example</button>
      </header>

      <form id="setup-form" class="setup-form">
        ${["Yellow","Blue","Green","Purple"].map((e,r)=>w(r+1,e)).join("")}
        
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
  `}function b(i){const e=new TextEncoder;let r=0;const t=[];for(const n of i.categories){const c=e.encode(n.title);t.push(c.length,c),r+=1+c.length;for(const d of n.words){const l=e.encode(d);t.push(l.length,l),r+=1+l.length}}const o=new Uint8Array(r);let s=0;for(let n=0;n<t.length;n+=2){const c=t[n],d=t[n+1];o[s++]=c,o.set(d,s),s+=c}let a="";for(let n=0;n<o.length;n++)a+=String.fromCharCode(o[n]);return btoa(a).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function v(i){let e=i.replace(/-/g,"+").replace(/_/g,"/");for(;e.length%4;)e+="=";const r=atob(e),t=new Uint8Array(r.length);for(let n=0;n<r.length;n++)t[n]=r.charCodeAt(n);const o=new TextDecoder,s=[];let a=0;for(let n=0;n<4;n++){const c=t[a++],d=t.slice(a,a+c),l=o.decode(d);a+=c;const u=[];for(let m=0;m<4;m++){const h=t[a++],g=t.slice(a,a+h),f=o.decode(g);u.push(f),a+=h}s.push({title:l,words:u})}return{categories:s}}class S{constructor(){this.gameData=null,this.currentPage="setup";const e=new URLSearchParams(window.location.search);if(e.has("game"))try{const r=v(e.get("game"));this.setGameData(r,!0);return}catch{}this.init()}init(){this.render()}setGameData(e,r=!1){const t=["yellow","blue","green","purple"];if(e.categories.forEach((o,s)=>{o.color||(o.color=t[s])}),this.gameData=e,!r){const o=b(e),s=new URL(window.location);s.searchParams.set("game",o),window.history.replaceState({},"",s)}this.showGame()}showSetup(){this.currentPage="setup";const e=new URL(window.location);e.searchParams.delete("game"),window.history.replaceState({},"",e),this.render()}showGame(){this.currentPage="game",this.render()}render(){const e=document.querySelector("#app");this.currentPage==="setup"?(e.innerHTML=p(),this.initSetupPage()):this.currentPage==="game"&&(e.innerHTML=y(this.gameData),this.initGamePage())}initSetupPage(){document.querySelector("#setup-form");const e=document.querySelector("#start-game");document.querySelector("#load-example").addEventListener("click",()=>{[{title:"Colors",words:["Red","Blue","Green","Yellow"]},{title:"Animals",words:["Cat","Dog","Bird","Fish"]},{title:"Fruits",words:["Apple","Orange","Banana","Grape"]},{title:"Sports",words:["Soccer","Tennis","Baseball","Basketball"]}].forEach((o,s)=>{document.querySelector(`#category-${s+1}-title`).value=o.title,o.words.forEach((a,n)=>{document.querySelector(`#category-${s+1}-word-${n+1}`).value=a})})}),e.addEventListener("click",t=>{t.preventDefault();const o=[];for(let s=1;s<=4;s++){const a=document.querySelector(`#category-${s}-title`).value.trim(),n=[document.querySelector(`#category-${s}-word-1`).value.trim(),document.querySelector(`#category-${s}-word-2`).value.trim(),document.querySelector(`#category-${s}-word-3`).value.trim(),document.querySelector(`#category-${s}-word-4`).value.trim()];if(!a||n.some(c=>!c)){alert(`Please fill in all fields for category ${s}`);return}o.push({title:a,words:n})}this.setGameData({categories:o})})}initGamePage(){const e=document.querySelector("#back-to-setup"),r=document.querySelector("#restart-game");e&&e.addEventListener("click",()=>this.showSetup()),r&&r.addEventListener("click",()=>this.showGame()),this.initGame()}initGame(){let e=[],r=[],t=4;const o=this.gameData.categories.flatMap(c=>c.words),s=this.shuffleArray([...o]);this.renderWordGrid(s);const a=document.querySelectorAll(".word-button");a.forEach(c=>{c.addEventListener("click",()=>{const d=c.textContent;e.includes(d)?(e=e.filter(l=>l!==d),c.classList.remove("selected")):e.length<4&&(e.push(d),c.classList.add("selected")),this.updateSubmitButton(e.length===4)})}),document.querySelector("#submit-guess").addEventListener("click",()=>{if(e.length!==4)return;const c=this.findCategory(e);if(c)r.push(c),this.markCategoryFound(c,e),e=[],r.length===4&&this.showWinMessage();else{this.animateIncorrectGuess(e),t--;const d=this.checkOneAway(e);this.showIncorrectGuess(t,d),t===0&&setTimeout(()=>this.showGameOver(),1e3)}setTimeout(()=>{a.forEach(d=>d.classList.remove("selected")),e=[],this.updateSubmitButton(!1)},600)})}shuffleArray(e){const r=[...e];for(let t=r.length-1;t>0;t--){const o=Math.floor(Math.random()*(t+1));[r[t],r[o]]=[r[o],r[t]]}return r}renderWordGrid(e){const r=document.querySelector("#word-grid");r.innerHTML=e.map(t=>`<button class="word-button">${t}</button>`).join("")}findCategory(e){return this.gameData.categories.find(r=>r.words.every(t=>e.includes(t))&&e.every(t=>r.words.includes(t)))}markCategoryFound(e,r){document.querySelectorAll(".word-button").forEach(n=>{r.includes(n.textContent)&&n.remove()});const o=document.querySelector("#found-categories"),s=document.createElement("div");s.className=`found-category category-${e.color}`,s.innerHTML=`
      <h3>${e.title}</h3>
      <p>${e.words.join(", ")}</p>
    `,o.appendChild(s);const a=document.querySelector("#game-feedback");a.textContent=`Great! You found "${e.title}"`,a.className="feedback success",setTimeout(()=>{o.children.length<4&&(a.textContent="Select 4 words that belong together",a.className="feedback")},2e3)}updateSubmitButton(e){const r=document.querySelector("#submit-guess");r.disabled=!e}animateIncorrectGuess(e){document.querySelectorAll(".word-button").forEach(t=>{e.includes(t.textContent)&&(t.classList.add("shake"),setTimeout(()=>{t.classList.remove("shake")},600))})}checkOneAway(e){return this.gameData.categories.some(r=>e.filter(o=>r.words.includes(o)).length===3)}showIncorrectGuess(e,r=!1){const t=document.querySelector("#game-feedback");if(this.updateAttemptsIndicator(4-e),r)t.textContent="One away...",t.className="feedback warning";else{const o=["Not quite...","Try again!","Keep looking...","Almost there!"],s=o[Math.floor(Math.random()*o.length)];t.textContent=`${s} ${e} ${e===1?"attempt":"attempts"} remaining.`,t.className="feedback error"}setTimeout(()=>{t.textContent="Select 4 words that belong together",t.className="feedback"},2e3)}updateAttemptsIndicator(e){document.querySelectorAll(".attempt-dot").forEach((t,o)=>{o<e?t.classList.add("used"):t.classList.remove("used")})}showWinMessage(){const e=document.querySelector("#game-feedback");e.textContent="Congratulations! You found all categories!",e.className="feedback success"}showGameOver(){const e=document.querySelector("#game-feedback");e.textContent="Game Over! Better luck next time.",e.className="feedback error",document.querySelectorAll(".word-button").forEach(r=>r.disabled=!0)}}new S;
