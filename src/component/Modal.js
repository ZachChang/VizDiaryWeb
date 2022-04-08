import { useEffect, useState } from 'react'
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import DatePicker from 'react-date-picker';

const Modal = ({ content, cancel, save, editWhat, editWhen, editDetails, deleteNode }) => {
  const [isShowDoubleCheck, setIsShowDoubleCheck] = useState(false);
  const onClickDlete = () => {
    setIsShowDoubleCheck(false)
    deleteNode()
  }
  const onClickBg = () => {
    setIsShowDoubleCheck(false)
    cancel()
  }
  useEffect(() => {
    const listener = event => {
      if (event.code === "Enter" || event.code === "NumpadEnter" || event.key === 'Enter' || event.keyCode === 13) {
        event.preventDefault();
        save()
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [content]);

  if (content) {
    return(
      <>
        <div className='modal'>
          {isShowDoubleCheck ? 
            <DoubleCheck
              deleteNode={onClickDlete}
              cancel={() => setIsShowDoubleCheck(false)}
            /> :
            <>
              <div className='modal_what'>
                <div className='modal_title'>Label</div>
                <input
                  className='modal_content'
                  onChange={editWhat}
                  value={content.what}
                  placeholder={randomWhatPlaceholder()}
                />
              </div>
              <div className='modal_when'>
                <div className='modal_title'>When?</div>
                <DatePicker
                  onChange={editWhen}
                  value={content.when || new Date()}
                />
              </div>
              <div className='modal_details'>
                <div className='modal_title'>Details</div>
                <textarea
                  className='modal_content'
                  onChange={editDetails}
                  value={content.details}
                />
              </div>
              <div className='btn_container'>
                <div className='btn_dismiss' onClick={() => cancel()}>dismiss</div>
                {content.nodePosition !== 'start' && content.nodePosition !== 'end' &&
                  <div className='btn_delete' onClick={() => setIsShowDoubleCheck(true)}>
                    <DeleteIcon sx={{ color: '#fb7474' }}/>
                  </div>
                }
                <div className='btn_save' onClick={() => save()}>
                  <CheckIcon sx={{ color: '#A5A6F6' }} />
                </div>
              </div>
            </>
          }
        </div>
        <div className='modal_background' onClick={() => onClickBg()}></div>
      </>
    ) 
  } else {
    return null
  }
}

const DoubleCheck = ({ deleteNode, cancel }) => {
  return(
    <div className='small_modal'>
      <h2>Are you sure to delete this item?</h2>
      <div className='btn_container'>
      <div className='btn_dismiss' onClick={() => cancel()}>Cancel</div>
        <div className='btn_delete_text' onClick={() => deleteNode()}>Delete</div>
      </div>
    </div>
  )
}

const randomWhatPlaceholder = () => {
  const whatPlaceholder = [
    'Found out a new thing',
    'Started a new project',
    'Finished a project',
    'Learned something new',
    'Tried something new for the first time',
    'Moved to a new place',
    'Got a new job',
    'Started a new hobby',
  ]
  return whatPlaceholder[Math.floor(Math.random() * whatPlaceholder.length)]
}

export default Modal;