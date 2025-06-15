import { Task } from './TaskList';

interface TaskItemProps {
    task: Task;
}

function TaskItem({ task }: TaskItemProps) {
    return (
        <div className="py-1 px-2 border rounded-xl w-full">
            <h2 className="font-semibold text-sm">{task.name}</h2>
            <p className="text-xs">Deadline: {task.deadline}</p>
        </div>
    );
}

export default TaskItem;
