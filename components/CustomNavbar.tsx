import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Chrome as Home, ChartPie as PieChart, Target, User } from 'lucide-react-native';
import { useRouter, usePathname } from 'expo-router';

const navItems = [
  {
    icon: Home,
    label: 'Dashboard',
    path: '/',
    isActive: false,
  },
  {
    icon: PieChart,
    label: 'Portfolio',
    path: '/(app)/index2',
    isActive: true,
  },
  {
    icon: Target,
    label: 'Goals',
    path: '/(app)/index3',
    isActive: false,
  },
  {
    icon: User,
    label: 'Profile',
    path: '/(app)/index4',
    isActive: false,
  },
];

export default function CustomNavbar() {
  const router = useRouter();
  const currentPath = usePathname();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {navItems.map((item, index) => {
          const isActive = currentPath === item.path;
          return (
            <TouchableOpacity
              key={index}
              style={[styles.navItem, isActive && styles.activeNavItem]}
              onPress={() => router.push(item.path)}
            >
              <item.icon
                size={24}
                color={isActive ? '#000' : '#666'}
                style={styles.icon}
              />
              <Text style={[styles.label, isActive && styles.activeLabel]}>
                {item.label}
              </Text>
              {isActive && <View style={styles.activeDot} />}
            </TouchableOpacity>
          );
        })}
      </View>
      {Platform.OS === 'web' && <View style={styles.safeArea} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 8,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  activeNavItem: {
    backgroundColor: '#F7FFED',
    borderRadius: 12,
  },
  icon: {
    marginBottom: 4,
  },
  label: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
  },
  activeLabel: {
    fontFamily: 'Inter-Medium',
    color: '#000',
  },
  activeDot: {
    position: 'absolute',
    top: 8,
    right: 24,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C3FF4E',
  },
  safeArea: {
    height: Platform.OS === 'web' ? 16 : 0,
  },
});