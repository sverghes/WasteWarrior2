import React, { useState } from "react";
import { resetDatabase, clearLeaderboard, resetCounters } from "../utils/databaseReset";

const DatabaseAdmin = ({ onClose }) => {
  const [isResetting, setIsResetting] = useState(false);
  const [lastReset, setLastReset] = useState(null);

  const handleFullReset = async () => {
    if (!confirm("⚠️ Are you sure you want to delete ALL users and reset counters?\n\nThis action cannot be undone!")) {
      return;
    }

    setIsResetting(true);
    try {
      const success = await resetDatabase();
      if (success) {
        setLastReset(new Date().toLocaleString());
        alert("✅ Database reset completed!\n\nAll users deleted and counters reset to TW1001/PW1001");
      } else {
        alert("❌ Database reset failed - check console for details");
      }
    } catch (error) {
      alert("❌ Error during reset: " + error.message);
    }
    setIsResetting(false);
  };

  const handleLeaderboardOnly = async () => {
    if (!confirm("Delete all leaderboard entries but keep counters?\n\nThis will remove all users but maintain current ID numbering.")) {
      return;
    }

    setIsResetting(true);
    try {
      const success = await clearLeaderboard();
      if (success) {
        alert("✅ Leaderboard cleared!\n\nAll users deleted, counters preserved");
      } else {
        alert("❌ Failed to clear leaderboard - check console");
      }
    } catch (error) {
      alert("❌ Error: " + error.message);
    }
    setIsResetting(false);
  };

  const handleCountersOnly = async () => {
    if (!confirm("Reset warrior ID counters to start from TW1001/PW1001?\n\nThis won't delete existing users.")) {
      return;
    }

    setIsResetting(true);
    try {
      const success = await resetCounters();
      if (success) {
        alert("✅ Counters reset!\n\nNext new users will get TW1001/PW1001");
      } else {
        alert("❌ Failed to reset counters - check console");
      }
    } catch (error) {
      alert("❌ Error: " + error.message);
    }
    setIsResetting(false);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 20000,
      color: 'white',
      fontFamily: 'DM Sans, sans-serif'
    }}>
      <div style={{
        background: 'white',
        color: 'black',
        padding: '30px',
        borderRadius: '16px',
        maxWidth: '500px',
        width: '90%',
        textAlign: 'center'
      }}>
        <h2 style={{ marginTop: 0, color: '#2F4F2F' }}>🛠️ Database Admin</h2>
        <p>Manage the WasteWarrior leaderboard database</p>
        
        {lastReset && (
          <div style={{ 
            background: '#e8f5e8', 
            padding: '10px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            color: '#2d5a2d'
          }}>
            Last reset: {lastReset}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button
            onClick={handleFullReset}
            disabled={isResetting}
            style={{
              background: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '15px 20px',
              borderRadius: '8px',
              cursor: isResetting ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            {isResetting ? '🔄 Resetting...' : '🗑️ Full Reset (Delete All + Reset Counters)'}
          </button>

          <button
            onClick={handleLeaderboardOnly}
            disabled={isResetting}
            style={{
              background: '#fd7e14',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              cursor: isResetting ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            🧹 Clear Leaderboard Only
          </button>

          <button
            onClick={handleCountersOnly}
            disabled={isResetting}
            style={{
              background: '#6f42c1',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              cursor: isResetting ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            🔄 Reset Counters Only
          </button>

          <button
            onClick={onClose}
            style={{
              background: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Cancel
          </button>
        </div>

        <div style={{ 
          marginTop: '20px', 
          fontSize: '12px', 
          color: '#666',
          textAlign: 'left'
        }}>
          <strong>Options explained:</strong><br/>
          • <strong>Full Reset:</strong> Deletes all users + resets IDs to TW1001/PW1001<br/>
          • <strong>Clear Leaderboard:</strong> Removes users but keeps current ID numbering<br/>
          • <strong>Reset Counters:</strong> Next new users get TW1001/PW1001 (keeps existing users)
        </div>
      </div>
    </div>
  );
};

export default DatabaseAdmin;
