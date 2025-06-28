import { Task } from './TaskList';

interface TaskItemProps {
    task: Task;
}

function TaskItem({ task }: TaskItemProps) {
    return (
        <div className="flex w-full items-center gap-3 rounded-xl border border-neutral-600 px-3 py-1">
        
            <input type="checkbox" className="checkbox checkbox-xs" checked={task.done} />
            <div className="max-w-[200px] text-wrap">
                <h2 className="text-sm font-semibold">{task.name}</h2>
                <p className="text-xs">Deadline: {task.deadline}</p>
            </div>
        </div>
    );
}

export default TaskItem;
