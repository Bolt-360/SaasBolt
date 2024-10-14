import { Usuario } from './style'
import user from '../../assets/user.png'

export function User() {
    return (
        <Usuario>
            <img src={user} alt="" />
        </Usuario>
    )
}