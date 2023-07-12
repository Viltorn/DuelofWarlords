import React from 'react';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';

const HeroPad = ({ player }) => {
  const { t } = useTranslation();
  const classesContainer = cn({
    'hero-container-1': player === 1,
    'hero-container-2': player === 2,
  });

  return (
    <div className={classesContainer}>
      {player === 2 && (
        <div className="cell-hero-pad">
          <h3 className="default-cell-font">Hand</h3>
        </div>
      )}
      {player === 1 ? (
        <>
          <div className="cell-hero-pad">
            <h3 className="default-cell-font">{t('Deck')}</h3>
          </div>
          <div className="cell-hero-pad">
            <h3 className="default-cell-font">{t('Hero')}</h3>
          </div>
          <div className="cell-hero-pad">
            <h3 className="default-cell-font">{t('Graveyard')}</h3>
          </div>
          <div className="cell-hero-pad">
            <h3 className="default-cell-font">{t('PostponedSpell')}</h3>
          </div>
        </>
      ) : (
        <>
          <div className="cell-hero-pad">
            <h3 className="default-cell-font">{t('Hero')}</h3>
          </div>
          <div className="cell-hero-pad">
            <h3 className="default-cell-font">{t('PostponedSpell')}</h3>
          </div>
          <div className="cell-hero-pad">
            <h3 className="default-cell-font">{t('Deck')}</h3>
          </div>
          <div className="cell-hero-pad">
            <h3 className="default-cell-font">{t('Graveyard')}</h3>
          </div>
        </>
      )}
    </div>
  );
};

export default HeroPad;
