import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  User, 
  Target, 
  Trophy, 
  Calendar,
  TrendingUp,
  Settings 
} from 'lucide-react-native';
import { getUserStats } from '@/utils/workoutData';
import { UserStats } from '@/types/workout';

import { UserContext } from '@/context/UserContext';
import { supabase } from '@/utils/supabase';

export default function ProfileScreen() {
  const [userStats, setUserStats] = useState<UserStats | null>(null);

  const { user } = useContext(UserContext) 
  


  useEffect(() => {
    setUserStats(getUserStats());
  }, []);

  if (!user){

    return (
      <Text>Loading...</Text>
    )
  }  
  
  if (!userStats) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <User size={48} color="#2563EB" />
          </View>
          <Text style={styles.userName}>{userStats.name}</Text>
          <Text style={styles.userSubtitle}>Fitness Enthusiast</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Calendar size={24} color="#059669" />
            <Text style={styles.statNumber}>{userStats.totalWorkouts}</Text>
            <Text style={styles.statLabel}>Total Workouts</Text>
          </View>
          
          <View style={styles.statCard}>
            <Trophy size={24} color="#EA580C" />
            <Text style={styles.statNumber}>{userStats.currentStreak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          
          <View style={styles.statCard}>
            <TrendingUp size={24} color="#2563EB" />
            <Text style={styles.statNumber}>{userStats.personalRecords}</Text>
            <Text style={styles.statLabel}>Personal Records</Text>
          </View>
          
          <View style={styles.statCard}>
            <Target size={24} color="#7C3AED" />
            <Text style={styles.statNumber}>{userStats.totalVolume}k</Text>
            <Text style={styles.statLabel}>Total Volume (lbs)</Text>
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Month's Progress</Text>
          
          <View style={styles.progressCard}>
            <View style={styles.progressItem}>
              <Text style={styles.progressLabel}>Workouts Completed</Text>
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBar, 
                    { width: `${(userStats.monthlyWorkouts / userStats.monthlyGoal) * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {userStats.monthlyWorkouts}/{userStats.monthlyGoal}
              </Text>
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          
          {userStats.recentAchievements.map((achievement, index) => (
            <View key={index} style={styles.achievementCard}>
              <Trophy size={20} color="#EA580C" />
              <View style={styles.achievementContent}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>{achievement.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Settings */}
        <TouchableOpacity style={styles.settingsButton}>
          <Settings size={20} color="#64748B" />
          <Text style={styles.settingsText}>Settings & Preferences</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EBF3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  userSubtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  section: {
    margin: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  progressItem: {
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
    textAlign: 'right',
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  achievementContent: {
    marginLeft: 12,
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#64748B',
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  settingsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    marginLeft: 12,
  },
});