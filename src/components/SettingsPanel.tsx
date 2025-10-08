/**
 * Settings Panel - App configuration and preferences
 */

import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, Palette, DollarSign, Globe, Download, Upload, Trash2, RefreshCw, Sparkles, Bell, Volume2, Music, FileText } from 'lucide-react';
import { useBudget } from '../store/budget';
import CSVManager from './CSVManager';
import { useState } from 'react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { prefs, resetData, restoreDefaultBills, initializeDefaultGoals, resetGoalsSavedAmounts } = useBudget();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showRestoreBillsConfirm, setShowRestoreBillsConfirm] = useState(false);
  
  // Notification settings (placeholder for future implementation)
  const [bgmEnabled, setBgmEnabled] = useState(false);
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [popupNotifications, setPopupNotifications] = useState(true);

  // Currency options
  const currencies = [
    { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  ];

  // Theme options
  const themes = [
    { value: 'system', label: 'System', icon: '💻' },
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
  ];

  // Locale options
  const locales = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-PH', name: 'English (Philippines)' },
    { code: 'en-GB', name: 'English (UK)' },
  ];

  const handleCurrencyChange = (currencyCode: string) => {
    useBudget.setState(s => ({
      prefs: { ...s.prefs, currency: currencyCode as any }
    }));
  };

  const handleThemeChange = (theme: string) => {
    useBudget.setState(s => ({
      prefs: { ...s.prefs, theme: theme as any }
    }));
  };

  const handleLocaleChange = (locale: string) => {
    useBudget.setState(s => ({
      prefs: { ...s.prefs, locale }
    }));
  };

  const handleExportData = () => {
    const state = useBudget.getState();
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `financequest-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          useBudget.setState(data);
          alert('Data imported successfully!');
        } catch (error) {
          alert('Failed to import data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleResetData = () => {
    if (showResetConfirm) {
      resetData();
      setShowResetConfirm(false);
      alert('Monthly reset complete! Transactions cleared, envelopes reset to budget amounts. Bills, goals, and budget configuration preserved.');
    } else {
      setShowResetConfirm(true);
    }
  };

  const handleRestoreDefaultBills = () => {
    if (showRestoreBillsConfirm) {
      restoreDefaultBills();
      setShowRestoreBillsConfirm(false);
      alert('Default bills have been restored!');
    } else {
      setShowRestoreBillsConfirm(true);
    }
  };

  const handleResetGoalAmounts = () => {
    resetGoalsSavedAmounts();
    alert('All goal saved amounts have been reset to 0!');
  };

  const APP_VERSION = 'v2.1.0';
  const RELEASE_DATE = 'October 2025';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed right-0 left-0 bg-black/60 backdrop-blur-sm z-40"
            style={{
              top: '30px',
              height: 'calc(100vh - 30px)',
            }}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 w-full sm:w-[480px] z-50 overflow-y-auto"
            style={{
              top: '0px',
              height: '100vh',
              background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.98) 0%, rgba(23, 23, 23, 0.98) 100%)',
              boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 backdrop-blur-xl border-b border-neutral-800 px-6 pt-4 pb-6"
              style={{
                background: 'linear-gradient(135deg, rgba(23, 23, 23, 0.95) 0%, rgba(38, 38, 38, 0.95) 100%)',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                    <Settings className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      Settings
                    </h2>
                    <p className="text-xs text-neutral-400">Customize your experience</p>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-xl bg-neutral-800/50 hover:bg-neutral-700/50 border border-neutral-700/50 transition-colors"
                >
                  <X className="w-5 h-5 text-neutral-400" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Appearance Section */}
              <div className="card relative">
                {/* Coming Soon Overlay */}
                <div className="absolute inset-0 bg-neutral-900/70 backdrop-blur-sm rounded-xl z-10 flex flex-col items-center justify-center pointer-events-none">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center px-6"
                  >
                    <div className="text-4xl mb-3">🎨</div>
                    <h4 className="text-lg font-bold text-cyan-400 mb-1">Coming Soon</h4>
                    <p className="text-sm text-neutral-400">Theme customization under development</p>
                  </motion.div>
                </div>

                <div className="flex items-center gap-2 mb-4 opacity-50">
                  <Palette className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-neutral-200">Appearance</h3>
                </div>
                
                {/* Theme Selection */}
                <div className="space-y-2 mb-4 opacity-50">
                  <label className="text-sm text-neutral-400">Theme</label>
                  <div className="grid grid-cols-3 gap-2">
                    {themes.map((theme) => (
                      <motion.button
                        key={theme.value}
                        onClick={() => handleThemeChange(theme.value)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          prefs.theme === theme.value
                            ? 'border-cyan-500 bg-cyan-500/10'
                            : 'border-neutral-700 bg-neutral-800/50'
                        }`}
                        disabled
                      >
                        <div className="text-2xl mb-1">{theme.icon}</div>
                        <div className="text-xs text-neutral-300">{theme.label}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Regional Settings */}
              <div className="card">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="w-5 h-5 text-green-400" />
                  <h3 className="text-lg font-semibold text-neutral-200">Regional Settings</h3>
                </div>
                
                {/* Currency Selection */}
                <div className="space-y-2 mb-4">
                  <label className="text-sm text-neutral-400">Currency</label>
                  <select
                    value={prefs.currency}
                    onChange={(e) => handleCurrencyChange(e.target.value)}
                    className="input w-full"
                  >
                    {currencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.symbol} {currency.name} ({currency.code})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Locale Selection */}
                <div className="space-y-2">
                  <label className="text-sm text-neutral-400">Language & Region</label>
                  <select
                    value={prefs.locale}
                    onChange={(e) => handleLocaleChange(e.target.value)}
                    className="input w-full"
                  >
                    {locales.map((locale) => (
                      <option key={locale.code} value={locale.code}>
                        {locale.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notifications & Audio */}
              <div className="card">
                <div className="flex items-center gap-2 mb-4">
                  <Bell className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-neutral-200">Notifications & Audio</h3>
                </div>
                
                <div className="space-y-4">
                  {/* Background Music */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-800/50 border border-neutral-700">
                    <div className="flex items-center gap-3">
                      <Music className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-sm font-medium text-neutral-200">Background Music (BGM)</p>
                        <p className="text-xs text-neutral-400">Play ambient music while using the app</p>
                      </div>
                    </div>
                    <motion.button
                      onClick={() => setBgmEnabled(!bgmEnabled)}
                      whileTap={{ scale: 0.95 }}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        bgmEnabled ? 'bg-purple-500' : 'bg-neutral-600'
                      }`}
                    >
                      <motion.div
                        animate={{ x: bgmEnabled ? 24 : 2 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
                      />
                    </motion.button>
                  </div>

                  {/* Sound Effects */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-800/50 border border-neutral-700">
                    <div className="flex items-center gap-3">
                      <Volume2 className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-sm font-medium text-neutral-200">Sound Effects (SFX)</p>
                        <p className="text-xs text-neutral-400">Play sounds for actions and events</p>
                      </div>
                    </div>
                    <motion.button
                      onClick={() => setSfxEnabled(!sfxEnabled)}
                      whileTap={{ scale: 0.95 }}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        sfxEnabled ? 'bg-green-500' : 'bg-neutral-600'
                      }`}
                    >
                      <motion.div
                        animate={{ x: sfxEnabled ? 24 : 2 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
                      />
                    </motion.button>
                  </div>

                  {/* Popup Notifications */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-800/50 border border-neutral-700">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-cyan-400" />
                      <div>
                        <p className="text-sm font-medium text-neutral-200">Popup Notifications</p>
                        <p className="text-xs text-neutral-400">Show popup alerts for important events</p>
                      </div>
                    </div>
                    <motion.button
                      onClick={() => setPopupNotifications(!popupNotifications)}
                      whileTap={{ scale: 0.95 }}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        popupNotifications ? 'bg-cyan-500' : 'bg-neutral-600'
                      }`}
                    >
                      <motion.div
                        animate={{ x: popupNotifications ? 24 : 2 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
                      />
                    </motion.button>
                  </div>

                  <p className="text-xs text-neutral-500 text-center px-2">
                    💡 Audio features coming soon! These settings are ready for future implementation.
                  </p>
                </div>
              </div>

              {/* Data Management */}
              <div className="card">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-neutral-200">Data Management</h3>
                </div>
                
                <div className="space-y-3">
                  {/* Export Data */}
                  <motion.button
                    onClick={handleExportData}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn w-full flex items-center justify-center gap-2 bg-green-600/20 hover:bg-green-600/30 border-green-500/30"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Data</span>
                  </motion.button>

                  {/* Import Data */}
                  <motion.button
                    onClick={handleImportData}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn w-full flex items-center justify-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 border-blue-500/30"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Import Data</span>
                  </motion.button>

                  {/* Restore Default Bills */}
                  <motion.button
                    onClick={handleRestoreDefaultBills}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`btn w-full flex items-center justify-center gap-2 ${
                      showRestoreBillsConfirm
                        ? 'bg-yellow-600/30 border-yellow-500/50'
                        : 'bg-yellow-600/20 hover:bg-yellow-600/30 border-yellow-500/30'
                    }`}
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>{showRestoreBillsConfirm ? 'Click again to confirm' : 'Restore Default Bills'}</span>
                  </motion.button>

                  {/* Reset Goal Amounts */}
                  <motion.button
                    onClick={handleResetGoalAmounts}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn w-full flex items-center justify-center gap-2 bg-orange-600/20 hover:bg-orange-600/30 border-orange-500/30"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Reset Goal Amounts</span>
                  </motion.button>

                  {/* Reset for New Month */}
                  <motion.button
                    onClick={handleResetData}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`btn w-full flex items-center justify-center gap-2 ${
                      showResetConfirm
                        ? 'bg-orange-600/30 border-orange-500/50'
                        : 'bg-orange-600/20 hover:bg-orange-600/30 border-orange-500/30'
                    }`}
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>{showResetConfirm ? 'Click again to confirm' : 'Reset for New Month'}</span>
                  </motion.button>

                  {showResetConfirm && (
                    <p className="text-xs text-orange-400 text-center">
                      ⚠️ This will clear transactions & reset envelopes. Bills, goals & budget config are preserved.
                    </p>
                  )}
                  
                  {/* Info about what gets preserved */}
                  {!showResetConfirm && (
                    <div className="text-xs text-neutral-400 space-y-1 pl-4">
                      <p>✓ Keeps: Bills, Goals, Budget Sources</p>
                      <p>✗ Clears: Transactions, Resets Envelope Balances</p>
                    </div>
                  )}
                  {showRestoreBillsConfirm && (
                    <p className="text-xs text-yellow-400 text-center">
                      This will restore the 7 default bills
                    </p>
                  )}

                  {/* CSV Import/Export Section */}
                  <div className="pt-4 border-t border-neutral-700">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-4 h-4 text-neutral-400" />
                      <h4 className="text-sm font-semibold text-neutral-300">CSV Transactions</h4>
                    </div>
                    <CSVManager />
                  </div>
                </div>
              </div>

              {/* What's New Section */}
              <div className="card border-2 border-cyan-500/30">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-semibold text-neutral-200">What's New</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-400">Version</span>
                    <span className="text-sm font-mono text-cyan-400">{APP_VERSION}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-400">Release Date</span>
                    <span className="text-sm text-neutral-300">{RELEASE_DATE}</span>
                  </div>
                  
                  <div className="pt-3 border-t border-neutral-700">
                    <h4 className="text-sm font-semibold text-neutral-300 mb-2">Recent Updates:</h4>
                    <ul className="space-y-2 text-xs text-neutral-400">
                      <li className="flex items-start gap-2">
                        <span className="text-green-400">✓</span>
                        <span>Fully functional Status Panel with detailed adventurer stats</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400">✓</span>
                        <span>Comprehensive Settings Panel with customization options</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400">✓</span>
                        <span>General Analytics with income sync to monthly budget</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400">✓</span>
                        <span>Streamlined Bills section with improved UI</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400">✓</span>
                        <span>Enhanced envelope management with zero defaults</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400">✓</span>
                        <span>Subtle glow effects throughout the interface</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400">✓</span>
                        <span>Data export/import functionality</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Footer Info */}
              <div className="text-center text-xs text-neutral-500 pb-4">
                <p>FinanceQuest — Campus Edition</p>
                <p className="mt-1">Made with 💚 for students</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
