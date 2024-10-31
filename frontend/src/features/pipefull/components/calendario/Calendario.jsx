import { TZDate } from "@date-fns/tz";
import { format, getDay, parse, startOfWeek, addMonths, subMonths, addHours } from "date-fns";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css"; 
import ptBR from 'date-fns/locale/pt-BR';
import "./calendario.css"
import { CardCalendario } from "./cardCalendario";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

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
        localizer.format(date, "EEE", culture).slice(1),
    monthHeaderFormat: (date, culture, localizer) =>
        localizer.format(date, "MMMM yyyy", culture).replace(/\b\w/g, (l) => l.toUpperCase()),
};


export default function Calendario({ dataTable }) {
    const [value, setValue] = useState(new Date());
    
    const CustomToolbar = ( {date, onNavigate} ) => {
        return(
            <div className="flex mb-4 gap-x-2 items-center w-full lg:w-auto justify-center lg:justify-start">
                <Button 
                onClick={() => onNavigate("PREV")}
                size="icon"
                className="flex items-center bg-white text-black hover:bg-gray-100"
                >
                    <ChevronLeftIcon className="size-4" />
                </Button>
                <div className="flex items-center border border-input rounded-md px-3 py-2 h-8 justify-center w-full lg:w-auto">
                    <CalendarIcon className="size-4 mr-2"/>
                    <p className="text-sm">{format(date, "MMMM yyyy")}</p>
                </div>
                <Button 
                onClick={() => onNavigate("NEXT")}
                size="icon"
                className="flex items-center bg-white text-black hover:bg-gray-100"
                >
                    <ChevronRightIcon className="size-4" />
                </Button>
            </div>
        )
    }

    // Mapeando os eventos com datas corrigidas
    const events = dataTable.map((event) => {
        const dueTime = new TZDate(event.dueDate)
        const dueDate = dueTime.withTimeZone("America/Sao_Paulo")
        const dueDateWithAddedHours = addHours(dueDate, 24);
        return {
            start: new Date(event.data),
            end: new Date(dueDateWithAddedHours.toString()),
            title: event.task,
            project: event.projeto,
            assignee: event.responsavel,
            status: event.status,
            id: event.id,
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
            className="px-3"
            components={{
                eventWrapper: ({ event }) => (
                    <CardCalendario
                    id={event.id}
                    title={event.title}
                    project={event.project}
                    assignee={event.assignee}
                    status={event.status}
                    />
                ),
                toolbar: () => (
                    <CustomToolbar 
                    date={value}
                    onNavigate={handleNavigate}
                    />
                )
            }}
        />
    );
}