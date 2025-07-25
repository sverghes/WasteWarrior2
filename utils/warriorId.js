import { db } from "../firebase/firebaseConfig";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";

/**
 * Generates a unique user ID in the format TW#### or PW#### based on department
 * @param {string} department - "Theatre" or "Pathology"
 * @returns {Promise<string>} - Generated user ID
 */
export const generateWarriorId = async (department) => {
  const prefix = department === "Theatre" ? "TW" : "PW";
  
  try {
    if (!db) {
      // Fallback for offline mode - use random 4-digit number
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      return `${prefix}${randomNum}`;
    }

    // Reference to the counter document for this department
    const counterRef = doc(db, "counters", `${department.toLowerCase()}Warriors`);
    
    // Get current counter value
    const counterDoc = await getDoc(counterRef);
    
    let nextNumber;
    if (counterDoc.exists()) {
      // Increment the counter
      await updateDoc(counterRef, {
        count: increment(1)
      });
      nextNumber = counterDoc.data().count + 1;
    } else {
      // Initialize counter if it doesn't exist
      nextNumber = 1001; // Start from 1001 to ensure 4-digit format
      await setDoc(counterRef, {
        count: nextNumber,
        department: department,
        createdAt: new Date().toISOString()
      });
    }
    
    // Format as 4-digit number (pad with zeros if needed)
    const formattedNumber = nextNumber.toString().padStart(4, '0');
    return `${prefix}${formattedNumber}`;
    
  } catch (error) {
    console.log("Error generating warrior ID, using fallback:", error);
    // Fallback to random number if Firebase fails
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${randomNum}`;
  }
};

/**
 * Gets or creates a warrior ID for the current user
 * @param {string} department - "Theatre" or "Pathology"
 * @param {boolean} forceMigration - Force migration of old IDs (optional)
 * @returns {Promise<string>} - User's warrior ID
 */
export const getUserWarriorId = async (department, forceMigration = true) => {
  // Check if user already has a warrior ID
  let storedUserId = localStorage.getItem("warriorId");
  const storedDepartment = localStorage.getItem("department");
  const migrationFlag = localStorage.getItem("warriorIdMigrated");
  
  // Check if we need to migrate old format or generate new ID
  const hasOldFormat = storedUserId && !storedUserId.match(/^(TW|PW)\d{4}$/);
  const departmentChanged = storedDepartment !== department;
  const needsMigration = forceMigration && !migrationFlag && hasOldFormat;
  
  const needsNewId = !storedUserId || needsMigration || departmentChanged;
  
  if (needsNewId) {
    // Generate new warrior ID (migration or new user)
    storedUserId = await generateWarriorId(department);
    localStorage.setItem("warriorId", storedUserId);
    localStorage.setItem("department", department);
    localStorage.setItem("warriorIdMigrated", "true");
    
    // If this was a migration, log it
    if (needsMigration) {
      console.log("Migrated user to new warrior ID format:", storedUserId);
      // Optionally clean up old userId
      localStorage.removeItem("userId");
    }
  }
  
  return storedUserId;
};

/**
 * Formats a warrior name for display
 * @param {string} warriorId - The warrior ID (e.g., "TW1001")
 * @param {string} department - The department name
 * @returns {string} - Formatted display name (just the ID)
 */
export const formatWarriorName = (warriorId, department) => {
  return warriorId; // Return only the ID (e.g., "TW1001", "PW1001")
};
