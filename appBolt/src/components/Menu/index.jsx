import { IconMenu } from './IconMenu'
import { MenuList } from './MenuList'
import { Container } from './style'
import { useState } from 'react'


export function Menu() {
    const [sidebar, setSidebar] = useState(false)

    const toggleSidebar = () => setSidebar(prevState => !prevState)

    return (
        <Container sidebar={sidebar}>
            <IconMenu toggleSidebar={toggleSidebar}/>
            <MenuList />
        </Container>
    )
}