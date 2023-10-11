import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import PrimaryButton from '../PrimaryButton';
import styles from './MainPage.module.css';
import GameFaction from './GameFaction';
import GameFeature from './GameFeature';
import LogoMain from '../../assets/MainPage/Logo_main.png';
import CastleLogo from '../../assets/MainPage/Castle_logo.png';
import ForestLogo from '../../assets/MainPage/Forest_logo.png';
import AcademiaLogo from '../../assets/MainPage/Academia_logo.png';
import DungeonLogo from '../../assets/MainPage/Dungeon_logo.png';
import BattlefieldTactics from '../../assets/MainPage/Battlefield_tactics.png';
import SpellCast from '../../assets/MainPage/Spell_cast.png';
import HeroPower from '../../assets/MainPage/Hero_power.png';
import Paladin from '../../assets/MainPage/Paladin_logo.png';
import Mage from '../../assets/MainPage/Mage_logo.png';
import Hunter from '../../assets/MainPage/Hunter_logo.png';
import Assasin from '../../assets/MainPage/Assasin_logo.png';

const MainPage = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <div className={styles.cover}>
        <div className={styles.logoSet}>
          <img className={styles.mainLogo} alt="logo main" src={LogoMain} />
          <div className={styles.buttonsSet}>
            <a href="#description" className={styles.link}>
              <PrimaryButton
                showIcon={false}
                state="default"
                text={t('FEATURES')}
                variant="primary"
              />
            </a>
            <Link to="/choose" className={styles.link}>
              <PrimaryButton
                showIcon={false}
                state="default"
                text={t('PLAY')}
                variant="secondary"
              />
            </Link>
          </div>
        </div>
      </div>
      <section className={styles.main} id="description">
        <div className={styles.mainDescription}>
          <h1 className={styles.mainTitle}>
            Duel of Warlords
          </h1>
          <p className={styles.descriptionBig}>
            {t('mainDescription')}
          </p>
          <a href="https://ru.wikipedia.org/wiki/Might_%26_Magic:_Duel_of_Champions" target="_blank" className={styles.textMute} rel="noreferrer">
            &gt;&gt;
            {' '}
            {t('moreAboutMMdoc')}
          </a>
        </div>
        <div className={styles.gameDescription}>
          <h2 className={styles.h2Title}>
            {t('GameDescriptTitle')}
          </h2>
          <p className={styles.descriptionNormal}>
            {t('gameDescription')}
          </p>
        </div>
        <div className={styles.gameDescription}>
          <h2 className={styles.h2Title}>
            {t('GameFactionsTitle')}
          </h2>
          <p className={styles.descriptionNormal}>
            {t('gameFactions')}
          </p>
          <p className={styles.textMute}>
            {t('hoverPictures')}
          </p>
          <div className={styles.gameFactions}>
            <GameFaction faction={CastleLogo} hero={Paladin} />
            <GameFaction faction={ForestLogo} hero={Hunter} />
            <GameFaction faction={AcademiaLogo} hero={Mage} />
            <GameFaction faction={DungeonLogo} hero={Assasin} />
          </div>
        </div>
        <div className={styles.gameDescription}>
          <h2 className={styles.h2Title}>
            {t('GameFeaturesTitle')}
          </h2>
          <GameFeature img={BattlefieldTactics} direction="normal" h1={t('Battlefield')} p={t('BattlefieldDescription')} />
          <hr className={styles.devider} />
          <GameFeature img={HeroPower} direction="reverse" h1={t('Heroes')} p={t('HeroPowerDescription')} />
          <hr className={styles.devider} />
          <GameFeature img={SpellCast} direction="normal" h1={t('Spells')} p={t('SpellsDescription')} />
        </div>
        <Link to="/choose" className={styles.link}>
          <PrimaryButton showIcon={false} state="default" text={t('PLAY')} variant="primary" />
        </Link>
      </section>
    </div>
  );
};

export default MainPage;
