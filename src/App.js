import { useState, useEffect } from 'react';
import ReactFlow from 'react-flow-renderer';
import './App.css';

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
    data: { label: 'JS Internship @ techSimplified' },
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

const defaultNode = {
  type: 'default',
  data: { label: 'JS Internship @ techSimplified' },
}

function App() {
  const [elements, setElements] = useState(defaultElements);
  const [isShow, setisShow] = useState(false);
  const [nodeWidth, setNodeWidth] = useState(null);
  const [nodeHeight, setNodeHeight] = useState(null);
  const [addbtnWidth, setAddbtnWidth] = useState(null);
  const [addbtnHeight, setAddbtnHeight] = useState(null);

  const onLoad = () => {
    setNodeWidth(document.getElementsByClassName('react-flow__node react-flow__node-default selectable')[1].clientWidth);
    setNodeHeight(document.getElementsByClassName('react-flow__node react-flow__node-default selectable')[1].clientHeight);
    setAddbtnWidth(document.getElementsByClassName('react-flow__node react-flow__node-default selectable')[0].clientWidth)
    setAddbtnHeight(document.getElementsByClassName('react-flow__node react-flow__node-default selectable')[0].clientHeight);
  }

  const onElementClick = (event, element) => {
    if (element.id==='start') {
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
            ...defaultNode,
            id: (elements.length-1).toString(),
            position: { x: window.innerWidth/2 - nodeWidth/2, y: temp[0].position.y - nodeHeight - gapY},
          },
          ...temp,
          elements[elements.length-1]
        ]
      })
    }
    if (element.id==='end') {
      setElements((elements) => {
        let temp = [...elements];
        const lastElIndex = elements.length-1;
        temp.shift();
        temp.pop();
        return [
          elements[0],
          ...temp,
          {
            ...defaultNode,
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
    <div className="App" style={{ visibility: isShow }}>
      <ReactFlow
        elements={elements}
        onLoad={onLoad}
        onElementClick={onElementClick}
        nodesDraggable={false}
      />
    </div>
  );
}

export default App;
