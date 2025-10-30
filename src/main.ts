import type { PlatformMessage } from './types.ts';

/**
 * Get a parameter from the hash (!#p=1&difficulty=2&muted=1)
 *
 * @param key The key of the parameter
 * @returns The value of the parameter or null if the parameter is not found
 */
function getHashParams(key: string): string | null {
  const hash = window.location.hash.replace(/^#!?/, '')
  return new URLSearchParams(hash).get(key);
}

/**
 * Get a parameter from the url (?p=1&difficulty=2&muted=1)
 *
 * @param key The key of the parameter
 * @returns The value of the parameter or null if the parameter is not found
 */
function getUrlParam(name: string): string | null {
  return new URLSearchParams(window.location.search).get(name);
}

/**
 * Get a parameter from the platform
 *
 * @param key The key of the parameter
 * @returns The value of the parameter or null if the parameter is not found
 */
export function getPlatformParam(key: string): string | null {
  return getHashParams(key) || getUrlParam(key);
}

/**
 * Check if the game is running in the SuperFive platform
 *
 * @returns True if the game is in platform mode, false otherwise
 */
export function isInPlatformMode(): boolean {
  return getPlatformParam('p') === '1';
}

/**
 * Check if the game should start muted
 *
 * @returns True if the game should start muted, false otherwise
 */
export function startMuted(): boolean {
  return getPlatformParam('muted') === '1';
}

/**
 * Get the difficulty of the game
 *
 * The difficulty is a number between 0 and 2
 * - 0: Easy
 * - 1: Medium
 * - 2: Hard
 *
 * @returns The difficulty of the game as a number between 0 and 2
 */
export function getDifficulty(): number {
  return parseInt(getPlatformParam('difficulty') || '0', 10);
}

// ==============================================================
// Message Handling
// ==============================================================

/**
 * Subscribe to the platform's messages to handle platform events
 *
 * @returns void
 */
export function subscribeToPlatformMessages(): void {
  if (!isInPlatformMode()) return;
  window.addEventListener('message', handlePlatformMessage);
}

/**
 * Unsubscribe from the platform's messages
 *
 * @returns void
 */
export function unsubscribeFromPlatformMessages(): void {
  window.removeEventListener('message', handlePlatformMessage);
}

/**
 * Handle the platform's messages
 *
 * @param event The message event
 * @returns void
 */
function handlePlatformMessage(event: MessageEvent): void {
  const data = event.data;
  if (!data || !data.type) return;

  // Validate message shape
  if (typeof data.type !== 'string') return;

  // Emit custom event for game to handle
  const customEvent = new CustomEvent('platformMessage', { 
    detail: { type: data.type, payload: data.payload } 
  });
  window.dispatchEvent(customEvent);
}

// ==============================================================
// Sending Messages Methods
// ==============================================================

/**
 * Send a message to the platform
 *
 * @param type The type of the message
 * @param payload The payload of the message
 * @returns void
 */
export function sendPlatformMessage(type: PlatformMessage['type'], payload?: any): void {
  if (!isInPlatformMode()) return;
  const message: PlatformMessage = { type, payload };
  window.parent.postMessage(message, '*');
}

/**
 * Send a message to the platform to indicate that the game is ready (loaded and ready to play)
 *
 * @returns void
 */
export function sendReady(): void {
  sendPlatformMessage('game_ready');
}

/**
 * Send a message to the platform to indicate that the game is won
 *
 * @returns void
 */
export function sendWin(): void {
  sendPlatformMessage('game_won');
}

/**
 * Send a message to the platform to indicate that the game is lost
 *
 * @returns void
 */
export function sendLose(): void {
  sendPlatformMessage('game_lost');
}
