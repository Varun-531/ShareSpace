// import React from 'react'
import toast from 'react-hot-toast'

const ErrorToast = () => {
  return (
    toast.error('You must be logged in to access this page')
  )
}

export default ErrorToast