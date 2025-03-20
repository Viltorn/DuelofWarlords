import React from 'react';
import cn from 'classnames';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import icons from '../../../gameData/animationIcons';
import useAnimaActions from '../../../hooks/useAnimaActions.js';
import styles from './ActiveCardInfo.module.css';

const ActiveCardInfo = ({ card, type }) => {
  const { t } = useTranslation();
  const { warTokensData } = useAnimaActions();
  const { fieldCells, fieldCards } = useSelector((state) => state.battleReducer);

  const infoClass = cn({
    [styles.infoWindow]: true,
    [styles.marginRight]: type === 'player1',
    [styles.marginLeft]: type === 'player2',
    [styles.activeWindow]: type === 'window',
    [styles.buildType]: type === 'build',
  });

  const warTokens = card.type === 'warrior' || card.type === 'hero' ? warTokensData({ warCard: card, fieldCells, fieldCards }) : null;

  return (
    <div className={infoClass}>
      {card.featInfo.map((item) => (
        <div key={item} className={styles.itemBlock}>
          <h3 className={styles.tipTitle}>{t(`menuTipsHeader.${item}`)}</h3>
          <div className={styles.tipBody}>{t(`menuTipsDescription.${item}`)}</div>
        </div>
      ))}
      {warTokens && (
        warTokens.map((token) => (
          <div key={token.name} className={styles.tokenBlock}>
            <img
              key={t}
              className={styles.tokenIcon}
              src={icons[token.name]}
              alt="shield icon"
            />
            <div className={styles.itemBlock}>
              <h3 className={styles.tipTitle}>{t(`menuTipsHeader.${token.name}`)}</h3>
              <p className={styles.tipBody}>{t(`menuTipsDescription.${token.name}`)}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ActiveCardInfo;
