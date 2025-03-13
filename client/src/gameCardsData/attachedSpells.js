import _ from 'lodash';
import AttachedSpells from '@assets/AttachedSpells.png';

const AttchedSpells = {
  name: 'fake',
  type: 'spell',
  subtype: 'attachedSpells',
  showQty: 0,
  featInfo: [],
  id: _.uniqueId(),
  description: 'AttachedSpells',
  cost: 0,
  currentC: 0,
  school: 'Skills',
  attachments: [],
  features: [],
  img: AttachedSpells,
  status: 'hand',
  turn: 0,
};

export default AttchedSpells;
