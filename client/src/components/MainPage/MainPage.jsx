import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import PrimaryButton from '../PrimaryButton';
import './MainPage.css';
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
    <div className="main">
      <div className="cover">
        <div className="logo-set">
          <img className="main-logo" alt="Logo main" src={LogoMain} />
          <div className="buttons-set">
            <a href="#description" className="link">
              <PrimaryButton
                showIcon={false}
                state="default"
                text="ПОДРОБНЕЕ"
                variant="primary"
              />
            </a>
            <Link to="/choose" className="link">
              <PrimaryButton
                showIcon={false}
                state="default"
                text="ИГРАТЬ"
                variant="secondary"
              />
            </Link>
          </div>
        </div>
      </div>
      <section className="main-section" id="description">
        <div className="main-description w-90">
          <h1 className="main-title">
            Duel of Warlords
          </h1>
          <p className="description-big">
            {t('mainDescription')}
          </p>
          <a href="/" className="text-mute">
            &gt;&gt;
            {' '}
            {t('moreAboutMMdoc')}
          </a>
        </div>
        <hr className="w-90 hr-double" />
        <div className="game-description w-90">
          <h2 className="main-h2">
            {t('GameDescriptTitle')}
          </h2>
          <p className="description-normal">
            {t('gameDescription')}
          </p>
        </div>
        <div className="game-description w-90">
          <h2 className="main-h2">
            {t('GameFactionsTitle')}
          </h2>
          <p className="description-normal">
            {t('gameFactions')}
          </p>
          <p className="text-mute">
            {t('hoverPictures')}
          </p>
          <div className="game-factions-set">
            <div className="card">
              <div className="wrapper">
                <img src={CastleLogo} alt="Castle logo" className="factions-logo cover-image" />
              </div>
              <img src={Paladin} alt="paladin logo" className="character" />
            </div>
            <div className="card">
              <div className="wrapper">
                <img src={ForestLogo} alt="Forest logo" className="factions-logo cover-image" />
              </div>
              <img src={Hunter} alt="paladin logo" className="character" />
            </div>
            <div className="card">
              <div className="wrapper">
                <img src={AcademiaLogo} alt="Academia logo" className="factions-logo cover-image" />
              </div>
              <img src={Mage} alt="paladin logo" className="character" />
            </div>
            <div className="card">
              <div className="wrapper">
                <img src={DungeonLogo} alt="Dungeon logo" className="factions-logo cover-image" />
              </div>
              <img src={Assasin} alt="paladin logo" className="character" />
            </div>
          </div>
        </div>
        <div className="game-description w-90">
          <h2 className="main-h2">
            {t('GameFeaturesTitle')}
          </h2>
          <div className="mt-2">
            <h3 className="main-h3">
              {t('Battlefield')}
            </h3>
            <div className="game-feature-set">
              <img className="feature-img" alt="battlefield feature" src={BattlefieldTactics} />
              <p className="feature-text">
                {t('BattlefieldDescription')}
              </p>
            </div>
          </div>
          <hr className="w-90 hr-thin" />
          <div>
            <h3 className="main-h3">
              {t('Heroes')}
            </h3>
            <div className="game-feature-set-r">
              <img className="feature-img" alt="heropower feature" src={HeroPower} />
              <p className="feature-text">
                {t('HeroPowerDescription')}
              </p>
            </div>
          </div>
          <hr className="w-90 hr-thin" />
          <div>
            <h3 className="main-h3">
              {t('Spells')}
            </h3>
            <div className="game-feature-set">
              <img className="feature-img" alt="heropower feature" src={SpellCast} />
              <p className="feature-text">
                {t('SpellsDescription')}
              </p>
            </div>
          </div>
        </div>
        <hr className="w-90 hr-double" />
        <Link to="/battle" className="link">
          <PrimaryButton showIcon={false} state="default" text="ОБУЧЕНИЕ" variant="primary" />
        </Link>
      </section>
    </div>
  );
};

export default MainPage;