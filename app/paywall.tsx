import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../constants/colors';

type PlanId = 'yearly' | 'monthly' | 'lifetime';

const plans = [
  { id: 'yearly' as PlanId, label: 'Yearly', price: '$29.99/yr', sub: '$2.50/mo \u00B7 Best value', trial: '3-day free trial' },
  { id: 'monthly' as PlanId, label: 'Monthly', price: '$4.99/mo', sub: null, trial: '3-day free trial' },
  { id: 'lifetime' as PlanId, label: 'Lifetime', price: '$59.99', sub: 'One-time purchase', trial: null },
];

export default function PaywallScreen() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('yearly');

  const features = [
    '5 expert breathing techniques',
    'Custom pattern builder',
    'Full session history',
    '7-day challenge replay',
  ];

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.closeButton}
        accessibilityLabel="Close"
        accessibilityRole="button"
      >
        <Text style={styles.closeText}>{'\u2715'}</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>{'Unlock Your\nFull Practice'}</Text>

        <View style={styles.features}>
          {features.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <Text style={styles.featureIcon}>{'\u2713'}</Text>
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </View>

        <View style={styles.plans}>
          {plans.map((plan) => {
            const isSelected = plan.id === selectedPlan;
            return (
              <TouchableOpacity
                key={plan.id}
                style={[styles.planCard, isSelected && styles.planCardSelected]}
                onPress={() => setSelectedPlan(plan.id)}
                activeOpacity={0.7}
                accessibilityLabel={plan.label + ' plan, ' + plan.price}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
              >
                <View style={[
                  styles.radioCircle,
                  isSelected && styles.radioCircleSelected,
                ]} />
                <View style={styles.planContent}>
                  <View style={styles.planHeader}>
                    <Text style={[styles.planLabel, isSelected && styles.planLabelSelected]}>
                      {plan.label}
                    </Text>
                    <Text style={[styles.planPrice, isSelected && styles.planPriceSelected]}>
                      {plan.price}
                    </Text>
                  </View>
                  {(plan.sub || plan.trial) && (
                    <Text style={styles.planSub}>
                      {[plan.sub, plan.trial].filter(Boolean).join(' \u00B7 ')}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.subscribeButton}
          activeOpacity={0.8}
          accessibilityLabel={selectedPlan === 'lifetime' ? 'Purchase lifetime plan' : 'Start free trial'}
          accessibilityRole="button"
        >
          <Text style={styles.subscribeText}>
            {selectedPlan === 'lifetime' ? 'Purchase' : 'Start Free Trial'}
          </Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <TouchableOpacity
            accessibilityLabel="Restore purchases"
            accessibilityRole="button"
          >
            <Text style={styles.footerLink}>Restore Purchases</Text>
          </TouchableOpacity>
          <Text style={styles.footerDot}>{'\u00B7'}</Text>
          <TouchableOpacity
            accessibilityLabel="Terms of service"
            accessibilityRole="link"
          >
            <Text style={styles.footerLink}>Terms</Text>
          </TouchableOpacity>
          <Text style={styles.footerDot}>{'\u00B7'}</Text>
          <TouchableOpacity
            accessibilityLabel="Privacy policy"
            accessibilityRole="link"
          >
            <Text style={styles.footerLink}>Privacy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 20,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 18,
    color: colors.text.tertiary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Fraunces-SemiBold',
    fontSize: 30,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 28,
    letterSpacing: -0.3,
  },
  features: {
    marginBottom: 32,
    gap: 10,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIcon: {
    fontSize: 14,
    color: colors.success,
    fontWeight: '700',
  },
  featureText: {
    fontSize: 15,
    color: colors.text.primary,
  },
  plans: {
    gap: 10,
    marginBottom: 24,
  },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 16,
    backgroundColor: colors.bg.secondary,
  },
  planCardSelected: {
    borderColor: colors.accent.primary,
    backgroundColor: colors.bg.secondary,
  },
  radioCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginRight: 12,
  },
  radioCircleSelected: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  planContent: {
    flex: 1,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  planLabelSelected: {
    color: colors.text.primary,
  },
  planPrice: {
    fontFamily: 'DMMono-Medium',
    fontSize: 14,
    color: colors.text.secondary,
  },
  planPriceSelected: {
    color: colors.accent.primary,
  },
  planSub: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: 4,
  },
  subscribeButton: {
    backgroundColor: colors.accent.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: colors.text.primary,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  subscribeText: {
    fontFamily: 'DMMono-Medium',
    fontSize: 13,
    letterSpacing: 2,
    color: colors.text.inverse,
    textTransform: 'uppercase',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  footerLink: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  footerDot: {
    color: colors.text.tertiary,
  },
});
