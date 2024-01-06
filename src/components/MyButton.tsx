import React from 'react'

const MyButton = ({title}) => {
  return (
    <button style={{backgroundColor:'black', fontWeight:'bold',color:'white',padding:'2px 8px' ,border:'1px solid yellowgreen',borderRadius:5}}>{title}</button>
  )
}

export default MyButton