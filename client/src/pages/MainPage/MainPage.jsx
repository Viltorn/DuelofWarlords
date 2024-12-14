import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import PrimaryButton from '@components/Buttons/PrimaryButton/PrimaryButton';
import LogoMain from '@assets/mainPageIcons/DuelofWarlords.png';
import CastleLogo from '@assets/mainPageIcons/Castle_logo.png';
import ForestLogo from '@assets/mainPageIcons/Forest_logo.png';
import AcademiaLogo from '@assets/mainPageIcons/Academia_logo.png';
import DungeonLogo from '@assets/mainPageIcons/Dungeon_logo.png';
import BattlefieldTactics from '@assets/mainPageIcons/Battlefield_tactics.png';
import SpellCast from '@assets/mainPageIcons/Spell_cast.png';
import HeroPower from '@assets/mainPageIcons/Hero_power.png';
import Paladin from '@assets/mainPageIcons/Paladin_logo.png';
import Mage from '@assets/mainPageIcons/Mage_logo.png';
import Hunter from '@assets/mainPageIcons/Hunter_logo.png';
import Assasin from '@assets/mainPageIcons/Assasin_logo.png';
import PostponedCover from '@assets/mainPageIcons/PostponedCover.png';
import DiscordLogo from '@assets/discord.svg';
import GameFeature from './GameFeature/GameFeature';
import GameFaction from './GameFaction/GameFaction';
import styles from './MainPage.module.css';

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
                text={t('buttons.FEATURES')}
                variant="primary"
              />
            </a>
            <Link to="/choose" className={styles.link}>
              <PrimaryButton
                showIcon={false}
                state="default"
                text={t('buttons.PLAY')}
                variant="secondary"
              />
            </Link>
          </div>
        </div>
      </div>
      <hr className={styles.deviderBig} />
      <main className={styles.main} id="description">
        <div className={styles.articleContainer}>
          <article className={styles.mainDescription}>
            <h1 className={styles.mainTitle}>
              Duel of Warlords
            </h1>
            <p className={styles.descriptionBig}>
              {t('mainPage.mainDescription')}
            </p>
            <a href="https://ru.wikipedia.org/wiki/Might_%26_Magic:_Duel_of_Champions" target="_blank" className={styles.textMute} rel="noreferrer">
              &gt;&gt;
              {' '}
              {t('mainPage.moreAboutMMdoc')}
            </a>
          </article>
          <article className={styles.gameDescription}>
            <h2 className={styles.h2Title}>
              {t('mainPage.GameDescriptTitle')}
            </h2>
            <p className={styles.descriptionNormal}>
              {t('mainPage.gameDescription')}
            </p>
          </article>
        </div>
        <hr className={styles.deviderBig} />
        <div className={styles.articleContainer}>
          <article className={styles.gameDescription}>
            <h2 className={styles.h2Title}>
              {t('mainPage.GameFactionsTitle')}
            </h2>
            <p className={styles.descriptionNormal}>
              {t('mainPage.gameFactions')}
            </p>
            <p className={styles.textMute}>
              {t('mainPage.hoverPictures')}
            </p>
            <div className={styles.gameFactions}>
              <GameFaction faction={CastleLogo} hero={Paladin} />
              <GameFaction faction={ForestLogo} hero={Hunter} />
              <GameFaction faction={AcademiaLogo} hero={Mage} />
              <GameFaction faction={DungeonLogo} hero={Assasin} />
            </div>
          </article>
        </div>
        <hr className={styles.deviderBig} />
        <div className={styles.articleContainer}>
          <article className={styles.gameDescription}>
            <h2 className={styles.h2Title}>
              {t('mainPage.GameFeaturesTitle')}
            </h2>
            <GameFeature img={BattlefieldTactics} direction="normal" h1={t('mainPage.Battlefield')} p={t('mainPage.BattlefieldDescription')} />
            <hr className={styles.devider} />
            <GameFeature img={HeroPower} direction="reverse" h1={t('mainPage.Heroes')} p={t('mainPage.HeroPowerDescription')} />
            <hr className={styles.devider} />
            <GameFeature img={SpellCast} direction="normal" h1={t('mainPage.Spells')} p={t('mainPage.SpellsDescription')} />
            <hr className={styles.devider} />
            <GameFeature img={PostponedCover} direction="reverse" h1={t('mainPage.PostponedCard')} p={t('mainPage.PostponedDescription')} />
          </article>
          <Link to="/choose" className={styles.link}>
            <PrimaryButton showIcon={false} state="default" text={t('buttons.PLAY')} variant="primary" />
          </Link>
        </div>
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerBlock}>
          <h3 className={styles.footTitle}>Duel of Warlords</h3>
          <div className={styles.feebackBlock}>
            <p className={styles.footFeedback}>{t('mainPage.FeedBackLine')}</p>
            <a href="https://discord.gg/BUTqPcRC" target="_blank" rel="noreferrer"><img className={styles.discord} src={DiscordLogo} alt="discord logo" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainPage;
