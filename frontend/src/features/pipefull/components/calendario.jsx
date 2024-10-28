import { format, getDay, parse, startOfWeek, addMonths, subMonths } from "date-fns"
import { ptBR } from "data-fns/locale"
import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import { useState } from "react"

// props para calendario
const dataCalendar = {
    data: []
}

const locales = {
    "pt-BR": ptBR
}

const localizer = dateFnsLocalizer({
    format, parse, startOfWeek, getDay, locales
})

export default function Calendario() {
    const [value, setValue] = useState(
        data.length > 0 ? new Date(data[0].dueDate) : new Date()
    );

    const events = data.map((task) => ({
        start: new Date(task.dueDate),
        end: new Date(task.dueDate),
        title: task.name,
        project: task.project,
        assignee: task.assignee,
        status: task.status,
        id: task.$id
    }))

    const handleNavigate = (action) => {
        if (action === "PREV") {
            setValue(subMonths(value, 1))
        } else if (action === "NEXT") {
            setValue(addMonths(value, 1))
        } else if (action === "TODAY") {
            setValue(new Date())
        }
    }

    return(
        <Calendar />
    )
}