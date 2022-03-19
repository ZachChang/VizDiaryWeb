import { useState, useEffect } from 'react'
import CheckIcon from '@mui/icons-material/Check';
import DatePicker from 'react-date-picker';

const Modal = ({ content, cancel, save, editWhat, editWhen }) => {
    const [value, onChange] = useState(new Date());
    useEffect(() => {
        editWhen(value)
    }, [value])
    
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
            <DatePicker onChange={onChange} value={value} />
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

export default Modal;