import { Platform } from 'react-native';

/**
 * Mobile API Client for ClipClash
 * Connects to the local web dev server.
 * 
 * NOTE: For physical device testing, replace 'localhost' with your machine's local IP address (e.g., '192.168.1.x').
 */

const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

export async function fetchLeaderboard() {
  try {
    const response = await fetch(`${BASE_URL}/api/leaderboard`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    // Return empty mock data on failure to prevent crashes
    return { rankings: [] };
  }
}

export async function fetchArenaData() {
  try {
    const response = await fetch(`${BASE_URL}/api/arena`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching arena data:', error);
    return null;
  }
}
