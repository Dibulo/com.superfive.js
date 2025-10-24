# SuperFive JS API

This is the JS API for the SuperFive.io gaming platform where players can compete in a hypercasual games tournament. Use it to adapt your game for the platform.

## API usage

```js
import {
  isInPlatformMode,
  subscribeToPlatformMessages
} from 'com.superfive.js'

// Check if the platform is loading this game
if (isInPlatformMode()) {

  // Subscribe to the platform's messages
  subscribeToPlatformMessages();
  window.addEventListener('platformMessage', (event: Event) => {
    const customEvent = event as CustomEvent;
    const { type } = customEvent.detail;

    if (type === 'game_restart') {
      this.yourRestartGame();
    }
  });

}
```

## API events

The platform can send the following events to your game:

### `platformMessage` (Custom Event)

This event is dispatched when the platform sends a message to your game. Listen for this event to handle platform communications.

**Event Structure:**
```js
{
  detail: {
    type: string,    // The message type
    payload: any     // Optional payload data
  }
}
```

**Available Message Types:**
- `game_restart` - Platform requests the game to (re)start
- `game_mute` - Platform requests the game to mute/unmute audio

**Example:**
```js
window.addEventListener('platformMessage', (event) => {
  const customEvent = event as CustomEvent;
  const { type, payload } = customEvent.detail;
  
  switch (type) {
    case 'game_restart':
      // Restart your game
      break;
    case 'game_mute':
      // Handle mute/unmute based on payload
      const isMuted = payload.muted;
      break;
  }
});
```

## API methods

### Platform Detection

#### `isInPlatformMode(): boolean`

Checks if the game is running within the SuperFive platform.

**Returns:** `boolean` - `true` if running in platform mode, `false` otherwise

**Example:**
```js
if (isInPlatformMode()) {
  // Game is running in SuperFive platform
  console.log('Platform mode detected');
}
```

#### `getDifficulty(): number`

Gets the difficulty level set by the platform.

**Returns:** `number` - Difficulty level (0-2)
- `0` - Easy (default)
- `1` - Medium  
- `2` - Hard

**Example:**
```js
const difficulty = getDifficulty();
console.log(`Game difficulty: ${difficulty}`);
```

#### `startMuted(): boolean`

The player can set if they want to play without sound effects.
This should be checked before starting the game or playing any sounds.

**Returns:** `boolean`

**Example:**
```js
const isMuted = startMuted();
console.log(`Game muted?: ${isMuted}`);
```

### Message Handling

#### `subscribeToPlatformMessages(): void`

Subscribes to platform messages. Call this when your game starts to receive platform events.

**Example:**
```js
// Subscribe to platform messages
subscribeToPlatformMessages();
```

#### `unsubscribeFromPlatformMessages(): void`

Unsubscribes from platform messages. Call this when your game is shutting down.

**Example:**
```js
// Clean up when game ends
unsubscribeFromPlatformMessages();
```

### Sending Messages to Platform

#### `sendPlatformMessage(type, payload?): void`

Sends a message to the SuperFive platform.

**Parameters:**
- `type` - Message type (see PlatformMessage types below)
- `payload` - Optional data to send with the message

**Example:**
```js
// Send custom message with data
sendPlatformMessage('custom_event', { score: 100 });
```

#### `sendReady(): void`

Notifies the platform that your game is loaded and ready to play.

**Example:**
```js
// When your game is fully loaded
sendReady();
```

#### `sendWin(): void`

Notifies the platform that the player has won the game.

**Example:**
```js
// When player completes the game successfully
sendWin();
```

#### `sendLose(): void`

Notifies the platform that the player has lost the game.

**Example:**
```js
// When player fails the game
sendLose();
```

### Message Types

The following message types can be sent to the platform:

```typescript
type PlatformMessageType = 
  | 'game_ready'    // Game is loaded and ready
  | 'game_won'      // Player won the game
  | 'game_lost'     // Player lost the game
  | 'game_restart'  // Platform requests restart
  | 'game_mute'     // Platform requests mute/unmute
```

# Game development

- The game should work in portrait (9:16)
- The game should work on desktop (mouse input) and mobile (touch input)
- The game should not start unless it receives the ``game_restart`` message from the platform
- The game should not play any music - only sound effects (the platform plays music)
- The game can have different difficulty levels (0 = 'Easy', 1 = 'Medium', 2 = 'Hard').
