import { useBudget } from '../store/budget';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Sparkles, Palette, Zap } from 'lucide-react';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'theme' | 'icon' | 'effect';
  icon: string;
}

const SHOP_ITEMS: ShopItem[] = [
  { id: 'theme_ocean', name: 'Ocean Theme', description: 'Cool blue gradient', cost: 100, type: 'theme', icon: '🌊' },
  { id: 'theme_sunset', name: 'Sunset Theme', description: 'Warm orange & pink', cost: 100, type: 'theme', icon: '🌅' },
  { id: 'theme_forest', name: 'Forest Theme', description: 'Nature greens', cost: 150, type: 'theme', icon: '🌲' },
  { id: 'icon_rocket', name: 'Rocket Icon', description: 'Blast off!', cost: 50, type: 'icon', icon: '🚀' },
  { id: 'icon_trophy', name: 'Trophy Icon', description: 'Champion status', cost: 50, type: 'icon', icon: '🏆' },
  { id: 'effect_confetti', name: 'Confetti Burst', description: 'Celebrate wins!', cost: 200, type: 'effect', icon: '🎉' },
];

const getCategoryIcon = (type: string) => {
  switch (type) {
    case 'theme':
      return <Palette className="w-3.5 h-3.5" />;
    case 'icon':
      return <Sparkles className="w-3.5 h-3.5" />;
    case 'effect':
      return <Zap className="w-3.5 h-3.5" />;
    default:
      return <ShoppingBag className="w-3.5 h-3.5" />;
  }
};

interface ShopProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Shop({ isOpen, onClose }: ShopProps) {
  const coins = useBudget(s => s.game.coins);

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Floating Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ pointerEvents: 'none' }}
          >
            <div 
              className="w-full max-w-3xl max-h-[85vh]"
              style={{ pointerEvents: 'auto' }}
            >
            <div className="relative bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 rounded-2xl border-2 border-brand-500/30 shadow-2xl shadow-brand-500/20 overflow-hidden">
              {/* Coming Soon Overlay */}
              <div className="absolute inset-0 z-50 backdrop-blur-md bg-black/60 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', duration: 0.6 }}
                  className="text-center p-8"
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="text-8xl mb-6"
                  >
                    🚧
                  </motion.div>
                  
                  <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-brand-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Coming Soon!
                  </h2>
                  
                  <p className="text-lg text-neutral-300 mb-6 max-w-md mx-auto">
                    The Reward Shop is currently under construction. 
                    <br />
                    Stay tuned for exciting items and customizations!
                  </p>
                  
                  <div className="flex items-center justify-center gap-3 text-neutral-400">
                    <Sparkles className="w-5 h-5 text-brand-400" />
                    <span className="text-sm">Keep earning coins for the launch!</span>
                    <Sparkles className="w-5 h-5 text-brand-400" />
                  </div>
                  
                  <motion.button
                    onClick={onClose}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-8 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-purple-500 text-white font-semibold shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 transition-all"
                  >
                    Got It!
                  </motion.button>
                </motion.div>
              </div>

              {/* Header */}
              <div className="relative bg-gradient-to-r from-brand-500/20 via-purple-500/20 to-brand-500/20 border-b border-brand-500/30 p-6">
                {/* Animated background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-500/10 to-transparent animate-shimmer" />
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-brand-500 to-purple-500 shadow-lg shadow-brand-500/30">
                      <ShoppingBag className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-purple-400 to-brand-500">
                        Reward Shop
                      </h2>
                      <p className="text-xs text-neutral-400 mt-0.5">Unlock cosmetic items with coins</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {/* Coin Balance */}
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 shadow-lg">
                      <div className="text-xl">💰</div>
                      <div className="flex flex-col">
                        <span className="text-xs text-neutral-400 leading-none">Balance</span>
                        <span className="text-lg font-bold text-yellow-400 leading-tight">{coins}</span>
                      </div>
                    </div>
                    
                    {/* Close Button */}
                    <button
                      onClick={onClose}
                      className="p-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-700/80 border border-neutral-700 hover:border-neutral-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(85vh-180px)] scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
                {/* Category Tabs (Optional for future expansion) */}
                <div className="flex gap-2 mb-6">
                  <button className="px-4 py-2 rounded-lg bg-brand-500/20 border border-brand-500/30 text-sm font-medium text-brand-400 hover:bg-brand-500/30 transition-colors">
                    All Items
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-sm font-medium text-neutral-400 hover:bg-neutral-700 transition-colors">
                    Themes
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-sm font-medium text-neutral-400 hover:bg-neutral-700 transition-colors">
                    Icons
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-sm font-medium text-neutral-400 hover:bg-neutral-700 transition-colors">
                    Effects
                  </button>
                </div>

                {/* Items Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {SHOP_ITEMS.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.03, y: -4 }}
                      className="group relative p-4 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-800/50 border border-neutral-700 hover:border-brand-500/50 transition-all overflow-hidden"
                    >
                      {/* Hover glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/0 to-purple-500/0 group-hover:from-brand-500/10 group-hover:to-purple-500/10 transition-all duration-300" />
                      
                      <div className="relative">
                        {/* Category Badge */}
                        <div className="absolute -top-2 -right-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-neutral-900/90 border border-neutral-700 text-xs text-neutral-400">
                          {getCategoryIcon(item.type)}
                          <span className="capitalize">{item.type}</span>
                        </div>
                        
                        {/* Item Icon */}
                        <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform">{item.icon}</div>
                        
                        {/* Item Info */}
                        <h3 className="font-semibold text-white mb-1">{item.name}</h3>
                        <p className="text-xs text-neutral-400 mb-4 line-clamp-2">{item.description}</p>
                        
                        {/* Purchase Button */}
                        <button
                          className={`w-full px-4 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2
                            ${coins >= item.cost
                              ? 'bg-gradient-to-r from-brand-500 to-purple-500 hover:from-brand-600 hover:to-purple-600 text-white shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50'
                              : 'bg-neutral-800 border border-neutral-700 text-neutral-500 cursor-not-allowed'
                            }`}
                          disabled={coins < item.cost}
                        >
                          <span className="text-base">💰</span>
                          <span>{item.cost} coins</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Info Box */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 p-4 rounded-xl bg-gradient-to-r from-brand-500/10 via-purple-500/10 to-brand-500/10 border border-brand-500/20"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">💡</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-white mb-1">How to Earn Coins</h4>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Complete daily quests, achieve milestones, track expenses, and maintain your streak! 
                        Every 10 XP earned converts to 1 coin. Unlock badges for bonus coins!
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}