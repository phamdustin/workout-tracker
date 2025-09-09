import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Play, Pause, RotateCcw } from 'lucide-react-native';

import { newSession } from '@/utils/workoutService';
import { UserContext } from '@/context/UserContext'
import { useAuth } from '@/context/UserContext';

interface WorkoutHeaderProps {
  title: string;
  subtitle: string;
  duration: number;
}

export default function WorkoutHeader({ title, subtitle, duration }: WorkoutHeaderProps) {
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const [sessionCreated, setSessionCreated] = useState(false)
  const { userInfo } = useContext(UserContext)
  const { sessionId, setSessionId } = useAuth()

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTimer(timer => timer + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Using this temporarily to create a new session when clicked for the first time
  const toggleTimer =  async () => {
    setIsRunning(!isRunning);
    console.log(Date())
    if (!sessionCreated) {
      // create new session
      
      const session_Id = await newSession(userInfo.user_id, title)
      setSessionCreated(!sessionCreated)
      console.log("New session created")
      setSessionId(session_Id)
    } /* else {
        console.log(sessionId)
    }
 */
    
  };

  const resetTimer = () => {
    setTimer(0);
    setIsRunning(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.workoutInfo}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <Text style={styles.estimatedDuration}>Est. {duration} minutes</Text>
      </View>

      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatTime(timer)}</Text>
        
        <View style={styles.timerControls}>
          <TouchableOpacity
            style={[styles.timerButton, isRunning ? styles.pauseButton : styles.playButton]}
            onPress={toggleTimer}
          >
            {isRunning ? (
              <Pause size={16} color="#FFFFFF" />
            ) : (
              <Play size={16} color="#FFFFFF" />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.resetButton}
            onPress={resetTimer}
          >
            <RotateCcw size={16} color="#64748B" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  workoutInfo: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 8,
  },
  estimatedDuration: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
  },
  timerText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1E293B',
    fontFamily: 'monospace',
  },
  timerControls: {
    flexDirection: 'row',
    gap: 8,
  },
  timerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: '#059669',
  },
  pauseButton: {
    backgroundColor: '#EA580C',
  },
  resetButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
});