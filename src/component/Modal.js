import { useEffect, useState } from 'react'
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import DatePicker from 'react-date-picker';

const Modal = ({ content, cancel, save, editWhat, editWhen, deleteNode }) => {
  const [isShowDoubleCheck, setIsShowDoubleCheck] = useState(false);
  const onClickDlete = () => {
    setIsShowDoubleCheck(false)
    deleteNode()
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
                <div className='modal_title'>What?</div>
                <input className='modal_content'
                  onChange={editWhat}
                  value={content.what}
                />
              </div>
              <div className='modal_when'>
                <div className='modal_title'>When?</div>
                <DatePicker onChange={editWhen} value={content.when} />
              </div>
              <div className='btn_container'>
                <div className='btn_dissmiss' onClick={() => cancel()}>Dissmiss</div>
                {content.nodePostiion !== 'start' && content.nodePostiion !== 'end' &&
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
        <div className='modal_background' onClick={() => cancel()}></div>
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
      <div className='btn_dissmiss' onClick={() => cancel()}>Cancel</div>
        <div className='btn_delete_text' onClick={() => deleteNode()}>Delete</div>
      </div>
    </div>
  )
}

export default Modal;