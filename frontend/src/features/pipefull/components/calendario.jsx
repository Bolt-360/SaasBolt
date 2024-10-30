// import { format, getDay, parse, startOfWeek, addMonths, subMonths } from "date-fns";
// import { Calendar, dateFnsLocalizer } from "react-big-calendar";
// import { useState } from "react";
// import "react-big-calendar/lib/css/react-big-calendar.css"; 
// import ptBR from 'date-fns/locale/pt-BR';

// // Configuração do idioma pt-BR para o localizador
// const locales = {
//     "pt-BR": ptBR
// };

// const localizer = dateFnsLocalizer({
//     format,
//     parse,
//     startOfWeek,
//     getDay,
//     locales,
// });

// // Mensagens em português para o calendário
// const messages = {
//     previous: "Anterior",
//     next: "Próximo",
//     today: "Hoje",
//     month: "Mês",
//     week: "Semana",
//     day: "Dia",
//     date: "Data",
//     time: "Hora",
//     event: "Evento",
//     noEventsInRange: "Nenhum evento neste período.",
// };

// // Formatação dos dias e títulos do calendário para pt-BR
// const formats = {
//     dayFormat: (date, culture, localizer) =>
//         localizer.format(date, "EEEE", culture).charAt(0).toUpperCase() + 
//         localizer.format(date, "EEEE", culture).slice(1),
//     weekdayFormat: (date, culture, localizer) =>
//         localizer.format(date, "EEEEEE", culture).charAt(0).toUpperCase() +
//         localizer.format(date, "EEEE", culture).slice(1), // Abreviação do dia da semana em pt-BR
//     monthHeaderFormat: (date, culture, localizer) =>
//         localizer.format(date, "MMMM yyyy", culture).replace(/\b\w/g, (l) => l.toUpperCase()),
// };

// export default function Calendario({ dataTable }) {
//     const [value, setValue] = useState(new Date()); // Valor inicial ajustado para data atual

//     console.log(dataTable.map(data => data.dueDate));

//     // Mapeando os eventos do dataTable para o formato esperado pelo calendário
//     const events = dataTable.map((task) => {
//         const startDate = new Date(task.data);
//         const dueDate = new Date(task.dueDate);
    
//         return {
//             start: startDate.toLocaleDateString("pt-BR", {
//                 timeZone: "America/Sao_Paulo",
//                 day: "2-digit",
//                 month: "2-digit",
//                 year: "numeric",
//             }),
//             end: dueDate.toLocaleDateString("pt-BR", {
//                 timeZone: "America/Sao_Paulo",
//                 day: "2-digit",
//                 month: "2-digit",
//                 year: "numeric",
//             }),
//             title: task.task,
//             project: task.projeto,
//             assignee: task.responsavel,
//             status: task.status,
//             id: task.id,
//         };
//     });

//     console.log(events);

//     const handleNavigate = (action) => {
//         if (action === "PREV") {
//             setValue(subMonths(value, 1));
//         } else if (action === "NEXT") {
//             setValue(addMonths(value, 1));
//         } else if (action === "TODAY") {
//             setValue(new Date());
//         }
//     };

//     return (
//         <Calendar
//             localizer={localizer}
//             events={events}
//             startAccessor="end"
//             endAccessor="end"
//             style={{ height: 500 }}
//             date={value}
//             messages={messages} 
//             onNavigate={(date, view, action) => handleNavigate(action)}
//             formats={formats} 
//             culture="pt-BR" 
//             views={["month", "week", "day"]}
//         />
//     );
// }


import { format, getDay, parse, startOfWeek, addMonths, subMonths, parseISO } from "date-fns";
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

    // Função auxiliar para ajustar o fuso horário
    const adjustTimezone = (dateString) => {
        const date = new Date(dateString);
        return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    };

    // Mapeando os eventos com datas corrigidas
    const events = dataTable.map((task) => {
        // Ajusta as datas para o fuso horário local
        const startDate = adjustTimezone(task.data);
        const dueDate = adjustTimezone(task.dueDate);

        return {
            start: startDate,
            end: dueDate,
            title: task.task,
            project: task.projeto,
            assignee: task.responsavel,
            status: task.status,
            id: task.id,
        };
    });

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
            culture="pt-BR" 
            views={["month", "week", "day"]}
        />
    );
}