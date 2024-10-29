import { format, getDay, parse, startOfWeek, addMonths, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css"; 

const locales = {
    "pt-BR": ptBR
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});


const messages = {
    allDay: "Dia inteiro",
    previous: "Anterior",
    next: "Próximo",
    today: "Hoje",
    month: "Mês",
    week: "Semana",
    day: "Dia",
    agenda: "Agenda",
    date: "Data",
    time: "Hora",
    event: "Evento",
    noEventsInRange: "Nenhum evento neste período.",
    showMore: (total) => `+ Ver mais (${total})`
};

// Formatação dos dias e títulos do calendário
const formats = {
    dayFormat: (date, culture, localizer) =>
        localizer.format(date, "EEEE", culture).charAt(0).toUpperCase() + 
        localizer.format(date, "EEEE", culture).slice(1),
    weekdayFormat: (date, culture, localizer) =>
        localizer.format(date, "EEEEEE", culture), // Exibe a abreviação em português
    monthHeaderFormat: (date, culture, localizer) =>
        localizer.format(date, "MMMM yyyy", culture).replace(/\b\w/g, (l) => l.toUpperCase()),
};

export default function Calendario() {
    const eventos = [
        {
            dueDate: "2024-11-01",
            name: "Reunião de Planejamento",
            project: "Projeto A",
            assignee: "João Silva",
            status: "Em andamento",
            $id: "1"
        },
        {
            dueDate: "2024-11-08",
            name: "Revisão de Código",
            project: "Projeto B",
            assignee: "Maria Santos",
            status: "Concluído",
            $id: "2"
        },
    ];

    const [value, setValue] = useState(
        eventos.length > 0 ? new Date(eventos[0].dueDate) : new Date()
    );

    const events = eventos.map((task) => ({
        start: new Date(task.dueDate),
        end: new Date(task.dueDate),
        title: task.name,
        project: task.project,
        assignee: task.assignee,
        status: task.status,
        id: task.$id,
    }));

    const handleNavigate = (action) => {
        if (action === "PREV") {
            setValue(subMonths(value, 1));
        } else if (action === "NEXT") {
            setValue(addMonths(value, 1));
        } else if (action === "TODAY") {
            setValue(new Date());
        }
    };

    return (
        <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            date={value}
            messages={messages} 
            onNavigate={(date, view, action) => handleNavigate(action)}
            formats={formats} 
        />
    );
}


// A data não atualiza automaticamente quando o usúario passa os dias.