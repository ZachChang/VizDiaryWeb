import { useState, useEffect } from 'react';
import ReactFlow from 'react-flow-renderer';
import './App.css';
import CheckIcon from '@mui/icons-material/Check';

const addbtnStyle = {
  width: 10,
  height: 10,
  borderRadius: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}

const gapY = 20;

const defaultElements = [
  {
    id: 'start',
    type: 'default',
    data: { label: ' + '},
    style: addbtnStyle,
    position: { x: 0, y: 0 }
  },
  {
    id: '1',
    type: 'default',
    data: { label: 'JS Internship @ techSimplified', date: '1211' },
    position: { x: 0, y: 0 }
  },
  {
    id: 'end',
    type: 'default',
    data: { label: ' + '},
    style: addbtnStyle,
    position: { x: 0, y: 0 }
  },
  // { id: 'e-start-1', source: 'start', target: '1' },
  // { id: 'e-1-end', source: '1', target: 'end' },
];

const defaultModal = {
  what: '',
  when: '',
  nodePostiion: ''
}

function App() {
  const [elements, setElements] = useState(defaultElements);
  const [isShow, setisShow] = useState(false);
  const [nodeWidth, setNodeWidth] = useState(null);
  const [nodeHeight, setNodeHeight] = useState(null);
  const [addbtnWidth, setAddbtnWidth] = useState(null);
  const [addbtnHeight, setAddbtnHeight] = useState(null);
  const [modalContent, setModalContent] = useState(null);

  const onLoad = () => {
    setNodeWidth(document.getElementsByClassName('react-flow__node react-flow__node-default selectable')[1].clientWidth);
    setNodeHeight(document.getElementsByClassName('react-flow__node react-flow__node-default selectable')[1].clientHeight);
    setAddbtnWidth(document.getElementsByClassName('react-flow__node react-flow__node-default selectable')[0].clientWidth)
    setAddbtnHeight(document.getElementsByClassName('react-flow__node react-flow__node-default selectable')[0].clientHeight);
  }

  const createNode = (content) => {
    const { what, when , nodePostiion} = content;
    if (nodePostiion==='start') {
      setElements((elements) => {
        let temp = [...elements];
        temp.shift();
        temp.pop();
        return [
          {
            ...elements[0],
            position: { x: elements[0].position.x, y: elements[0].position.y - nodeHeight - gapY},
          },
          {
            id: (elements.length-1).toString(),
            data: {
              label: what,
              date: when
            },
            position: { x: window.innerWidth/2 - nodeWidth/2, y: temp[0].position.y - nodeHeight - gapY},
          },
          ...temp,
          elements[elements.length-1]
        ]
      })
    }
    if (nodePostiion==='end') {
      setElements((elements) => {
        let temp = [...elements];
        const lastElIndex = elements.length-1;
        temp.shift();
        temp.pop();
        return [
          elements[0],
          ...temp,
          {
            data: {
              label: what,
              date: when
            },
            id: (lastElIndex).toString(),
            position: { x: window.innerWidth/2 - nodeWidth/2, y: temp[temp.length-1].position.y + nodeHeight + gapY},
          },
          {
            ...elements[lastElIndex],
            position: { x: elements[lastElIndex].position.x, y: elements[lastElIndex].position.y + nodeHeight + gapY},
          }
        ]
      })
    }
    setModalContent(null)
  }

  const onElementClick = (event, element) => {
    const { id, data } = element;
    if (id === 'start' || id === 'end') {
      setModalContent({
        ...defaultModal,
        nodePostiion: id
      });
    } else {
      setModalContent({
        what: data.label,
        when: data.date,
        nodePostiion: id
      })
    }
  }

  const editNode = newNode => {
    const { what, when, nodePostiion } = newNode;
    setElements((elements) => {
      let result = elements.map(el => {
        if (el.id === nodePostiion) {
          return {
            ...el,
            data: {
              label: what,
              date: when
            }
          }
        } else {
          return el;
        }
      })
      return result;
    })
    setModalContent(null)
  }

  const onClickSave = () => {
    if (modalContent.nodePostiion === 'start' || modalContent.nodePostiion === 'end') {
      createNode(modalContent)
    } else {
      editNode(modalContent);
    }
  }

  useEffect(() => {
    if (nodeWidth && nodeHeight) {
      const startY = window.innerHeight/2 - nodeHeight/2;
      const resetDefaultX = [
        window.innerWidth/2 - addbtnWidth/2,
        window.innerWidth/2 - nodeWidth/2,
        window.innerWidth/2 - addbtnWidth/2
      ]
      const resetDefaultY = [
        startY - gapY - addbtnHeight,
        startY,
        startY + nodeHeight + gapY
      ]
      const newElements = defaultElements.map((el, i) => {
        return {
          ...el,
          position: { x: resetDefaultX[i], y: resetDefaultY[i]}
        }
      })

      setElements(newElements);
      setisShow(true)
    }
  }, [nodeWidth, nodeHeight])
  
  return (
    <div className='container'>
      <div className="flow_canvas" style={{ visibility: isShow }}>
        <ReactFlow
          elements={elements}
          onLoad={onLoad}
          onElementClick={onElementClick}
          nodesDraggable={false}
        />
      <Modal
        content={modalContent}
        cancel={() => setModalContent(null)}
        save={() => onClickSave()}
        editWhat={e => setModalContent((curr) => {
          return {
            ...curr,
            what: e.target.value
          }
        })}
        editWhen={e => setModalContent((curr) => {
          return {
            ...curr,
            when: e.target.value
          }
        })}
      />
      </div>
    </div>
  );
}

const Modal = ({ content, cancel, save, editWhat, editWhen }) => {
  if (content) {
    return(
      <div className='modal'>
        <div className='modal_what'>
          <div className='modal_title'>What?</div>
          <input className='modal_content'
            onChange={editWhat}
            value={content.what}
          />
        </div>
        <div className='modal_when'>
          <div className='modal_title'>When?</div>
          <input className='modal_content'
            onChange={editWhen}
            value={content.when}
          />
        </div>
        <div className='btn_container'>
          <div className='btn_dissmiss' onClick={() => cancel()}>Dissmiss</div>
          <div className='btn_save' onClick={() => save()}>
            <CheckIcon sx={{ color: '#A5A6F6' }} />
          </div>
        </div>
      </div>
    ) 
  } else {
    return null
  }
}

export default App;
