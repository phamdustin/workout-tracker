import { IMessage } from 'react-native-gifted-chat';

export interface BotMessage extends IMessage {
  // Any custom bot-specific message properties can be added here
}

export interface UserMessage extends IMessage {
  // Any custom user-specific message properties can be added here
}