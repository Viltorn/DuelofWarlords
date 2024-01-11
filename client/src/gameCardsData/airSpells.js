import _ from 'lodash';
import Swift from '../assets/CastleDeck/Swift.png';
import ThunderBlast from '../assets/CastleDeck/ThunderBlast.png';

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
      attach: ['warrior'],
      aim: ['warrior'],
      type: 'good',
      name: 'swift',
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
      attach: false, type: 'bad', aim: ['warrior', 'fighter', 'shooter', 'flyer'], name: 'attack', value: 3, depend: 'postponed', dependValue: 4,
    },
    {
      attach: false, type: 'all', aim: ['adjacent'], name: 'stun',
    }],
    img: ThunderBlast,
    status: 'hand',
    disabled: false,
  },
};
