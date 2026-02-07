export interface PlatformMessage {
  type: 'game_ready' | 'game_won' | 'game_lost' | 'game_restart' | 'game_mute';
  payload?: any;
  eventKey?: string;
  version?: string;
}
