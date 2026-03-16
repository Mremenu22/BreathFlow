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
import { typography } from '../constants/typography';
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
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Breathing Techniques</Text>
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
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.bg.secondary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.text.tertiary,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  title: {
    ...typography.heading,
    color: colors.text.primary,
    marginBottom: 20,
  },
  techniqueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  techniqueRowSelected: {
    backgroundColor: colors.bg.tertiary,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 16,
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
    ...typography.body,
    fontFamily: 'Jost-SemiBold',
    color: colors.text.primary,
  },
  techniqueDesc: {
    ...typography.body,
    fontSize: 13,
    color: colors.text.secondary,
    marginTop: 2,
  },
  premiumBadge: {
    backgroundColor: colors.accent.dim,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  premiumText: {
    ...typography.label,
    fontSize: 9,
    color: colors.accent.secondary,
  },
});
