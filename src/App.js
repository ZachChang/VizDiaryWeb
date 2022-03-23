import { useState, useEffect } from 'react';
import ReactFlow from 'react-flow-renderer';
import Modal from './component/Modal'
import AddIcon from '@mui/icons-material/Add';
import './App.css';

const addbtnStyle = {
  width: 20,
  height: 20,
  borderRadius: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};
const nodeStyle = {
  borderRadius: '20px'
}
const gapY = 20;
const currentTime = new Date();
const defaultElements = [
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
    data: { label: 'First event', date: currentTime },
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
  const removeEdge = nodes => {
    return [...nodes].filter(function(item) {
      return !item.isEdge
    })
  }
  const genEdge = els => {
    let temp = [...els];
    let newEdges = [];
    for (let i = 0; i < temp.length - 1; i++) {
      const src = temp[i].id;
      const trg = temp[i+1].id;
      newEdges.push({
        id: `${src}-${trg}`,
        source: `${src}`,
        target: `${trg}`,
        isEdge: true
      })      
    }
    return [
      ...temp,
      ...newEdges
    ];
  }
  const reOrderNodes = nodes => {
    let temp = [...nodes];
    let postions = [];
    temp.shift();
    temp.pop();
    temp.forEach(obj => {
      postions.push(obj.position);
    })
    temp.sort((a, b) => {
      return new Date(a.data.date).getTime() - new Date(b.data.date).getTime();
    });
    // combine new order and postion
    for (let i = 0; i < temp.length; i++) {
      temp[i].position = postions[i];
    }

    return [
      nodes[0],
      ...temp,
      nodes[nodes.length-1]
    ]
  }
  const createNode = (content) => {
    const { what, when , nodePostiion} = content;
    const lastNode = elements.find(el => el.id === 'end');
    let temp = [...elements].filter(function(item) {
      return !item.isEdge
    })
    if (nodePostiion==='start') {
      temp.shift();
      let tempEls = [
        {
          ...elements[0],
          position: { x: elements[0].position.x, y: elements[0].position.y - nodeHeight - gapY},
        },
        {
          id: (temp.length).toString(),
          type: 'default',
          style: nodeStyle,
          data: {
            label: what,
            date: when
          },
          position: { x: window.innerWidth/2 - nodeWidth/2, y: temp[0].position.y - nodeHeight - gapY},
        },
        ...temp
      ];
      setElements(genEdge(reOrderNodes(tempEls)))
    }
    if (nodePostiion==='end') {
      temp.pop();
      let tempEls = [
        ...temp,
        {
          data: {
            label: what,
            date: when
          },
          style: nodeStyle,
          type: 'default',
          id: (temp.length).toString(),
          position: { x: window.innerWidth/2 - nodeWidth/2, y: temp[temp.length-1].position.y + nodeHeight + gapY},
        },
        {
          ...lastNode,
          position: { x: lastNode.position.x, y: lastNode.position.y + nodeHeight + gapY},
        }
      ]
      setElements(genEdge(reOrderNodes(tempEls)))
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
    let temp = elements.map(el => {
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
    setElements(genEdge(reOrderNodes(removeEdge(temp))))
    setModalContent(null)
  }

  const onClickSave = () => {
    if (modalContent.nodePostiion === 'start' || modalContent.nodePostiion === 'end') {
      createNode(modalContent)
    } else {
      editNode(modalContent);
    }
  }

  const deleteNode = () => {
    const { nodePostiion } = modalContent;
    let temp = [...elements].filter(function(item) {
      return item.id !== nodePostiion
    })
    setElements(genEdge(reOrderNodes(removeEdge(temp))))
    setModalContent(null)
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
        deleteNode={() => deleteNode()}
        editWhat={e => setModalContent((curr) => {
          return {
            ...curr,
            what: e.target.value
          }
        })}
        editWhen={value => setModalContent((curr) => {
          return {
            ...curr,
            when: value
          }
        })}
      />
      </div>
    </div>
  );
}

export default App;
