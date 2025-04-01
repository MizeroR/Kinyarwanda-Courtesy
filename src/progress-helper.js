// Progress Helper for Kinyarwanda Learning App
// This file should be included in every flashcard and quiz page

// Constants for total items in each category
const TOTAL_ITEMS = {
    food: 8, // 8 food flashcards
    numbers: 10, // 10 number flashcards
    colors: 10, // 10 color flashcards
    greetings: 7, // 7 greeting flashcards
  }
  
  // Get progress data from localStorage
  function getProgressData() {
    if (!localStorage.getItem("kinyarwandaProgress")) {
      // Set default progress data
      const defaultProgress = {
        lastVisit: new Date().toISOString(),
        streak: 0,
        flashcards: {
          food: [],
          numbers: [],
          colors: [],
          greetings: [],
        },
        quizScores: {
          food: 0,
          numbers: 0,
          colors: 0,
          greetings: 0,
        },
        achievements: {
          firstDay: false,
          allFood: false,
          allNumbers: false,
          allColors: false,
          allGreetings: false,
          perfectQuiz: false,
          streak3: false,
          allCategories: false,
        },
      }
      localStorage.setItem("kinyarwandaProgress", JSON.stringify(defaultProgress))
      return defaultProgress
    }
  
    return JSON.parse(localStorage.getItem("kinyarwandaProgress"))
  }
  
  // Save progress data to localStorage
  function saveProgressData(progressData) {
    localStorage.setItem("kinyarwandaProgress", JSON.stringify(progressData))
  }
  
  // Track viewed flashcard
  function trackFlashcard(category, flashcardId) {
    const progressData = getProgressData()
  
    // Check if this flashcard has already been viewed
    if (!progressData.flashcards[category].includes(flashcardId)) {
      progressData.flashcards[category].push(flashcardId)
      saveProgressData(progressData)
    }
  }
  
  // Track quiz score
  function trackQuizScore(category, score) {
    const progressData = getProgressData()
  
    // Update the score if it's better than the previous one
    if (score > progressData.quizScores[category]) {
      progressData.quizScores[category] = score
  
      // Check for perfect quiz achievement
      if (score === 100) {
        progressData.achievements.perfectQuiz = true
      }
  
      saveProgressData(progressData)
    }
  }
  
  // Reset progress (for testing)
  function resetProgress() {
    localStorage.removeItem("kinyarwandaProgress")
    alert("Progress has been reset")
    location.reload()
  }
  
  