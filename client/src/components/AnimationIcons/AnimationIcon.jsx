// import warAttack from '@assets/battlefield/BladeAttack.webp';
// import arcaneAttack from '@assets/battlefield/MagicAttack.png';
// import warHeal from '@assets/battlefield/HealingIcon.webp';
import styles from './AnimationIcon.module.css';

const AnimationIcon = ({ animation, icon }) => (
  <img
    className={styles[animation]}
    src={icon}
    alt="animation icon"
  />
);

export default AnimationIcon;
