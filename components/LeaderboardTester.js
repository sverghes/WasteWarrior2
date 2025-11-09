/**
 * Quick Leaderboard Test Component
 * Add this temporarily to Dashboard or Settings to test leaderboard functionality
 */

import React, { useState } from "react";
import { populateTestData, clearTestData, addCurrentUserTestData, verifyLeaderboardData } from "../utils/leaderboardTest";

const LeaderboardTester = ({ department = "Theatre" }) => {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePopulateData = async () => {
    setLoading(true);
    setStatus("🔄 Adding mock users to Firebase...");
    
    const success = await populateTestData();
    if (success) {
      setStatus("✅ Successfully added 8 mock users to leaderboard!");
    } else {
      setStatus("❌ Failed to add mock data. Check console for errors.");
    }
    setLoading(false);
  };

  const handleAddCurrentUser = async () => {
    setLoading(true);
    setStatus(`🔄 Adding your test user (${department})...`);
    
    const success = await addCurrentUserTestData(department);
    if (success) {
      setStatus(`✅ Added you as test user in ${department} department!`);
    } else {
      setStatus("❌ Failed to add your test data. Check console for errors.");
    }
    setLoading(false);
  };

  const handleVerifyData = async () => {
    setLoading(true);
    setStatus("🔍 Checking leaderboard data...");
    
    const success = await verifyLeaderboardData();
    if (success) {
      setStatus("✅ Leaderboard data verified. Check console for details.");
    } else {
      setStatus("❌ No data found or verification failed.");
    }
    setLoading(false);
  };

  const handleClearData = async () => {
    setLoading(true);
    setStatus("🧹 Clearing all test data...");
    
    const success = await clearTestData();
    if (success) {
      setStatus("✅ All test data cleared from Firebase.");
    } else {
      setStatus("❌ Failed to clear data. Check console for errors.");
    }
    setLoading(false);
  };

  const testButtonStyle = {
    padding: "8px 16px",
    margin: "4px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.6 : 1,
    fontSize: "14px"
  };

  const clearButtonStyle = {
    ...testButtonStyle,
    backgroundColor: "#f44336"
  };

  const containerStyle = {
    padding: "20px",
    margin: "20px",
    border: "2px dashed #ccc",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9"
  };

  return (
    <div style={containerStyle}>
      <h3>🧪 Leaderboard Testing</h3>
      <p><strong>Department:</strong> {department}</p>
      
      <div>
        <button 
          style={testButtonStyle}
          onClick={handlePopulateData}
          disabled={loading}
        >
          Add Mock Users
        </button>
        
        <button 
          style={testButtonStyle}
          onClick={handleAddCurrentUser}
          disabled={loading}
        >
          Add Test User (You)
        </button>
        
        <button 
          style={testButtonStyle}
          onClick={handleVerifyData}
          disabled={loading}
        >
          Verify Data
        </button>
        
        <button 
          style={clearButtonStyle}
          onClick={handleClearData}
          disabled={loading}
        >
          Clear All Data
        </button>
      </div>
      
      {status && (
        <div style={{ 
          marginTop: "15px", 
          padding: "10px", 
          backgroundColor: "#fff", 
          border: "1px solid #ddd",
          borderRadius: "4px",
          fontSize: "14px"
        }}>
          {status}
        </div>
      )}
      
      <div style={{ marginTop: "15px", fontSize: "12px", color: "#666" }}>
        <strong>Test Flow:</strong>
        <ol>
          <li>Click "Add Mock Users" to populate Firebase</li>
          <li>Click "Add Test User" to add yourself</li>
          <li>Go to Settings → Leaderboard to see results</li>
          <li>Click "Clear All Data" when done testing</li>
        </ol>
      </div>
    </div>
  );
};

export default LeaderboardTester;