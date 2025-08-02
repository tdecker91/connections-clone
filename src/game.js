export function gamePage(gameData) {
  return `
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
  `
}
