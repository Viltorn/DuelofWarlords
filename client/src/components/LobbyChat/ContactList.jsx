import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styles from './ContactList.module.css';

const ContactList = () => {
  const { onlinePlayers } = useSelector((state) => state.gameReducer);
  const { t } = useTranslation();

  return (
    <div className={styles.window}>
      <h2 className={styles.header}>{t('CurrentOnline')}</h2>
      <ul className={styles.contactList}>
        {onlinePlayers && (
          onlinePlayers.map((player) => (
            <p className={styles.playerName} key={player}>{player}</p>
          )))}
      </ul>
    </div>
  );
};

export default ContactList;
