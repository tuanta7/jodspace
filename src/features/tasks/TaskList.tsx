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
    ];
    return (
        <div className="rounded-lg border border-neutral-600 p-3 min-w-[400px]">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold">Tasks</h2>
                <button className="btn btn-sm btn-ghost p-1">
                    <PlusCircleIcon className="w-5 h-5 text-success" />
                </button>
            </div>
            <div className="pr-1 grid gap-3">
                {mockLists.map((task) => (
                    <TaskItem key={task.id} task={task} />
                ))}
            </div>
        </div>
    );
}

export default TaskList;
