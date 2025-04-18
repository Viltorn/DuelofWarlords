import tutorialTextRU from './tutorialTextRU';
import { menuTipsHeaders, menuTipsText } from './menuTipsRU';
import AcademiaInfo from './academiaCardsInfoRU';
import CastleInfo from './castleCardsInfoRU';
import castleCardsNamesRU from './castleCardsNamesRU';
import academiaCardsNamesRU from './academiaCardsNamesRU';
import airSpellsInfo from './Spells/airSpellsInfoRU';
import airSpellsNames from './Spells/airSpellsNamesRU';
import lightSpellsInfoRU from './Spells/lightSpellsInfoRU';
import lightSpellsNamesRU from './Spells/lightSpellsNamesRU';
import shadowSpellsInfoRU from './Spells/shadowSpellsInfoRU';
import shadowSpellsNamesRU from './Spells/shadowSpellsNamesRU';
import waterSpellsInfoRU from './Spells/waterSpellsInfoRU';
import waterSpellsNamesRU from './Spells/waterSpellsNamesRU';
import fireSpellsInfoRU from './Spells/fireSpellsInfoRU';
import fireSpellsNamesRU from './Spells/fireSpellsNamesRU';
import skillsInfoRU from './Spells/skillsInfoRU';
import skillsNamesRU from './Spells/skillsNamesRU';
import castleCardsTypesRU from './castleCardsTypesRU';

