import { TZDate } from "@date-fns/tz";
import { format, getDay, parse, startOfWeek, addMonths, subMonths, addHours } from "date-fns";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css"; 
import ptBR from 'date-fns/locale/pt-BR';

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
    previous: "Anterior",
    next: "Próximo",
    today: "Hoje",
    month: "Mês",
    week: "Semana",
    day: "Dia",
    date: "Data",
    time: "Hora",
    event: "Evento",
    noEventsInRange: "Nenhum evento neste período.",
};

const formats = {
    dayFormat: (date, culture, localizer) =>
        localizer.format(date, "EEEE", culture).charAt(0).toUpperCase() + 
        localizer.format(date, "EEEE", culture).slice(1),
    weekdayFormat: (date, culture, localizer) =>
        localizer.format(date, "EEEEEE", culture).charAt(0).toUpperCase() +
        localizer.format(date, "EEEE", culture).slice(1),
    monthHeaderFormat: (date, culture, localizer) =>
        localizer.format(date, "MMMM yyyy", culture).replace(/\b\w/g, (l) => l.toUpperCase()),
};

export default function Calendario({ dataTable }) {
    const [value, setValue] = useState(new Date());

    // // Função auxiliar para ajustar o fuso horário
    // const adjustTimezone = (dateString) => {
    //     const date = new Date(dateString);
    //     return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    // };

    // Mapeando os eventos com datas corrigidas
    const events = dataTable.map((task) => {
        const dueTime = new TZDate(task.dueDate)
        const dueDate = dueTime.withTimeZone("America/Sao_Paulo")
        const dueDateWithAddedHours = addHours(dueDate, 24);
        return {
            start: new Date(task.data),
            end: new Date(dueDateWithAddedHours.toString()),
            title: task.task,
            project: task.projeto,
            assignee: task.responsavel,
            status: task.status,
            id: task.id,
        };
    });

    console.log(events);

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
            startAccessor="end"
            endAccessor="end"
            style={{ height: 500 }}
            date={value}
            messages={messages} 
            onNavigate={(date, view, action) => handleNavigate(action)}
            formats={formats} 
            culture="pt-BR" 
            views={["month", "week", "day"]}
        />
    );
}