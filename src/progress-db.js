import { db, doc, setDoc, getDoc, updateDoc } from './firebase-config.js';
import { getCurrentUser } from './auth.js';

// Constants for total items in each category
export const TOTAL_ITEMS = {
  food: 8,
  numbers: 10,
  colors: 10,
  greetings: 7,
};

// Get progress data from Firestore
export async function getProgressData() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      console.error("No user logged in");
      return null;
    }
    
    const progressRef = doc(db, "progress", user.uid);
    const progressSnap = await getDoc(progressRef);
    
    if (progressSnap.exists()) {
      return progressSnap.data();
    } else {
      // Create default progress data
      const defaultProgress = {
        userId: user.uid,
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
      };
      
      await setDoc(progressRef, defaultProgress);
      return defaultProgress;
    }
  } catch (error) {
    console.error("Error getting progress data:", error);
    return null;
  }
}

// Save progress data to Firestore
export async function saveProgressData(progressData) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      console.error("No user logged in");
      return;
    }
    
    const progressRef = doc(db, "progress", user.uid);
    await updateDoc(progressRef, progressData);
    console.log("Progress saved to database");
  } catch (error) {
    console.error("Error saving progress data:", error);
  }
}

// Track viewed flashcard
export async function trackFlashcard(category, flashcardId) {
  try {
    const progressData = await getProgressData();
    
    if (!progressData) {
      console.error("No progress data available");
      return;
    }
    
    // Check if this flashcard has already been viewed
    if (!progressData.flashcards[category].includes(flashcardId)) {
      progressData.flashcards[category].push(flashcardId);
      await saveProgressData(progressData);
      console.log(`Tracked flashcard ${flashcardId} in category ${category}`);
    }
  } catch (error) {
    console.error("Error tracking flashcard:", error);
  }
}

// Track quiz score
export async function trackQuizScore(category, score) {
  try {
    const progressData = await getProgressData();
    
    if (!progressData) {
      console.error("No progress data available");
      return;
    }
    
    // Update the score if it's better than the previous one
    if (score > progressData.quizScores[category]) {
      progressData.quizScores[category] = score;
      
      // Check for perfect quiz achievement
      if (score === 100) {
        progressData.achievements.perfectQuiz = true;
      }
      
      await saveProgressData(progressData);
      console.log(`Updated quiz score for ${category} to ${score}`);
    }
  } catch (error) {
    console.error("Error tracking quiz score:", error);
  }
}