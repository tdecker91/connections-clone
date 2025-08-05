(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&o(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();function p(){return`
    <div class="setup-container">
      <header class="setup-header">
        <h1>Create Your Connections Game</h1>
        <p>Enter 4 categories with 4 words each to create your custom Connections puzzle</p>
        <button type="button" id="load-example" class="action-button">Load Example</button>
      </header>

      <form id="setup-form" class="setup-form">
        ${["Yellow","Blue","Green","Purple"].map((e,t)=>w(t+1,e)).join("")}
        
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
  `}function b(i){const e=new TextEncoder;let t=0;const o=[];for(const n of i.categories){const c=e.encode(n.title);o.push(c.length,c),t+=1+c.length;for(const d of n.words){const l=e.encode(d);o.push(l.length,l),t+=1+l.length}}const s=new Uint8Array(t);let r=0;for(let n=0;n<o.length;n+=2){const c=o[n],d=o[n+1];s[r++]=c,s.set(d,r),r+=c}let a="";for(let n=0;n<s.length;n++)a+=String.fromCharCode(s[n]);return btoa(a).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function v(i){let e=i.replace(/-/g,"+").replace(/_/g,"/");for(;e.length%4;)e+="=";const t=atob(e),o=new Uint8Array(t.length);for(let n=0;n<t.length;n++)o[n]=t.charCodeAt(n);const s=new TextDecoder,r=[];let a=0;for(let n=0;n<4;n++){const c=o[a++],d=o.slice(a,a+c),l=s.decode(d);a+=c;const u=[];for(let h=0;h<4;h++){const m=o[a++],g=o.slice(a,a+m),f=s.decode(g);u.push(f),a+=m}r.push({title:l,words:u})}return{categories:r}}class S{constructor(){this.gameData=null,this.currentPage="setup",window.addEventListener("popstate",()=>{this.handleNavigation()}),this.handleNavigation()}handleNavigation(){const e=new URLSearchParams(window.location.search),t=window.location.pathname;if(e.has("game"))try{const r=v(e.get("game"));this.setGameData(r,!0);return}catch{this.redirectToSetup();return}const o="/connections-clone/";if(!(t===o||t===o.replace(/\/$/,"")||t==="/")){this.redirectToSetup();return}this.showSetup()}redirectToSetup(){const e="/connections-clone/",t=new URL(e,window.location.origin);window.history.replaceState({},"",t),this.showSetup()}init(){this.render()}setGameData(e,t=!1){const o=["yellow","blue","green","purple"];if(e.categories.forEach((s,r)=>{s.color||(s.color=o[r])}),this.gameData=e,!t){const s=b(e),r="/connections-clone/",a=new URL(r,window.location.origin);a.searchParams.set("game",s),window.history.pushState({},"",a)}this.showGame()}showSetup(){this.currentPage="setup";const e="/connections-clone/",t=new URL(e,window.location.origin);t.searchParams.delete("game"),window.history.pushState({},"",t),this.render()}showGame(){this.currentPage="game",this.render()}render(){const e=document.querySelector("#app");this.currentPage==="setup"?(e.innerHTML=p(),this.initSetupPage()):this.currentPage==="game"&&(e.innerHTML=y(this.gameData),this.initGamePage())}initSetupPage(){document.querySelector("#setup-form");const e=document.querySelector("#start-game");document.querySelector("#load-example").addEventListener("click",()=>{[{title:"Colors",words:["Red","Blue","Green","Yellow"]},{title:"Animals",words:["Cat","Dog","Bird","Fish"]},{title:"Fruits",words:["Apple","Orange","Banana","Grape"]},{title:"Sports",words:["Soccer","Tennis","Baseball","Basketball"]}].forEach((s,r)=>{document.querySelector(`#category-${r+1}-title`).value=s.title,s.words.forEach((a,n)=>{document.querySelector(`#category-${r+1}-word-${n+1}`).value=a})})}),e.addEventListener("click",o=>{o.preventDefault();const s=[];for(let r=1;r<=4;r++){const a=document.querySelector(`#category-${r}-title`).value.trim(),n=[document.querySelector(`#category-${r}-word-1`).value.trim(),document.querySelector(`#category-${r}-word-2`).value.trim(),document.querySelector(`#category-${r}-word-3`).value.trim(),document.querySelector(`#category-${r}-word-4`).value.trim()];if(!a||n.some(c=>!c)){alert(`Please fill in all fields for category ${r}`);return}s.push({title:a,words:n})}this.setGameData({categories:s})})}initGamePage(){const e=document.querySelector("#back-to-setup"),t=document.querySelector("#restart-game");e&&e.addEventListener("click",()=>this.showSetup()),t&&t.addEventListener("click",()=>this.showGame()),this.initGame()}initGame(){let e=[],t=[],o=4;const s=this.gameData.categories.flatMap(c=>c.words),r=this.shuffleArray([...s]);this.renderWordGrid(r);const a=document.querySelectorAll(".word-button");a.forEach(c=>{c.addEventListener("click",()=>{const d=c.textContent;e.includes(d)?(e=e.filter(l=>l!==d),c.classList.remove("selected")):e.length<4&&(e.push(d),c.classList.add("selected")),c.blur(),this.updateSubmitButton(e.length===4),this.updateSelectionFeedback(e.length)})}),document.querySelector("#submit-guess").addEventListener("click",()=>{if(e.length!==4)return;const c=this.findCategory(e);if(c)t.push(c),this.markCategoryFound(c,e),e=[],t.length===4&&this.showWinMessage();else{this.animateIncorrectGuess(e),o--;const d=this.checkOneAway(e);this.showIncorrectGuess(o,d),o===0&&setTimeout(()=>this.showGameOver(),1e3)}setTimeout(()=>{a.forEach(d=>d.classList.remove("selected")),e=[],this.updateSubmitButton(!1)},600)})}shuffleArray(e){const t=[...e];for(let o=t.length-1;o>0;o--){const s=Math.floor(Math.random()*(o+1));[t[o],t[s]]=[t[s],t[o]]}return t}renderWordGrid(e){const t=document.querySelector("#word-grid");t.innerHTML=e.map(o=>`<button class="word-button">${o}</button>`).join("")}findCategory(e){return this.gameData.categories.find(t=>t.words.every(o=>e.includes(o))&&e.every(o=>t.words.includes(o)))}markCategoryFound(e,t){document.querySelectorAll(".word-button").forEach(n=>{t.includes(n.textContent)&&n.remove()});const s=document.querySelector("#found-categories"),r=document.createElement("div");r.className=`found-category category-${e.color}`,r.innerHTML=`
      <h3>${e.title}</h3>
      <p>${e.words.join(", ")}</p>
    `,s.appendChild(r);const a=document.querySelector("#game-feedback");a.textContent=`Great! You found "${e.title}"`,a.className="feedback success",setTimeout(()=>{s.children.length<4&&(a.textContent="Select 4 words that belong together",a.className="feedback")},2e3)}updateSubmitButton(e){const t=document.querySelector("#submit-guess");t.disabled=!e}updateSelectionFeedback(e){const t=document.querySelector("#game-feedback");e===0?(t.textContent="Select 4 words that belong together",t.className="feedback"):e<4?(t.textContent=`${e} selected. Need ${4-e} more.`,t.className="feedback"):(t.textContent="4 words selected. Click Submit!",t.className="feedback success")}animateIncorrectGuess(e){document.querySelectorAll(".word-button").forEach(o=>{e.includes(o.textContent)&&(o.classList.add("shake"),setTimeout(()=>{o.classList.remove("shake")},600))})}checkOneAway(e){return this.gameData.categories.some(t=>e.filter(s=>t.words.includes(s)).length===3)}showIncorrectGuess(e,t=!1){const o=document.querySelector("#game-feedback");if(this.updateAttemptsIndicator(4-e),t)o.textContent="One away...",o.className="feedback warning";else{const s=["Not quite...","Try again!","Keep looking...","Almost there!"],r=s[Math.floor(Math.random()*s.length)];o.textContent=`${r} ${e} ${e===1?"attempt":"attempts"} remaining.`,o.className="feedback error"}setTimeout(()=>{o.textContent="Select 4 words that belong together",o.className="feedback"},2e3)}updateAttemptsIndicator(e){document.querySelectorAll(".attempt-dot").forEach((o,s)=>{s<e?o.classList.add("used"):o.classList.remove("used")})}showWinMessage(){const e=document.querySelector("#game-feedback");e.textContent="Congratulations! You found all categories!",e.className="feedback success"}showGameOver(){const e=document.querySelector("#game-feedback");e.textContent="Game Over! Better luck next time.",e.className="feedback error",document.querySelectorAll(".word-button").forEach(t=>t.disabled=!0)}}new S;
