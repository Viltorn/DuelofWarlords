import _ from 'lodash';
import Swift from '../../assets/castleCards/Swift.png';
import ThunderBlast from '../../assets/castleCards/ThunderBlast.png';

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
      spell: true,
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
      spell: true, attach: false, type: 'bad', aim: ['warrior', 'fighter', 'shooter', 'flyer'], name: 'attack', value: 4, depend: 'postponed', dependValue: 4, aimStatus: 'field',
    },
    {
      spell: true, attach: false, type: 'all', aim: ['adjacent', 'warrior', 'fighter', 'shooter', 'flyer'], name: 'stun', aimStatus: 'field',
    }],
    img: ThunderBlast,
    status: 'hand',
    disabled: false,
  },
};
