// Progress Tracker for Kinyarwanda Learning App

// Constants for total items in each category
const TOTAL_ITEMS = {
    food: 8, // 8 food flashcards
    numbers: 10, // 10 number flashcards
    colors: 10, // 10 color flashcards
    greetings: 7, // 7 greeting flashcards
  }
  
  // Initialize user progress from localStorage or with default values
  function initializeProgress() {
    // Check if progress data exists
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
      saveProgress(defaultProgress)
      return defaultProgress
    }
  
    // Return existing progress data
    return JSON.parse(localStorage.getItem("kinyarwandaProgress"))
  }
  
  // Save progress to localStorage
  function saveProgress(progressData) {
    localStorage.setItem("kinyarwandaProgress", JSON.stringify(progressData))
  }
  
  // Update UI with current progress
  function updateProgressUI(progressData) {
    // Update overall stats
    const totalFlashcards =
      progressData.flashcards.food.length +
      progressData.flashcards.numbers.length +
      progressData.flashcards.colors.length +
      progressData.flashcards.greetings.length
  
    const totalPossibleFlashcards = TOTAL_ITEMS.food + TOTAL_ITEMS.numbers + TOTAL_ITEMS.colors + TOTAL_ITEMS.greetings
  
    const overallProgress = Math.round((totalFlashcards / totalPossibleFlashcards) * 100)
  
    document.getElementById("overall-progress").style.width = `${overallProgress}%`
    document.getElementById("overall-percentage").textContent = `${overallProgress}%`
    document.getElementById("flashcards-viewed").textContent = totalFlashcards
  
    // Average quiz score
    const totalQuizScore =
      (progressData.quizScores.food +
        progressData.quizScores.numbers +
        progressData.quizScores.colors +
        progressData.quizScores.greetings) /
      4
  
    document.getElementById("quiz-score").textContent = `${Math.round(totalQuizScore)}%`
    document.getElementById("study-streak").textContent = progressData.streak
  
    // Update category progress
    updateCategoryProgress("food", progressData)
    updateCategoryProgress("numbers", progressData)
    updateCategoryProgress("colors", progressData)
    updateCategoryProgress("greetings", progressData)
  
    // Update achievements
    updateAchievements(progressData)
  }
  
  // Update progress for a specific category
  function updateCategoryProgress(category, progressData) {
    const flashcardsViewed = progressData.flashcards[category].length
    const flashcardsTotal = TOTAL_ITEMS[category]
    const flashcardsPercentage = Math.round((flashcardsViewed / flashcardsTotal) * 100)
  
    document.getElementById(`${category}-progress-bar`).style.width = `${flashcardsPercentage}%`
    document.getElementById(`${category}-progress-text`).textContent = `${flashcardsViewed}/${flashcardsTotal}`
  
    document.getElementById(`${category}-quiz-bar`).style.width = `${progressData.quizScores[category]}%`
    document.getElementById(`${category}-quiz-text`).textContent = `${progressData.quizScores[category]}%`
  }
  
  // Update achievements display
  function updateAchievements(progressData) {
    // For each achievement, remove opacity if achieved
    const achievements = progressData.achievements
  
    for (const [key, value] of Object.entries(achievements)) {
      let elementId
  
      switch (key) {
        case "firstDay":
          elementId = "achievement-first-day"
          break
        case "allFood":
          elementId = "achievement-all-food"
          break
        case "allNumbers":
          elementId = "achievement-all-numbers"
          break
        case "allColors":
          elementId = "achievement-all-colors"
          break
        case "allGreetings":
          elementId = "achievement-all-greetings"
          break
        case "perfectQuiz":
          elementId = "achievement-perfect-quiz"
          break
        case "streak3":
          elementId = "achievement-streak-3"
          break
        case "allCategories":
          elementId = "achievement-all-categories"
          break
      }
  
      if (value && elementId) {
        const element = document.getElementById(elementId)
        if (element) {
          element.classList.remove("opacity-50")
        }
      }
    }
  }
  
  // Check and update streak
  function updateStreak(progressData) {
    const lastVisit = new Date(progressData.lastVisit)
    const today = new Date()
  
    // Reset dates to start of day for comparison
    lastVisit.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)
  
    // Calculate difference in days
    const timeDiff = today.getTime() - lastVisit.getTime()
    const dayDiff = Math.round(timeDiff / (1000 * 3600 * 24))
  
    if (dayDiff === 1) {
      // Consecutive day
      progressData.streak += 1
    } else if (dayDiff > 1) {
      // Streak broken
      progressData.streak = 1
    } else if (dayDiff === 0) {
      // Same day, don't change streak but also don't increment
    }
  
    // Check streak achievement
    if (progressData.streak >= 3) {
      progressData.achievements.streak3 = true
    }
  
    // Update last visit
    progressData.lastVisit = today.toISOString()
    return progressData
  }
  
  // Check and update achievements
  function checkAchievements(progressData) {
    // First day achievement
    progressData.achievements.firstDay = true
  
    // Category completion achievements
    progressData.achievements.allFood = progressData.flashcards.food.length === TOTAL_ITEMS.food
  
    progressData.achievements.allNumbers = progressData.flashcards.numbers.length === TOTAL_ITEMS.numbers
  
    progressData.achievements.allColors = progressData.flashcards.colors.length === TOTAL_ITEMS.colors
  
    progressData.achievements.allGreetings = progressData.flashcards.greetings.length === TOTAL_ITEMS.greetings
  
    // Perfect quiz achievement
    progressData.achievements.perfectQuiz = Object.values(progressData.quizScores).some((score) => score === 100)
  
    // All categories achievement
    progressData.achievements.allCategories =
      progressData.achievements.allFood &&
      progressData.achievements.allNumbers &&
      progressData.achievements.allColors &&
      progressData.achievements.allGreetings
  
    return progressData
  }
  
  // Initialize page
  document.addEventListener("DOMContentLoaded", () => {
    let progressData = initializeProgress()
  
    // Update streak information
    progressData = updateStreak(progressData)
  
    // Check for achievements
    progressData = checkAchievements(progressData)
  
    // Save updated progress
    saveProgress(progressData)
  
    // Update UI with current progress
    updateProgressUI(progressData)
  })
  
  