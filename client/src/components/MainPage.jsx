import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import PrimaryButton from './PrimaryButton';
// import '../style.css';
import '../MainPage.css';
import LogoMain from '../assets/Logo_main.png';
import CastleLogo from '../assets/Castle_logo.png';
import ForestLogo from '../assets/Forest_logo.png';
import AcademiaLogo from '../assets/Academia_logo.png';
import DungeonLogo from '../assets/Dungeon_logo.png';
import BattlefieldTactics from '../assets/Battlefield_tactics.png';
import SpellCast from '../assets/Spell_cast.png';
import HeroPower from '../assets/Hero_power.png';
import Paladin from '../assets/Paladin_logo.png';
import Mage from '../assets/Mage_logo.png';
import Hunter from '../assets/Hunter_logo.png';
import Assasin from '../assets/Assasin_logo.png';

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
                type="primary"
              />
            </a>
            <Link to="/battle" className="link">
              <PrimaryButton
                showIcon={false}
                state="default"
                text="ОБУЧЕНИЕ"
                type="secondary"
              />
            </Link>

          </div>
        </div>
      </div>
      <section className="main-section" id="description">
        <div className="main-description w-90">
          <h1 className="title">
            Duel of Warlords
          </h1>
          <p className="description-big">
            {t('mainDescription')}
          </p>
          <p className="text-mute">
            &gt;&gt;
            {' '}
            {t('moreAboutMMdoc')}
          </p>
        </div>
        <hr className="w-90 hr-double" />
        <div className="game-description w-90">
          <h2>
            {t('GameDescriptTitle')}
          </h2>
          <p className="description-normal">
            {t('gameDescription')}
          </p>
        </div>
        <div className="game-description w-90">
          <h2>
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
          <h2>
            {t('GameFeaturesTitle')}
          </h2>
          <div className="mt-2">
            <h3>
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
            <h3>
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
            <h3>
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
          <PrimaryButton showIcon={false} state="default" text="ОБУЧЕНИЕ" type="primary" />
        </Link>
      </section>
    </div>
  );
};

export default MainPage;
