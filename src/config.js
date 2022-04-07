import AddIcon from '@mui/icons-material/Add';
import { addbtnStyle, nodeStyle } from './style'

const currentTime = new Date();

const defaultElements = [
    {
        id: 'start',
        type: 'default',
        data: { label: <AddIcon sx={{ color: '#A5A6F6' }} />},
        style: addbtnStyle,
        position: { x: 0, y: 0 }
    }
]

const firstElements = [
  {
    id: 'start',
    type: 'default',
    data: { label: <AddIcon sx={{ color: '#A5A6F6' }} />},
    style: addbtnStyle,
    position: { x: 0, y: 0 }
  },
  {
    id: '1',
    type: 'default',
    data: { label: 'My first event', date: currentTime, details: '' },
    style: nodeStyle,
    position: { x: 0, y: 0 }
  },
  {
    id: 'end',
    type: 'default',
    data: { label: <AddIcon sx={{ color: '#A5A6F6' }} />},
    style: addbtnStyle,
    position: { x: 0, y: 0 }
  },
  { id: '1', source: 'start', target: '1', isEdge: true },
  { id: '2', source: '1', target: 'end', isEdge: true },
];

const defaultModal = {
    what: '',
    when: '',
    details: '',
    nodePosition: ''
}

const gapY = 20;

const storageDataKey = 'viz-diary-data';
const storageConfigKey = 'viz-diary-config';

export {
    defaultElements,
    firstElements,
    defaultModal,
    gapY,
    storageDataKey,
    storageConfigKey
}