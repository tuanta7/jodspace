import TaskItem from './TaskItem';

export interface Task {
    id: string;
    done: boolean;
}

function TaskList() {
    const mockLists: Task[] = [
        { id: '111111111', done: false },
        { id: '222222222', done: false },
        { id: '333333333', done: false },
        { id: '111111111', done: false },
        { id: '222222222', done: false },
        { id: '333333333', done: false },
    ];
    return (
        <div className="py-3 pl-3">
            <h2 className="mb-3 font-semibold text-xl">To-do List</h2>
            <div className="overflow-y-auto">
                <div className="pr-3 grid gap-3 ">
                    {mockLists.map((task) => (
                        <TaskItem key={task.id} task={task} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TaskList;
