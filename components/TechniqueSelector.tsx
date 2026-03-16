import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
} from 'react-native';
import { colors } from '../constants/colors';
import { techniques, BreathingTechnique } from '../constants/techniques';

interface TechniqueSelectorProps {
  visible: boolean;
  selectedId: string;
  onSelect: (technique: BreathingTechnique) => void;
  onClose: () => void;
}

export default function TechniqueSelector({
  visible,
  selectedId,
  onSelect,
  onClose,
}: TechniqueSelectorProps) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />
          <Text style={styles.title}>Choose Technique</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {techniques
              .filter((t) => t.id !== 'custom')
              .map((technique) => {
                const isSelected = technique.id === selectedId;
                return (
                  <TouchableOpacity
                    key={technique.id}
                    style={[
                      styles.techniqueRow,
                      isSelected && styles.techniqueRowSelected,
                    ]}
                    onPress={() => {
                      onSelect(technique);
                      onClose();
                    }}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[styles.colorDot, { backgroundColor: technique.color }]}
                    />
                    <View style={styles.techniqueInfo}>
                      <View style={styles.nameRow}>
                        <Text style={styles.techniqueName}>{technique.name}</Text>
                        {technique.isPremium && (
                          <View style={styles.premiumBadge}>
                            <Text style={styles.premiumText}>PRO</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.techniqueDesc}>{technique.description}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.bg.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.bg.secondary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
    maxHeight: '55%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.bg.tertiary,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Fraunces-SemiBold',
    fontSize: 20,
    color: colors.text.primary,
    marginBottom: 16,
  },
  techniqueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 4,
  },
  techniqueRowSelected: {
    backgroundColor: colors.bg.tertiary,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 14,
  },
  techniqueInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  techniqueName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  techniqueDesc: {
    fontSize: 13,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  premiumBadge: {
    backgroundColor: colors.accent.muted,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  premiumText: {
    fontFamily: 'DMMono-Regular',
    fontSize: 9,
    letterSpacing: 1.5,
    color: colors.accent.dark,
  },
});
