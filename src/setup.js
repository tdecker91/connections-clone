export function setupPage() {
  const categoryColors = ['Yellow', 'Blue', 'Green', 'Purple']
  
  return `
    <div class="setup-container">
      <header class="setup-header">
        <h1>Create Your Connections Game</h1>
        <p>Enter 4 categories with 4 words each to create your custom Connections puzzle</p>
        <button type="button" id="load-example" class="action-button">Load Example</button>
      </header>

      <form id="setup-form" class="setup-form">
        ${categoryColors.map((color, i) => createCategoryInput(i + 1, color)).join('')}
        
        <div class="form-actions">
          <button type="button" id="start-game" class="start-button">Start Game</button>
        </div>
      </form>
    </div>
  `
}

function createCategoryInput(categoryNumber, colorName) {
  return `
    <div class="category-input category-${colorName.toLowerCase()}">
      <h3>${colorName} Category</h3>
      <div class="category-fields">
        <input 
          type="text" 
          id="category-${categoryNumber}-title" 
          placeholder="Category title (e.g., 'Colors')" 
          class="category-title-input"
          required
        />
        <div class="words-grid">
          <input 
            type="text" 
            id="category-${categoryNumber}-word-1" 
            placeholder="Word 1" 
            class="word-input"
            required
          />
          <input 
            type="text" 
            id="category-${categoryNumber}-word-2" 
            placeholder="Word 2" 
            class="word-input"
            required
          />
          <input 
            type="text" 
            id="category-${categoryNumber}-word-3" 
            placeholder="Word 3" 
            class="word-input"
            required
          />
          <input 
            type="text" 
            id="category-${categoryNumber}-word-4" 
            placeholder="Word 4" 
            class="word-input"
            required
          />
        </div>
      </div>
    </div>
  `
}
