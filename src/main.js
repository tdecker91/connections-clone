function encodeGameData(data) {
  // Custom binary format: [titleLen][title][word1Len][word1][word2Len][word2]...
  // Repeat for 4 categories
  const encoder = new TextEncoder()
  let totalLength = 0
  const parts = []
  
  // Calculate total length and prepare parts
  for (const cat of data.categories) {
    const titleBytes = encoder.encode(cat.title)
    parts.push(titleBytes.length, titleBytes)
    totalLength += 1 + titleBytes.length // 1 byte for length + title bytes
    
    for (const word of cat.words) {
      const wordBytes = encoder.encode(word)
      parts.push(wordBytes.length, wordBytes)
      totalLength += 1 + wordBytes.length // 1 byte for length + word bytes
    }
  }
  
  // Build binary data
  const buffer = new Uint8Array(totalLength)
  let offset = 0
  for (let i = 0; i < parts.length; i += 2) {
    const len = parts[i]
    const bytes = parts[i + 1]
    buffer[offset++] = len
    buffer.set(bytes, offset)
    offset += len
  }
  
  // Convert to base64url
  let str = ''
  for (let i = 0; i < buffer.length; i++) str += String.fromCharCode(buffer[i])
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function decodeGameData(b64url) {
  // Decode base64url to binary
  let b64 = b64url.replace(/-/g, '+').replace(/_/g, '/')
  while (b64.length % 4) b64 += '='
  const str = atob(b64)
  const buffer = new Uint8Array(str.length)
  for (let i = 0; i < str.length; i++) buffer[i] = str.charCodeAt(i)
  
  // Parse binary format
  const decoder = new TextDecoder()
  const categories = []
  let offset = 0
  
  for (let cat = 0; cat < 4; cat++) {
    // Read title
    const titleLen = buffer[offset++]
    const titleBytes = buffer.slice(offset, offset + titleLen)
    const title = decoder.decode(titleBytes)
    offset += titleLen
    
    // Read 4 words
    const words = []
    for (let w = 0; w < 4; w++) {
      const wordLen = buffer[offset++]
      const wordBytes = buffer.slice(offset, offset + wordLen)
      const word = decoder.decode(wordBytes)
      words.push(word)
      offset += wordLen
    }
    
    categories.push({ title, words })
  }
  
  return { categories }
}
import './style.css'
import { setupPage } from './setup.js'
import { gamePage } from './game.js'

class ConnectionsApp {
  constructor() {
    this.gameData = null
    this.currentPage = 'setup'
    
    // Handle browser back/forward navigation
    window.addEventListener('popstate', () => {
      this.handleNavigation()
    })
    
    // Initial navigation handling
    this.handleNavigation()
  }

  handleNavigation() {
    const params = new URLSearchParams(window.location.search)
    const path = window.location.pathname
    
    // Check if we have a game parameter
    if (params.has('game')) {
      try {
        const data = decodeGameData(params.get('game'))
        this.setGameData(data, true)
        return
      } catch (e) {
        // Invalid game data, redirect to setup
        this.redirectToSetup()
        return
      }
    }
    
    // Check if we're on an unrecognized path (not root or base path)
    const basePath = import.meta.env.BASE_URL || '/'
    const isValidPath = path === basePath || path === basePath.replace(/\/$/, '') || path === '/'
    
    if (!isValidPath) {
      // Redirect to setup page for unrecognized paths
      this.redirectToSetup()
      return
    }
    
    // Default to setup page
    this.showSetup()
  }

  redirectToSetup() {
    const basePath = import.meta.env.BASE_URL || '/'
    const url = new URL(basePath, window.location.origin)
    window.history.replaceState({}, '', url)
    this.showSetup()
  }

  init() {
    this.render()
  }

  setGameData(data, fromUrl = false) {
    // Attach color to each category for later use
    const categoryColors = ['yellow', 'blue', 'green', 'purple']
    data.categories.forEach((cat, i) => {
      if (!cat.color) cat.color = categoryColors[i]
    })
    this.gameData = data
    if (!fromUrl) {
      // Set ?game= param in url
      const encoded = encodeGameData(data)
      const basePath = import.meta.env.BASE_URL || '/'
      const url = new URL(basePath, window.location.origin)
      url.searchParams.set('game', encoded)
      window.history.pushState({}, '', url)
    }
    this.showGame()
  }

  showSetup() {
    this.currentPage = 'setup'
    // Clear game parameter from URL when going back to setup
    const basePath = import.meta.env.BASE_URL || '/'
    const url = new URL(basePath, window.location.origin)
    url.searchParams.delete('game')
    window.history.pushState({}, '', url)
    this.render()
  }

  showGame() {
    this.currentPage = 'game'
    this.render()
  }

  render() {
    const app = document.querySelector('#app')
    
    if (this.currentPage === 'setup') {
      app.innerHTML = setupPage()
      this.initSetupPage()
    } else if (this.currentPage === 'game') {
      app.innerHTML = gamePage(this.gameData)
      this.initGamePage()
    }
  }

  initSetupPage() {
    const form = document.querySelector('#setup-form')
    const startButton = document.querySelector('#start-game')
    const loadExampleButton = document.querySelector('#load-example')

    // Load example data
    loadExampleButton.addEventListener('click', () => {
      const exampleData = [
        { title: "Colors", words: ["Red", "Blue", "Green", "Yellow"] },
        { title: "Animals", words: ["Cat", "Dog", "Bird", "Fish"] },
        { title: "Fruits", words: ["Apple", "Orange", "Banana", "Grape"] },
        { title: "Sports", words: ["Soccer", "Tennis", "Baseball", "Basketball"] }
      ]
      
      exampleData.forEach((category, i) => {
        document.querySelector(`#category-${i + 1}-title`).value = category.title
        category.words.forEach((word, j) => {
          document.querySelector(`#category-${i + 1}-word-${j + 1}`).value = word
        })
      })
    })

    startButton.addEventListener('click', (e) => {
      e.preventDefault()
      
      const categories = []
      for (let i = 1; i <= 4; i++) {
        const categoryTitle = document.querySelector(`#category-${i}-title`).value.trim()
        const words = [
          document.querySelector(`#category-${i}-word-1`).value.trim(),
          document.querySelector(`#category-${i}-word-2`).value.trim(),
          document.querySelector(`#category-${i}-word-3`).value.trim(),
          document.querySelector(`#category-${i}-word-4`).value.trim()
        ]
        
        if (!categoryTitle || words.some(word => !word)) {
          alert(`Please fill in all fields for category ${i}`)
          return
        }
        
        categories.push({ title: categoryTitle, words })
      }
      
      this.setGameData({ categories })
    })
  }

  initGamePage() {
    // Game logic will be implemented here
    const backButton = document.querySelector('#back-to-setup')
    const restartButton = document.querySelector('#restart-game')
    
    if (backButton) {
      backButton.addEventListener('click', () => this.showSetup())
    }
    
    if (restartButton) {
      restartButton.addEventListener('click', () => this.showGame())
    }
    
    // Initialize the game logic
    this.initGame()
  }

  initGame() {
    let selectedWords = []
    let foundCategories = []
    let attempts = 4
    const maxAttempts = 4

    // Shuffle all words
    const allWords = this.gameData.categories.flatMap(cat => cat.words)
    const shuffledWords = this.shuffleArray([...allWords])

    // Render word grid
    this.renderWordGrid(shuffledWords)

    // Add click handlers for words
    const wordButtons = document.querySelectorAll('.word-button')
    wordButtons.forEach(button => {
      button.addEventListener('click', () => {
        const word = button.textContent
        
        if (selectedWords.includes(word)) {
          // Deselect word
          selectedWords = selectedWords.filter(w => w !== word)
          button.classList.remove('selected')
        } else if (selectedWords.length < 4) {
          // Select word
          selectedWords.push(word)
          button.classList.add('selected')
        }
        
        this.updateSubmitButton(selectedWords.length === 4)
      })
    })

    // Submit button handler
    const submitButton = document.querySelector('#submit-guess')
    submitButton.addEventListener('click', () => {
      if (selectedWords.length !== 4) return

      const category = this.findCategory(selectedWords)
      
      if (category) {
        // Correct guess
        foundCategories.push(category)
        this.markCategoryFound(category, selectedWords)
        selectedWords = []
        
        if (foundCategories.length === 4) {
          this.showWinMessage()
        }
      } else {
        // Wrong guess - animate the selected words
        this.animateIncorrectGuess(selectedWords)
        attempts--
        
        // Check if user was "one away" (3 out of 4 correct)
        const isOneAway = this.checkOneAway(selectedWords)
        this.showIncorrectGuess(attempts, isOneAway)
        
        if (attempts === 0) {
          setTimeout(() => this.showGameOver(), 1000)
        }
      }
      
      // Clear selection after animation
      setTimeout(() => {
        wordButtons.forEach(btn => btn.classList.remove('selected'))
        selectedWords = []
        this.updateSubmitButton(false)
      }, 600)
    })
  }

  shuffleArray(array) {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  renderWordGrid(words) {
    const grid = document.querySelector('#word-grid')
    grid.innerHTML = words.map(word => 
      `<button class="word-button">${word}</button>`
    ).join('')
  }

  findCategory(selectedWords) {
    return this.gameData.categories.find(category => 
      category.words.every(word => selectedWords.includes(word)) &&
      selectedWords.every(word => category.words.includes(word))
    )
  }

  markCategoryFound(category, words) {
    // Remove the found words from the grid completely
    const wordButtons = document.querySelectorAll('.word-button')
    wordButtons.forEach(button => {
      if (words.includes(button.textContent)) {
        button.remove()
      }
    })

    // Add category to found list at the top, with color class
    const foundList = document.querySelector('#found-categories')
    const categoryDiv = document.createElement('div')
    categoryDiv.className = `found-category category-${category.color}`
    categoryDiv.innerHTML = `
      <h3>${category.title}</h3>
      <p>${category.words.join(', ')}</p>
    `
    foundList.appendChild(categoryDiv)

    // Update feedback
    const feedback = document.querySelector('#game-feedback')
    feedback.textContent = `Great! You found "${category.title}"`
    feedback.className = 'feedback success'

    // Clear the success message after a short delay
    setTimeout(() => {
      if (foundList.children.length < 4) {
        feedback.textContent = 'Select 4 words that belong together'
        feedback.className = 'feedback'
      }
    }, 2000)
  }

  updateSubmitButton(enabled) {
    const submitButton = document.querySelector('#submit-guess')
    submitButton.disabled = !enabled
  }

  animateIncorrectGuess(selectedWords) {
    const wordButtons = document.querySelectorAll('.word-button')
    wordButtons.forEach(button => {
      if (selectedWords.includes(button.textContent)) {
        button.classList.add('shake')
        // Remove shake class after animation
        setTimeout(() => {
          button.classList.remove('shake')
        }, 600)
      }
    })
  }

  checkOneAway(selectedWords) {
    // Check if exactly 3 of the 4 selected words belong to any category
    return this.gameData.categories.some(category => {
      const matches = selectedWords.filter(word => category.words.includes(word))
      return matches.length === 3
    })
  }

  showIncorrectGuess(attemptsLeft, isOneAway = false) {
    const feedback = document.querySelector('#game-feedback')
    
    // Update attempts indicator
    this.updateAttemptsIndicator(4 - attemptsLeft)
    
    if (isOneAway) {
      feedback.textContent = 'One away...'
      feedback.className = 'feedback warning'
    } else {
      const messages = [
        'Not quite...',
        'Try again!',
        'Keep looking...',
        'Almost there!'
      ]
      const randomMessage = messages[Math.floor(Math.random() * messages.length)]
      feedback.textContent = `${randomMessage} ${attemptsLeft} ${attemptsLeft === 1 ? 'attempt' : 'attempts'} remaining.`
      feedback.className = 'feedback error'
    }
    
    // Clear the message after a delay
    setTimeout(() => {
      feedback.textContent = 'Select 4 words that belong together'
      feedback.className = 'feedback'
    }, 2000)
  }

  updateAttemptsIndicator(attemptsUsed) {
    const dots = document.querySelectorAll('.attempt-dot')
    dots.forEach((dot, index) => {
      if (index < attemptsUsed) {
        dot.classList.add('used')
      } else {
        dot.classList.remove('used')
      }
    })
  }

  showWinMessage() {
    const feedback = document.querySelector('#game-feedback')
    feedback.textContent = 'Congratulations! You found all categories!'
    feedback.className = 'feedback success'
  }

  showGameOver() {
    const feedback = document.querySelector('#game-feedback')
    feedback.textContent = 'Game Over! Better luck next time.'
    feedback.className = 'feedback error'
    
    // Disable all word buttons
    document.querySelectorAll('.word-button').forEach(btn => btn.disabled = true)
  }
}

// Initialize the app
new ConnectionsApp()