export default {
  translation: {
    mainPage: {
      mainDescription: `- это коллекционная карточная игра, созданная на основе Might and Magic: Duel of Champions (MMDoС),
      которая ныне официально не поддерживается. У MMDoС было много поклонников, но она имела высокий порог входа, а также у нее не было мобильной версии. 
      В Duel of Warlords переработана оригинальная механика, которая более легка в освоении, но при этом она позволяет игре 
      оставаться все такой же интересной и вариативной, а также появилась возможность играть в мобильную версию`,
      gameDescription: `Игра представляет собой тактическую дуэль 2-х игроков в фэнтезийном мире, вдохновленном серией игр "Герои Меча и Магии". 
      Каждый из игроков управляет одним из уникальных героев в игре, принадлежащих выбранной фракции. 
      В процессе игры оппоненты по очереди разыгрывают карты заклинаний и воинов, а также перемещают их по полю боя для достижения главной цели - снизить количество здоровья вражеского героя до 0 очков`,
      gameFactions: `Выбирайте одну из 6-ти доступных фракций в игре: 
      Замок - рассчитывает на силу воинов и тактики на поле боя, Академия - могучие волшебники, использующие магию, чтобы удивлять противника, Подземелье - опасные убийцы, предпочитающие нечестные приемы, Лес - специализируются на стрельбе и ловушках, 
      Некрополис - вытягивают жизнь из противников и воскрешают павших воинов, Крепость - жестокие варвары, не жалеющие воинов для победы`,
      hoverPictures: '(наведите на картинки)',
      moreAboutMMdoc: 'Больше об MMDoС',
      Battlefield: 'ПОЛЕ БОЯ',
      Heroes: 'ГЕРОИ',
      Spells: 'ЗАКЛИНАНИЯ',
      PostponedCard: 'КОМБИНАЦИИ КАРТ',
      BattlefieldDescription: `В игре 3 класса воинов: бойцы ближнего боя, летающие и стрелки. 
      Вам необходимо грамотно расставлять и перемещать их на поле боя, чтобы использовать преимущества каждого класса и сдерживать натиск врага 
      или же, наоборот, проводить грамотную атаку`,
      HeroPowerDescription: `Герои непосредственно участвуют в сражении: атакуют врага или применяют полезные заклинания. 
      Каждому герою доступны уникальная и стандартная способности, а также вы можете добавлять другие способности с помощью заклинаний-артефактов`,
      SpellsDescription: `Разнообразные виды заклинаний добавляют тактической вариативности: атакуйте врага разовыми заклинаниями, контролируйте поле боя с помощью временных эффектов, усиливайте своих воинов с помощью карт постоянных заклинаний или же
      удивляйте врага неожиданными ловушками`,
      PostponedDescription: 'В игре большую роль играет не только ваша колода, но и то, как вы ее разыграете: неожиданные комбинации, заманивание противника в невыгодные позиции - от этого зависит успех сражения!',
      GameDescriptTitle: 'ОПИСАНИЕ ИГРЫ',
      GameFactionsTitle: 'ИГРОВЫЕ ФРАКЦИИ',
      GameFeaturesTitle: 'ИГРОВЫЕ ОСОБЕННОСТИ',
      FeedBackLine: 'Для обратной связи пишите нам в мессенджеры: ',
    },
    Contact: 'Контакты:',
    DeckBuilder: 'КОЛОДОСТРОЕНИЕ',
    VoiceLobby: 'Голосовой чат:',
    PageNotFound: 'Страница не найдена',
    YouCanChangeover: 'Вы можете перейти',
    GoToMain: 'на главную страницу',
    midSpell: 'ЦЕНТРАЛЬНАЯ КЛЕТКА',
    topSpell: 'РЯДОМ С ЛИНИЕЙ',
    bigSpell: 'ОБЩАЯ КЛЕТКА',
    field: 'ПОЛЕ ВОИНА',
    Hero: 'ГЕРОЙ',
    PostponedSpell: 'ОТЛОЖЕННАЯ КАРТА',
    Graveyard: 'СТОК',
    Deck: 'КОЛОДА',
    RotateScreen: 'ПОВЕРНИТЕ ЭКРАН',
    ActiveCard: 'Aктивная карта',
    Player1: 'Игрок 1',
    Player2: 'Игрок 2',
    ChangeHP: 'ПОМЕНЯТЬ ЗДОРОВЬЕ',
    PlayedCards: 'СЫГРАННЫЕ КАРТЫ',
    ChangePoints: 'ИЗМЕНИТЬ ОЧКИ ДЕЙСТВИЯ',
    DeckName: 'Название колоды',
    YourDecks: 'Вашы колоды',
    AvailableCards: 'Доступные карты',
    DeckSaved: 'Ваша колода успешно сохранена!',
    DeleteDeckWarn: 'Вы уверены, что хотите удалить колоду?',
    SaveChangesWarn: 'Вы уверены, что хотите выйти без сохранения изменений?',
    DrawCards: 'ВЗЯТЬ НЕДОСТАЮЩИЕ КАРТЫ?',
    DrawCard: 'ВЗЯТЬ',
    ResetBtn: 'СБРОСИТЬ',
    Install: 'УСТАНОВИТЬ',
    TutorialWelcome: 'Добро пожаловать в обучающий режим!',
    TutorialDescription: 'Здесь вы изучите основы игры Duel of Warlords',
    TutorialFinish: 'Поздравляем! Вы прошли обучение Dueld of Warlords',
    TutorialTips: 'Ниже дополнительная информация, которая вам пригодится в стандартной игре',
    ChatHeader: 'Добро пожаловать в чат!',
    CurrentRooms: 'ТЕКУЩИЕ ИГРЫ',
    YourName: 'Ваше имя',
    Password: 'Пароль...',
    RoomsOwner: 'Владелец комнаты: ',
    EmptySlot: 'ПУСТОЙ СЛОТ',
    WaitForPLayer: 'Ожидание второго игрока...',
    PlayerDisconnected: 'Игрок отключился от сервера: ',
    YouDisconnected: 'Вы отключились от сервера',
    GameEnd: 'Игра окончена! Победил игрок: ',
    YourTurn: 'Ваш ход!',
    ResetWarning: 'Если вы продолжите, текущий прогресс будет сброшен. Продолжить?',
    CurrentOnline: 'Игроки онлайн',
    Chat: 'Чат:',
    ConnectProblem: 'Проблемы с соединением у одного из игроков: попробуйте совершить действие еще раз',
    RepeatPassword: 'Повторите пароль...',
    Loading: 'Загрузка...',
    PlayerType: '',
    ChooseGame: 'Выбрать игру',
    YourDeck: 'Ваша колода',
    DeckLimits: '(Мин. - 30 карт, Макс. - 40 карт)',
    AttachedCards: 'Наложенные заклинания',
    Timer: 'Таймер хода',
    Round: 'Раунд',
    CombatLog: 'Лог боя',
    You: 'Вы',

    tutorialTips: {
      Tips: 'ПОДСКАЗКИ',
      Tip1: 'Вы всегда можете нажать на сток карт, чтобы посмотреть карты, сыгранные вами или вашим оппонентом',
      Tip2: 'В первом раунде игры вы можете скинуть любое количество карт из руки в конец колоды и 1 раз взять столько же взамен из вашей колоды сверху',
      Tip3: 'В течение игры один раз за раунд игрок может скинуть 1 карту из руки в колоду и взять оттуда новую карту взамен',
      Tip4: 'Кликнув в игре на текстовое поле на активной карте, можно посмотреть подробное описание карты',
      Tip5: 'В верхнем правом углу игрового поля (если вы играете за игрока 2, то верхнем левом углу) отображается текущее количество карт в руке оппонента',
    },

    difficulty: {
      Easy: 'Легко',
      Normal: 'Нормально',
      Hard: 'Сложно',
      Impossible: 'Невозможно',
    },

    buttons: {
      CHANGE: 'ПОМЕНЯТЬ',
      FEATURES: 'ПОДРОБНЕЕ',
      PLAY: 'ИГРАТЬ',
      DECKBUILDER: 'КОЛОДОСТРОЕНИЕ',
      TUTORIAL: 'ОБУЧЕНИЕ',
      HOTSEAT: 'ТРЕНИРОВКА',
      CREATEDECK: 'СОЗДАТЬ НОВУЮ',
      SAVEDECK: 'СОХРАНИТЬ КОЛОДУ',
      ONLINEGAME: 'ОНЛАЙН',
      START: 'НАЧАТЬ',
      BACK: 'НАЗАД',
      ENTER: 'ВОЙТИ',
      EXIT: 'ВЫЙТИ',
      LOGIN: 'ВОЙТИ',
      SIGNUP: 'РЕГИСТРАЦИЯ',
      CONTINUE: 'ПРОДОЛЖИТЬ',
      DELETE: 'УДАЛИТЬ',
      EndTurn: 'ЗАКОНЧИТЬ ХОД',
      CREATE: 'СОЗДАТЬ',
      JOIN: 'ПРИСОЕДИНИТЬСЯ',
      MAIN: 'ГЛАВНАЯ',
      GAMECHOOSE: 'ВЫБРАТЬ ИГРУ',
      RESETGAME: 'СБРОСИТЬ ПРОГРЕСС',
      SEND: 'ОТПРАВИТЬ',
      GOLOBBY: 'В ЛОББИ',
      CREATEROOM: 'СОЗДАТЬ ИГРУ',
      CLOSE: 'ЗАКРЫТЬ',
    },

    modals: {
      ChangeStartCards: 'Для замены стартовой руки отправьте необходимые карты обратно в колоду, а после нажмите "ПРОДОЛЖИТЬ"',
      LogIn: 'Войти',
      SignUp: 'Регистрация',
      DontHaveAcc: 'Нет аккаунта?',
      HaveAcc: 'Уже есть аккаунт?',
      LoginName: 'Логин',
      CantBuildDeck: '(Вы не сможете собрать колоды и играть онлайн)',
      GuestSignIn: 'Продолжить как гость',
      SignUpLink: 'РЕГИСТРАЦИЯ',
      LogInLink: 'ВОЙТИ',
      ChooseFactions: 'ВЫБЕРИТЕ ФРАКЦИЮ И ГЕРОЯ',
      GameTest: 'Тестирование',
      GameType: 'Режим игры',
      HotSeat: 'Тренировка',
      PlayerType: 'Тип',
      HumanPlayer: 'Человек',
      ComputerPlayer: 'Компьютер',
      GameDifficulty: 'Сложность',
      ChooseDeck: 'Выбрать колоду',
    },

    errors: {
      captchaError: 'Капча не пройдена',
      RoomNotExist: 'Комната не найдена!',
      RoomEmpty: 'Эта комната пустая!',
      RoomFull: 'Комната уже полная!',
      IncorrectPass: 'Неверный пароль!',
      UserDoesNotExist: 'Пользователь не найден!',
      DatabaseError: 'Ощибка сервера',
      WrongPass: 'Неверный пароль!',
      UserAlreadyExist: 'Такой пользователь уже существует!',
      AuthOrNetError: 'Ошибка авторизации или соединения',
      AccountNotFound: 'Логин не найден',
      PasswordInvalid: 'Неверный пароль!',
      AuthorizationError: 'Пожалуйста, авторизуйте аккаунт',
      LoginError: 'Пожалуйста, проверьте данные для входа',
      Conflict: 'Такой пользователь уже существует',
      Required: 'Обязательное поле',
      OnlyNumber: 'Допустимы только цифры',
      Min3Max10: 'Длина от 3 до 10 символов',
      Min3Max20: 'Длина от 3 до 20 символов',
      Min6: 'Не менее 6 символов',
      Unique: 'Этот чат уже добавлен',
      UniqueName: 'Такое имя уже есть',
      Identical: 'Пароли должны совпадать',
      NetworkError: 'Ошибка соединения',
      'Network Error': 'Ошибка соединения',
      meetDeckRequirments: 'Выберите героя!',
      MaximumDecks: 'Вы уже создали максимальное количество колод!',
      YouNeedTwoDecks: 'У вас должно быть хотя бы 2 колоды!',
      false: '',
    },

    description: {
      Skills: skillsInfoRU,
      Castle: CastleInfo,
      Academia: AcademiaInfo,
      Air: airSpellsInfo,
      Light: lightSpellsInfoRU,
      Shadow: shadowSpellsInfoRU,
      Water: waterSpellsInfoRU,
      Fire: fireSpellsInfoRU,
    },

    titles: {
      Skills: skillsNamesRU,
      Castle: castleCardsNamesRU,
      Academia: academiaCardsNamesRU,
      Air: airSpellsNames,
      Light: lightSpellsNamesRU,
      Shadow: shadowSpellsNamesRU,
      Water: waterSpellsNamesRU,
      Fire: fireSpellsNamesRU,
    },

    cells: {
      topSpell: 'Линия',
      bigSpell: 'Общее заклинание',
      midSpell: 'Шеренга',
      field: 'Поле',
      graveyard: 'Сброс',
    },

    types: {
      warrior: {
        Castle: castleCardsTypesRU,
      },
    },

    abilities: {
      windStaff: 'ПОСОХ ВЕТРА',
      enchancedShot: 'СИЛЬНЫЙ ВЫСТРЕЛ',
      fireMageCast: 'ОГНЕННЫЙ ШАР',
      retributionSword: 'МЕЧ ВОЗМЕЗДИЯ',
      meleeCombat: 'ДВА КИНЖАЛА',
      righteousHammer: 'ПРАВЕДНЫЙ МОЛОТ',
      shockWaveCast: 'УДАРНАЯ ВОЛНА',
      returnSpell: 'ВЕРНУТЬ ЗАКЛИНАНИЕ',
      increasePoints: 'ПРИБАВИТЬ ОЧКИ',
      lightAttack: 'АТАКА СВЕТОМ',
      warRessurect: 'ВОСКРЕСИТЬ ВОИНА',
      invoke: 'СПОСОБНОСТЬ',
      heal: 'ВЫЛЕЧИТЬ',
      sucrifice: 'ЖЕРТВОВАТЬ',
      stealPoints: 'УКРАСТЬ ОЧКИ',
      attack: 'АТАКОВАТЬ',
      ressurect: 'ВЕРНУТЬ КАРТУ',
      drawCard: 'ВЫТЯНУТЬ КАРТУ',
      ability: 'СПОСОБНОСТЬ',
      return: 'В РУКУ',
      deckreturn: 'В КОЛОДУ',
      graveyard: 'В СТОК',
      switchcard: 'ЗАМЕНИТЬ',
      healthBar: 'ИЗМЕНИТЬ',
      turnLeft: 'ПОВЕРНУТЬ',
      turnRight: 'ПОВЕРНУТЬ',
      addToDeck: 'ДОБАВИТЬ',
      deleteFromDeck: 'УДАЛИТЬ',
    },

    statuses: {
      CaptchaPassed: 'Капча пройдена!',
      CaptchaInProcess: 'Капча в процессе',
    },

    misc: {
      Min: 'мин.',
    },

    tutorialSteps: tutorialTextRU,
    menuTipsHeader: menuTipsHeaders,
    menuTipsDescription: menuTipsText,
  },
};
