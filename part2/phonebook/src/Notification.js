const Notification =({message,isSuccess}) => {
    if (message === null) {
        return null;
    }
    if(isSuccess){
        return (
            <p className='success'>
                {message}
            </p>
        )
    }
    return (
        <p className='error'>
            {message}
        </p>
    )
    
}
export default Notification;