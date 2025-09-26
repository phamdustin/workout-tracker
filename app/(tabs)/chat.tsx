import OpenAI from "openai";
import React, { useEffect, useState, useCallback } from "react";
import { View, ScrollView, Text, TextInput, Button, StyleSheet} from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GiftedChat, IMessage, BubbleProps, InputToolbar, Bubble } from 'react-native-gifted-chat';
import { BotMessage, UserMessage } from "@/types/message";


const BOT_USER = {
  _id: 2,
  name: 'Modern Bot',
  //avatar: 'https://placeimg.com/140/140/any', // Replace with a cool bot avatar
};

const USER = {
  _id: 1,
  name: 'User',
};

export default function ChatBot() {
  const [messages, setMessages] = useState<IMessage[]>([])
  const [inputText, setInputText] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const openai = new OpenAI({
      apiKey: process.env.EXPO_PUBLIC_OPENAI_KEY, dangerouslyAllowBrowser: true
    });
  
  useEffect(() => {
/*     const response = openai.responses.create({
      model: "gpt-5-nano",
      input: "write a haiku about ai",
      store: true,
    });
    
    response.then((result) => console.log(result.output_text)); */
    setMessages([
      {
        _id: 1,
        text: 'Hello! I am your virtual workout assistant. How can I assist you today? \nTry asking questions such as: \n1. What are good chest exercises? \n2. How do I perform a bench press? \n3. How much protein should I consume for muscle growth?',
        createdAt: new Date(),
        user: BOT_USER,
      },
    ]);
  }, [])

  const onSend = async (newMessages: IMessage[] = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
    
    setInputText("");
    // Simulate a bot response
    setIsTyping(true)
    try {
      const botResponseText = await openai.responses.create({
        model: "gpt-5-nano",
        input: newMessages[0].text,
        store: true
      })

      const data = await botResponseText
      const botResponse: BotMessage = {
        _id: Math.round(Math.random() * 1000000),
        text: botResponseText.output_text,
        createdAt: new Date(),
        user: BOT_USER,
      };

      setMessages(previousMessages => GiftedChat.append(previousMessages, [botResponse]));
    }
    catch (err){
      console.error(err)
    } finally {
      setIsTyping(false)
    }



    

  };

  // Customize the message bubbles
  const renderBubble = (props: BubbleProps<IMessage>) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: [styles.bubble, styles.leftBubble],
          right: [styles.bubble, styles.rightBubble],
        }}
      />
    );
  };

  // Customize the send button
  const renderSend = (props) => {
    return (
      <View style={{ marginRight: 10, marginBottom: 5 }}>
        <Icon.Button
          name="send"
          size={24}
          color="#007AFF"
          backgroundColor="transparent"
          underlayColor="transparent"
          onPress={() => {
            if (props.text && props.onSend) {
              props.onSend({ text: props.text.trim(), user: USER });
            }
          }}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={USER}
        renderBubble={renderBubble}
        renderInputToolbar={(props) => <InputToolbar {...props} containerStyle={styles.inputToolbar} />}
        renderSend={renderSend}
        placeholder="Type a message..."
        isTyping={isTyping}
        text={inputText}
        onInputTextChanged={setInputText}

      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  bubble: {
    padding: 8,
  },
  leftBubble: {
    backgroundColor: '#E5E5EA', // Light gray for bot messages
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 10,
  },
  rightBubble: {
    backgroundColor: '#007AFF', // Vibrant blue for user messages
    borderTopRightRadius: 0,
    borderBottomRightRadius: 10,
  },
  inputToolbar: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E8E8E8',
    borderTopWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  // Add other custom styles as needed
});