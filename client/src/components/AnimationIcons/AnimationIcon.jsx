// import warAttack from '@assets/battlefield/BladeAttack.webp';
// import arcaneAttack from '@assets/battlefield/MagicAttack.png';
// import warHeal from '@assets/battlefield/HealingIcon.webp';
import styles from './AnimationIcon.module.css';

const AnimationIcon = ({ animation, icon }) => (
  // <motion.div
  //   className={styles[animation]}
  //   initial={{ scale: 0.5, opacity: 1 }}
  //   animate={{ scale: isScaled ? 1.5 : 0.1, opacity: 0 }}
  //   transition={{ duration: 1.5 }}
  //   onAnimationComplete={() => setIsScaled(false)}
  // >
  <img
    className={styles[animation]}
    src={icon}
    alt="animation icon"
  />
  // </motion.div>
);

export default AnimationIcon;
