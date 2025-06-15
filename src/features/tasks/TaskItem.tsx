import { Task } from './TaskList';

interface TaskItemProps {
    task: Task;
}

function TaskItem({ task }: TaskItemProps) {
    return <div className="text-primary p-2 border rounded-lg">{task.id}</div>;
}

export default TaskItem;
