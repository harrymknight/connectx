import React from 'react'
import './error-message.css'

const ErrorMessage: React.FC<any> = ({ value }: {value: string}) => {
    return (
        <div className="error-message" >
            {value}
        </div>
    )
}

export default ErrorMessage