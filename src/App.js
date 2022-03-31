import { useState, useEffect } from 'react';
import ReactFlow from 'react-flow-renderer';
import Modal from './component/Modal'
import { defaultElements, firstElements, defaultModal, gapY, storageDataKey, storageConfigKey } from './config';
import { nodeStyle } from './style'
import './App.css';
import AddIcon from '@mui/icons-material/Add';

function App() {
  const [elements, setElements] = useState(defaultElements);
  const [isNodeShow, setIsNodeShow] = useState(false);
  const [nodeWidth, setNodeWidth] = useState(null);
  const [nodeHeight, setNodeHeight] = useState(null);
  const [addbtnWidth, setAddbtnWidth] = useState(null);
  const [addbtnHeight, setAddbtnHeight] = useState(null);
  const [modalContent, setModalContent] = useState(null);
  const [isFirstNodeCreated, setIsFirstNodeCreated] = useState(false);

  const saveNodeInLocal = newEl => {
    localStorage.setItem(storageDataKey,
      JSON.stringify({
        elements: newEl,
        isFirstNodeCreated
      })
    )
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
    const { what, when , detail, nodePostiion} = content;
    if (isNodeShow && isFirstNodeCreated) {
      // If the node tree is already build, add new node on it
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
        const result = genEdge(reOrderNodes(tempEls))
        setElements(result)
        saveNodeInLocal(result)
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
        const result = genEdge(reOrderNodes(tempEls))
        setElements(result)
        saveNodeInLocal(result)
      }
    } else {
      // Set the base size for the first node
      let newEl = [...firstElements];
      newEl[1].data.label = what;
      newEl[1].data.date = when;
      newEl[1].data.detail = detail;
      setElements(newEl);
      setIsNodeShow(false)
      setIsFirstNodeCreated(true)
      saveNodeInLocal(newEl)
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
        detail: data.detail,
        nodePostiion: id
      })
    }
  }

  const editNode = newNode => {
    const { what, when, detail, nodePostiion } = newNode;
    let temp = elements.map(el => {
      if (el.id === nodePostiion) {
        return {
          ...el,
          data: {
            label: what,
            date: when,
            detail: detail
          }
        }
      } else {
        return el;
      }
    })
    const result = genEdge(reOrderNodes(removeEdge(temp))) 
    setElements(result)
    saveNodeInLocal(result)
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
    let isDeletingLastNode = elements.length === 5;
    if (isDeletingLastNode) {
      resetToDefault()
    } else {
      const { nodePostiion } = modalContent;
      let temp = [...elements]
      const targetIndex = temp.map(el => el.id).indexOf(nodePostiion);
  
      // Nodes before the delete node move down
      temp.forEach((el, i) => {
        if (i < targetIndex) {
          temp[i].position = {
            ...temp[i].position,
            y: temp[i].position.y + nodeHeight + gapY
          }
        }
      })
      
      // delete the target node
      let newEls = temp.filter(function(item) {
        return item.id !== nodePostiion
      })
      const result = genEdge(reOrderNodes(removeEdge(newEls)))
      setElements(result)
      saveNodeInLocal(result)
    }
    setModalContent(null) 
  }

  const onLoad = () => {
    const addBtn = document.getElementsByClassName('react-flow__node react-flow__node-default selectable')[0];
    setAddbtnWidth(addBtn.clientWidth)
    setAddbtnHeight(addBtn.clientHeight);
  }

  const resetToDefault = () => {
    setIsFirstNodeCreated(false);
    setElements(el => [el[0]])
  }

  useEffect(() => {
    // When first node creating, we should get the size, and set chart to visible
    if (!isNodeShow) {
      // TODO: find a better way to access the new node on DOM tree
      setTimeout(() => {
        const nodeEl = document.getElementsByClassName('react-flow__node react-flow__node-default')[1];
        if (nodeEl) {
          setNodeWidth(nodeEl.clientWidth);
          setNodeHeight(nodeEl.clientHeight);
        }
      }, 300);
    }
  }, [elements])

  useEffect(() => {
    // resize add btn
    if (addbtnWidth && addbtnHeight && elements.length === 1) {
      localStorage.setItem(storageConfigKey,
        JSON.stringify({
          addbtnWidth,
          addbtnHeight
        }))
      setElements(el => {
        return [{
          ...el[0],
          position: {
            x: window.innerWidth/2 - addbtnWidth/2,
            y: window.innerHeight/2 - addbtnHeight
          }
        }]
      })
    }
  }, [addbtnWidth, addbtnHeight])
  
  useEffect(() => {
    // resize node
    if (nodeWidth && nodeHeight && elements.length < 6) {

      localStorage.setItem(storageConfigKey,
        JSON.stringify({
          addbtnWidth,
          addbtnHeight,
          nodeWidth,
          nodeHeight
        })
      )

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
      const newElements = elements.map((el, i) => {
        return {
          ...el,
          position: { x: resetDefaultX[i], y: resetDefaultY[i]}
        }
      })
      setElements(newElements);
      setIsNodeShow(true);
      
    }
  }, [nodeWidth, nodeHeight, isNodeShow])

  useEffect(() => {
    //TODO: save for differ size device
    // check if there is local storage data
    const data = JSON.parse(localStorage.getItem(storageDataKey));
    const config = JSON.parse(localStorage.getItem(storageConfigKey));

    if (data && config) {
      const { elements, isFirstNodeCreated } = data
      const { nodeWidth, nodeHeight, addbtnWidth, addbtnHeight } = config;
      setElements(elements.map(el => {
        if (el.id ==='start' || el.id === 'end') {
          return {
            ...el,
            data: { label: <AddIcon sx={{ color: '#A5A6F6' }} /> }
          }
        } else {
          return el
        }
      }));
      setNodeWidth(nodeWidth)
      setNodeHeight(nodeHeight)
      setAddbtnWidth(addbtnWidth)
      setAddbtnHeight(addbtnHeight)
      setIsFirstNodeCreated(isFirstNodeCreated)
    }
    setIsNodeShow(true)
  }, [])

  return (
    <div className='container'>
      <div className={`flow_canvas ${isNodeShow ? 'visible': 'invisible'}`}>
        <ReactFlow
          onLoad={onLoad}
          elements={elements}
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
        editDetail={e => setModalContent((curr) => {
          return {
            ...curr,
            detail: e.target.value
          }
        })}
      />
      </div>
    </div>
  );
}

export default App;
