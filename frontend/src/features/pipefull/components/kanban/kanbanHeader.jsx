// const task = [
//     {id: 1, status: 'BACKLOG'},
//     {id: 2, status: 'TO_DO'},
//     {id: 3, status: 'IN_PROGRESS'},
//     {id: 4, status: 'IN_REVIEW'},
//     {id: 5, status: 'DONE'}
// ]

export function KanbanHeader({status}) {
    return (
        <div className="px-2 py-1.5 flex items-center justify-between">
            <div className="flex items-center gap-x-2">
                <h2>
                    {status}
                </h2>
            </div>
        </div>
    )
}