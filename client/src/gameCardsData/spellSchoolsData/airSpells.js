import _ from 'lodash';
import Swift from '../../assets/castleDeck/Swift.png';
import ThunderBlast from '../../assets/castleDeck/ThunderBlast.png';

export default {
  Swiftness: {
    name: 'Swiftness',
    type: 'spell',
    subtype: 'permanent',
    cost: 2,
    currentC: 2,
    featInfo: [],
    description: 'Swiftness',
    school: 'Air',
    id: _.uniqueId(),
    place: 'warrior',
    features: [{
      attach: ['warrior', 'flyer', 'shooter', 'fighter'],
      aim: ['warrior'],
      type: 'good',
      name: 'swift',
      aimStatus: 'field',
    }],
    img: Swift,
    status: 'hand',
    disabled: false,
  },
  ThunderBlast: {
    name: 'Thunder Blast',
    type: 'spell',
    subtype: 'instant',
    cost: 4,
    currentC: 4,
    featInfo: [],
    description: 'ThunderBlast',
    school: 'Air',
    id: _.uniqueId(),
    place: '',
    features: [{
      attach: false, type: 'bad', aim: ['warrior', 'fighter', 'shooter', 'flyer'], name: 'attack', value: 3, depend: 'postponed', dependValue: 4, aimStatus: 'field',
    },
    {
      attach: false, type: 'all', aim: ['adjacent', 'warrior', 'fighter', 'shooter', 'flyer'], name: 'stun', aimStatus: 'field',
    }],
    img: ThunderBlast,
    status: 'hand',
    disabled: false,
  },
};
