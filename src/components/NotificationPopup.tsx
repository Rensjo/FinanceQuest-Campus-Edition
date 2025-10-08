import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Zap, Award, Flame, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

export type NotificationType = 'quest' | 'levelUp' | 'badge' | 'achievement' | 'streak';

export interface NotificationData {
  type: NotificationType;
  title: string;
  description?: string;
  xp?: number;
  coins?: number;
  level?: number;
  badgeName?: string;
  streakDays?: number;
}

interface NotificationPopupProps {
  notification: NotificationData | null;
  onClose: () => void;
}

export default function NotificationPopup({ notification, onClose }: NotificationPopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setIsVisible(true);
      // Auto-close after 4 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 500); // Wait for exit animation
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  const getNotificationConfig = () => {
    switch (notification.type) {
      case 'quest':
        return {
          icon: <Trophy className="w-12 h-12" />,
          iconBg: 'from-emerald-500 to-teal-500',
          borderColor: 'rgba(16, 185, 129, 0.5)',
          glowColor: 'rgba(16, 185, 129, 0.3)',
          accentColor: 'text-emerald-400',
          emoji: '🎯',
        };
      case 'levelUp':
        return {
          icon: <Zap className="w-16 h-16" />,
          iconBg: 'from-yellow-500 to-orange-500',
          borderColor: 'rgba(234, 179, 8, 0.5)',
          glowColor: 'rgba(234, 179, 8, 0.4)',
          accentColor: 'text-yellow-400',
          emoji: '⚡',
        };
      case 'badge':
        return {
          icon: <Award className="w-12 h-12" />,
          iconBg: 'from-purple-500 to-pink-500',
          borderColor: 'rgba(168, 85, 247, 0.5)',
          glowColor: 'rgba(168, 85, 247, 0.3)',
          accentColor: 'text-purple-400',
          emoji: '🏆',
        };
      case 'achievement':
        return {
          icon: <Star className="w-12 h-12" />,
          iconBg: 'from-blue-500 to-cyan-500',
          borderColor: 'rgba(6, 182, 212, 0.5)',
          glowColor: 'rgba(6, 182, 212, 0.3)',
          accentColor: 'text-cyan-400',
          emoji: '⭐',
        };
      case 'streak':
        return {
          icon: <Flame className="w-16 h-16" />,
          iconBg: 'from-orange-500 to-red-500',
          borderColor: 'rgba(249, 115, 22, 0.5)',
          glowColor: 'rgba(249, 115, 22, 0.4)',
          accentColor: 'text-orange-400',
          emoji: '🔥',
        };
      default:
        return {
          icon: <Trophy className="w-12 h-12" />,
          iconBg: 'from-brand-500 to-cyan-500',
          borderColor: 'rgba(16, 185, 129, 0.5)',
          glowColor: 'rgba(16, 185, 129, 0.3)',
          accentColor: 'text-brand-400',
          emoji: '✨',
        };
    }
  };

  const config = getNotificationConfig();

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 500);
            }}
          />

          {/* Notification Card */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center pointer-events-none p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 50, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -50, rotate: 10 }}
              transition={{ type: 'spring', duration: 0.6, bounce: 0.5 }}
              className="pointer-events-auto"
            >
              <div
                className="relative w-[450px] rounded-3xl border-4 p-10 shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(23, 23, 23, 0.95), rgba(38, 38, 38, 0.95))',
                  borderColor: config.borderColor,
                  boxShadow: `0 25px 50px -12px ${config.glowColor}, 0 0 60px ${config.glowColor}, inset 0 2px 20px rgba(255, 255, 255, 0.1)`,
                }}
              >
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl opacity-20">
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${config.glowColor}, transparent 70%)`,
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.7, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                
                {/* Sparkles */}
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full bg-white"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                  />
                ))}
              </div>

              {/* Content */}
              <div className="relative z-10">
                {/* Icon/Emoji Animation */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', duration: 0.8, delay: 0.2 }}
                  className="flex justify-center mb-6"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: notification.type === 'streak' ? [0, 10, -10, 0] : [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className={`relative p-6 rounded-2xl bg-gradient-to-br ${config.iconBg} shadow-xl`}
                    style={{
                      boxShadow: `0 10px 40px ${config.glowColor}`,
                    }}
                  >
                    {/* Glow effect */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background: `radial-gradient(circle, ${config.glowColor}, transparent 70%)`,
                        filter: 'blur(20px)',
                      }}
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                    
                    {/* Icon */}
                    <div className="relative text-white">
                      {config.icon}
                    </div>

                    {/* Particles */}
                    {notification.type === 'levelUp' && (
                      <>
                        {[...Array(8)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{
                              opacity: [0, 1, 0],
                              scale: [0, 1, 0.5],
                              x: [0, Math.cos((i / 8) * Math.PI * 2) * 60],
                              y: [0, Math.sin((i / 8) * Math.PI * 2) * 60],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: i * 0.1,
                            }}
                            className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-yellow-400"
                          />
                        ))}
                      </>
                    )}

                    {/* Streak flames */}
                    {notification.type === 'streak' && (
                      <>
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 0 }}
                            animate={{
                              opacity: [0, 1, 0],
                              y: [-40, -80],
                              x: [0, (Math.random() - 0.5) * 40],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: i * 0.2,
                            }}
                            className="absolute bottom-0 left-1/2 text-2xl"
                          >
                            🔥
                          </motion.div>
                        ))}
                      </>
                    )}
                  </motion.div>
                </motion.div>

                {/* Title with bounce effect */}
                <motion.h2
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    scale: [0.8, 1.1, 1],
                  }}
                  transition={{ 
                    delay: 0.3,
                    scale: {
                      duration: 0.5,
                      ease: "easeOut"
                    }
                  }}
                  className={`text-3xl font-black text-center mb-3 ${config.accentColor} drop-shadow-lg`}
                  style={{
                    textShadow: `0 0 20px ${config.glowColor}, 0 2px 4px rgba(0,0,0,0.5)`,
                  }}
                >
                  {notification.title}
                </motion.h2>

                {/* Description */}
                {notification.description && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-center text-neutral-200 mb-6 text-base font-semibold"
                  >
                    {notification.description}
                  </motion.p>
                )}
                
                {/* Celebration Stars */}
                <div className="flex justify-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0, rotate: 0 }}
                      animate={{ 
                        opacity: [0, 1, 1],
                        scale: [0, 1.2, 1],
                        rotate: [0, 360],
                      }}
                      transition={{
                        delay: 0.5 + i * 0.1,
                        duration: 0.6,
                      }}
                      className="text-2xl"
                    >
                      ⭐
                    </motion.span>
                  ))}
                </div>

                {/* Level Display */}
                {notification.type === 'levelUp' && notification.level && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ 
                      opacity: 1, 
                      scale: [0.5, 1.2, 1],
                    }}
                    transition={{ 
                      delay: 0.5,
                      duration: 0.6,
                      ease: "easeOut"
                    }}
                    className="flex justify-center mb-6"
                  >
                    <motion.div 
                      className="px-10 py-5 rounded-2xl bg-gradient-to-r from-yellow-500/30 to-orange-500/30 border-4 border-yellow-400/60 relative"
                      animate={{
                        boxShadow: [
                          '0 0 30px rgba(234, 179, 8, 0.6)',
                          '0 0 50px rgba(234, 179, 8, 0.8)',
                          '0 0 30px rgba(234, 179, 8, 0.6)',
                        ],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                    >
                      <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400"
                        style={{
                          textShadow: '0 0 20px rgba(234, 179, 8, 0.8)',
                        }}
                      >
                        Level {notification.level}
                      </span>
                    </motion.div>
                  </motion.div>
                )}

                {/* Streak Display */}
                {notification.type === 'streak' && notification.streakDays && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ 
                      opacity: 1, 
                      scale: [0.5, 1.15, 1],
                    }}
                    transition={{ 
                      delay: 0.5,
                      duration: 0.6,
                    }}
                    className="flex justify-center mb-6"
                  >
                    <motion.div 
                      className="px-10 py-5 rounded-2xl bg-gradient-to-r from-orange-500/30 to-red-500/30 border-4 border-orange-400/60"
                      animate={{
                        boxShadow: [
                          '0 0 30px rgba(249, 115, 22, 0.6)',
                          '0 0 50px rgba(249, 115, 22, 0.9)',
                          '0 0 30px rgba(249, 115, 22, 0.6)',
                        ],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                    >
                      <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-orange-400 to-red-400"
                        style={{
                          textShadow: '0 0 20px rgba(249, 115, 22, 0.8)',
                        }}
                      >
                        {notification.streakDays} Day Streak! 🔥
                      </span>
                    </motion.div>
                  </motion.div>
                )}

                {/* Badge Display */}
                {notification.type === 'badge' && notification.badgeName && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ 
                      opacity: 1, 
                      scale: [0.5, 1.15, 1],
                    }}
                    transition={{ 
                      delay: 0.5,
                      duration: 0.6,
                    }}
                    className="flex justify-center mb-6"
                  >
                    <motion.div 
                      className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-4 border-purple-400/60"
                      animate={{
                        boxShadow: [
                          '0 0 30px rgba(168, 85, 247, 0.6)',
                          '0 0 50px rgba(168, 85, 247, 0.9)',
                          '0 0 30px rgba(168, 85, 247, 0.6)',
                        ],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                    >
                      <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-purple-400 to-pink-400"
                        style={{
                          textShadow: '0 0 20px rgba(168, 85, 247, 0.8)',
                        }}
                      >
                        {notification.badgeName}
                      </span>
                    </motion.div>
                  </motion.div>
                )}

                {/* Rewards */}
                {(notification.xp || notification.coins) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="flex justify-center gap-4"
                  >
                    {notification.xp && (
                      <motion.div 
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50 shadow-lg"
                        animate={{
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                        }}
                        style={{
                          boxShadow: '0 4px 20px rgba(234, 179, 8, 0.4)',
                        }}
                      >
                        <Zap className="w-6 h-6 text-yellow-400" />
                        <span className="font-black text-xl text-yellow-400">+{notification.xp} XP</span>
                      </motion.div>
                    )}
                    {notification.coins && (
                      <motion.div 
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-2 border-amber-500/50 shadow-lg"
                        animate={{
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: 0.2,
                        }}
                        style={{
                          boxShadow: '0 4px 20px rgba(245, 158, 11, 0.4)',
                        }}
                      >
                        <span className="text-2xl">🪙</span>
                        <span className="font-black text-xl text-amber-400">+{notification.coins}</span>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Confetti Effect for Level Up */}
                {notification.type === 'levelUp' && (
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(30)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ 
                          opacity: 1,
                          x: '50%',
                          y: '50%',
                        }}
                        animate={{
                          opacity: [1, 1, 0],
                          x: `${50 + (Math.random() - 0.5) * 200}%`,
                          y: `${50 + (Math.random() - 0.5) * 200}%`,
                          rotate: Math.random() * 360,
                        }}
                        transition={{
                          duration: 1.5 + Math.random(),
                          delay: Math.random() * 0.5,
                        }}
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: ['#fbbf24', '#f59e0b', '#ec4899', '#a855f7', '#06b6d4'][i % 5],
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
