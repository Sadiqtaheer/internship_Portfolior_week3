// Tournament Records Management System
let players = [];
let playerIdCounter = 1;
let isShowingTop3 = false;
let originalPlayers = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadSampleData();
    updateTable();
    
    // Add form submission event listener
    document.getElementById('addPlayerForm').addEventListener('submit', addPlayer);
});

// Load some sample data for demonstration
function loadSampleData() {
    const samplePlayers = [
        { id: 1, name: 'Steven', score: 450, duration: 45 },
        { id: 2, name: 'Emanuel', score: 550, duration: 38 },
        { id: 3, name: 'Evans', score: 350, duration: 52 },
        { id: 4, name: 'Stella', score: 250, duration: 41 },
        { id: 5, name: 'David', score: 150, duration: 35 }
    ];
    
    players = [...samplePlayers];
    originalPlayers = [...samplePlayers];
    playerIdCounter = 6;
}

// Add new player
function addPlayer(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const duration = parseInt(document.getElementById('duration').value);
    const score = parseInt(document.getElementById('score').value);
    
    // Validation
    if (!name || duration <= 0 || score < 0) {
        alert('Please enter valid player information!');
        return;
    }
    
    // Check if player already exists
    if (players.some(player => player.name.toLowerCase() === name.toLowerCase())) {
        alert('Player with this name already exists!');
        return;
    }
    
    // Create new player
    const newPlayer = {
        id: playerIdCounter++,
        name: name,
        score: score,
        duration: duration
    };
    
    players.push(newPlayer);
    originalPlayers.push(newPlayer);
    
    // Reset form
    document.getElementById('addPlayerForm').reset();
    
    // Update table
    updateTable();
    
    // Show success message
    showNotification(`Player "${name}" added successfully!`, 'success');
}

// Update the table display
function updateTable() {
    const tbody = document.querySelector('#recordsTable tbody');
    tbody.innerHTML = '';
    
    if (players.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="font-style: italic; color: #888;">No players found</td></tr>';
        return;
    }
    
    // Sort players by score (descending) to determine positions
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    
    sortedPlayers.forEach((player, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${player.name}</td>
            <td>${player.score.toLocaleString()}</td>
            <td>${player.duration}</td>
            <td>${getPositionDisplay(index + 1)}</td>
            <td>
                <button onclick="removePlayer(${player.id})" style="background: linear-gradient(135deg, #ff4444, #cc0000); font-size: 0.8rem; padding: 0.4rem 0.8rem;">
                    Remove
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Get position display with medals for top 3
function getPositionDisplay(position) {
    switch(position) {
        case 1: return '1st';
        case 2: return '2nd';
        case 3: return '3rd';
        default: return `${position}${getOrdinalSuffix(position)}`;
    }
}

// Get ordinal suffix for numbers
function getOrdinalSuffix(num) {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return 'st';
    if (j === 2 && k !== 12) return 'nd';
    if (j === 3 && k !== 13) return 'rd';
    return 'th';
}

// Remove player
function removePlayer(playerId) {
    const player = players.find(p => p.id === playerId);
    if (!player) return;
    
    if (confirm(`Are you sure you want to remove "${player.name}"?`)) {
        players = players.filter(p => p.id !== playerId);
        originalPlayers = originalPlayers.filter(p => p.id !== playerId);
        updateTable();
        showNotification(`Player "${player.name}" removed successfully!`, 'info');
    }
}

// Sort by duration (time played)
function sortByDuration() {
    if (isShowingTop3) {
        resetTable();
    }
    
    players.sort((a, b) => b.duration - a.duration);
    updateTable();
    showNotification('Players sorted by time played!', 'info');
}

// Show top 3 players
function showTop3Players() {
    if (players.length === 0) {
        alert('No players to display!');
        return;
    }
    
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    players = sortedPlayers.slice(0, 3);
    isShowingTop3 = true;
    updateTable();
    showNotification('Showing top 3 players!', 'success');
}

// Reset table to original state
function resetTable() {
    players = [...originalPlayers];
    isShowingTop3 = false;
    updateTable();
    showNotification('Table reset to original state!', 'info');
}

// Show notification messages
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #00ff88, #00cc66)' : 
                     type === 'error' ? 'linear-gradient(135deg, #ff4444, #cc0000)' : 
                     'linear-gradient(135deg, #00ffff, #00cccc)'};
        color: #000;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        font-weight: 600;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0, 255, 255, 0.3);
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Add slide-in animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
    
    // Add slide-out animation
    setTimeout(() => {
        const slideOutStyle = document.createElement('style');
        slideOutStyle.textContent = `
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(slideOutStyle);
    }, 100);
}

// Add some keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + R to reset table
    if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
        event.preventDefault();
        resetTable();
    }
    
    // Ctrl/Cmd + T to show top 3
    if ((event.ctrlKey || event.metaKey) && event.key === 't') {
        event.preventDefault();
        showTop3Players();
    }
    
    // Ctrl/Cmd + S to sort by duration
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        sortByDuration();
    }
});

// Add some additional utility functions
function getPlayerStats() {
    if (players.length === 0) return null;
    
    const scores = players.map(p => p.score);
    const durations = players.map(p => p.duration);
    
    return {
        totalPlayers: players.length,
        averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
        highestScore: Math.max(...scores),
        lowestScore: Math.min(...scores),
        averageDuration: Math.round(durations.reduce((a, b) => a + b, 0) / durations.length),
        longestDuration: Math.max(...durations),
        shortestDuration: Math.min(...durations)
    };
}

// Console commands for debugging/testing
window.gameConsole = {
    addRandomPlayer: function() {
        const names = ['GamerX', 'ProPlayer', 'SkillMaster', 'EliteGamer', 'ChampionX'];
        const randomName = names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 1000);
        const randomScore = Math.floor(Math.random() * 5000) + 1000;
        const randomDuration = Math.floor(Math.random() * 60) + 20;
        
        players.push({
            id: playerIdCounter++,
            name: randomName,
            score: randomScore,
            duration: randomDuration
        });
        
        updateTable();
        console.log(`Added random player: ${randomName} - scripts.js:293`);
    },
    
    getStats: function() {
        console.log('Player Statistics: - scripts.js:297', getPlayerStats());
    },
    
    clearAll: function() {
        players = [];
        originalPlayers = [];
        updateTable();
        console.log('All players cleared! - scripts.js:304');
    }
};

console.log('🎮 Horizine Gaming Tournament System Loaded! - scripts.js:308');
console.log('Available console commands: - scripts.js:309');
console.log('- gameConsole.addRandomPlayer() - Add a random player - scripts.js:310');
console.log('- gameConsole.getStats() - Show player statistics - scripts.js:311');
console.log('- gameConsole.clearAll() - Clear all players - scripts.js:312');
console.log('');
console.log('Keyboard shortcuts: - scripts.js:314');
console.log('- Ctrl/Cmd + R: Reset table - scripts.js:315');
console.log('- Ctrl/Cmd + T: Show top 3 players - scripts.js:316');
console.log('- Ctrl/Cmd + S: Sort by duration - scripts.js:317');