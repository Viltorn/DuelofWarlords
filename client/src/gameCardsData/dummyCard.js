import _ from 'lodash';
import TrainingDummy from '../assets/TrainingDummy.png';

const dummyCard = {
  name: 'Dummy', type: 'spell', subtype: 'instant', description: 'Вы получаете дополнительное 1 очко действия или вытягиваете карту из колоды, или отнимаете 1 здоровье у воина на поле', id: _.uniqueId(), feature: '', img: TrainingDummy, status: 'hand',
};

export default dummyCard;
