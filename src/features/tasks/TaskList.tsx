import { PlusCircleIcon } from '@heroicons/react/24/outline';
import TaskItem from './TaskItem';

export interface Task {
    id: string;
    name: string;
    done: boolean;
    deadline: string;
}

function TaskList() {
    const mockLists: Task[] = [
        { id: '111111111', name: 'Feature A', done: false, deadline: '13/07/2025' },
        { id: '222222222', name: 'Feature B', done: false, deadline: '13/07/2025' },
        { id: '222222223', name: 'Feature B', done: false, deadline: '13/07/2025' },
        { id: '222222224', name: 'Feature B', done: false, deadline: '13/07/2025' },
    ];
    return (
        <div className="w-full p-3">
            <div className="flex h-[30px] items-center gap-2 px-3">
                <h2 className="text-lg font-bold">To-do List</h2>
                <button className="btn btn-sm btn-ghost btn-circle">
                    <PlusCircleIcon className="text-success h-5 w-5" />
                </button>
            </div>
            <div className="m-2 grid max-h-[130px] gap-3 overflow-auto pr-3">
                {mockLists.map((task) => (
                    <TaskItem key={task.id} task={task} />
                ))}
            </div>
        </div>
    );
}

export default TaskList;
