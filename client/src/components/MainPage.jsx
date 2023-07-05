import React from 'react';
import { useTranslation } from 'react-i18next';
import PrimaryButton from './PrimaryButton';
import '../style.css';
import '../MainPage.css';
import LogoMain from '../assets/Logo_main.png';
import CastleLogo from '../assets/Castle_logo.png';
import ForestLogo from '../assets/Forest_logo.png';
import AcademiaLogo from '../assets/Academia_logo.png';
import DungeonLogo from '../assets/Dungeon_logo.png';
import BattlefieldTactics from '../assets/Battlefield_tactics.png';
import SpellCast from '../assets/Spell_cast.png';
import HeroPower from '../assets/Hero_power.png';

const MainPage = () => {
  const { t } = useTranslation();
  return (
    <div className="main">
      <div className="cover">
        <div className="logo-set">
          <img className="main-logo" alt="Logo main" src={LogoMain} />
          <div className="buttons-set">
            <PrimaryButton
              showIcon={false}
              state="default"
              text="ПОДРОБНЕЕ"
              type="primary"
            />
            <PrimaryButton
              showIcon={false}
              state="default"
              text="ОБУЧЕНИЕ"
              type="secondary"
            />
          </div>
        </div>
      </div>
      <section className="main-section">
        <div className="main-description w-90">
          <h1 className="title">
            Duel of Warlords
          </h1>
          <p>
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
          <p>
            {t('gameDescription')}
          </p>
        </div>
        <div className="game-description w-90">
          <h2>
            {t('GameFactionsTitle')}
          </h2>
          <p>
            {t('gameFactions')}
          </p>
          <p className="text-mute">
            {t('hoverPictures')}
          </p>
          <div className="game-factions-set">
            <img className="factions-logo" alt="Castle logo" src={CastleLogo} />
            <img className="factions-logo" alt="Forest logo" src={ForestLogo} />
            <img className="factions-logo" alt="Academia logo" src={AcademiaLogo} />
            <img className="factions-logo" alt="Dungeon logo" src={DungeonLogo} />
          </div>
        </div>
        <div className="game-description w-90">
          <h2>
            {t('GameFeaturesTitle')}
          </h2>
          <div>
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
        <PrimaryButton showIcon={false} state="default" text="ОБУЧЕНИЕ" type="primary" />
      </section>
    </div>
  );
};

export default MainPage;

/* <div className="frame-3">
        <div className="text-wrapper-4">{t('GameDescriptTitle')}</div>
      </div>
      <div className="frame-3">
        <p className="p">
          {t('gameEssentoials')}
        </p>
      </div>
      <div className="frame-4">
        <img className="img-2" alt="Castle logo" src={CastleLogo} />
        <img className="img-2" alt="Forest logo" src={ForestLogo} />
        <img className="img-2" alt="Academia logo" src={AcademiaLogo} />
        <img className="dungeon-logo" alt="Dungeon logo" src={DungeonLogo} />
      </div>
      <div className="frame-3">
        <p className="p">
          {t('gameDescription')}
        </p>
      </div>
      <div className="griffon-and-field-wrapper">
        <img className="griffon-and-field" alt="Griffon and field" src={GriffonAndTile} />
      </div>
      <hr />
      <PrimaryButton showIcon={false} state="default" text="ОБУЧЕНИЕ" type="primary" />
    </div>
    </div> */
