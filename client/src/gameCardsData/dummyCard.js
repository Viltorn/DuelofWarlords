import _ from 'lodash';
import TrainingDummy from '../assets/TrainingDummy.png';

const dummyCard = {
  name: 'Dummy',
  type: 'spell',
  subtype: 'instant',
  description: 'Вы получаете дополнительное 1 очко действия в этому ходу',
  id: _.uniqueId(),
  features: [{
    attach: false, type: 'all', aim: ['warrior'], name: 'increasepoints', value: 1, condition: 'insteadatk', cost: 0,
  }],
  img: TrainingDummy,
  status: 'hand',
  player: 'player2',
  turn: 0,
};

export default dummyCard;
