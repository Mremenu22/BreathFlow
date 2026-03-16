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
import { typography } from '../constants/typography';

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
    'Session history & stats',
    'Unlimited sessions',
  ];

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
        <Text style={styles.closeText}>{'\u2715'}</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>{'Unlock Your\nFull Practice'}</Text>

        <View style={styles.features}>
          {features.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <Text style={styles.featureIcon}>{'\u2726'}</Text>
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
              >
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
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.subscribeButton} activeOpacity={0.8}>
          <Text style={styles.subscribeText}>
            {selectedPlan === 'lifetime' ? 'Purchase' : 'Start Free Trial'}
          </Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Restore Purchases</Text>
          </TouchableOpacity>
          <Text style={styles.footerDot}>{'\u00B7'}</Text>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Terms</Text>
          </TouchableOpacity>
          <Text style={styles.footerDot}>{'\u00B7'}</Text>
          <TouchableOpacity>
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
    ...typography.heading,
    fontSize: 32,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 32,
  },
  features: {
    marginBottom: 36,
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIcon: {
    fontSize: 14,
    color: colors.accent.primary,
  },
  featureText: {
    ...typography.body,
    color: colors.text.primary,
  },
  plans: {
    gap: 10,
    marginBottom: 24,
  },
  planCard: {
    borderWidth: 1.5,
    borderColor: colors.bg.tertiary,
    borderRadius: 14,
    padding: 16,
  },
  planCardSelected: {
    borderColor: colors.accent.primary,
    backgroundColor: colors.accent.glow,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planLabel: {
    ...typography.body,
    fontFamily: 'Jost-SemiBold',
    color: colors.text.secondary,
  },
  planLabelSelected: {
    color: colors.text.primary,
  },
  planPrice: {
    ...typography.body,
    fontFamily: 'DMMono-Medium',
    color: colors.text.secondary,
  },
  planPriceSelected: {
    color: colors.accent.primary,
  },
  planSub: {
    ...typography.body,
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: 4,
  },
  subscribeButton: {
    backgroundColor: colors.accent.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  subscribeText: {
    ...typography.body,
    fontFamily: 'Jost-SemiBold',
    fontSize: 16,
    color: colors.bg.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  footerLink: {
    ...typography.body,
    fontSize: 12,
    color: colors.text.tertiary,
  },
  footerDot: {
    color: colors.text.tertiary,
  },
});
