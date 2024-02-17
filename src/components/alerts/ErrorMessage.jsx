import Swal from 'sweetalert2'

export const ErrorMessage = (message) => {
    return Swal.fire({
        title: 'Error!',
        text: message,
        icon: 'error',
        confirmButtonText: 'Ok'
    })
}
