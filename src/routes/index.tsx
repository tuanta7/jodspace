import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
    component: Index,
});

function Index() {
    const navigate = useNavigate({});

    return (
        <div>
            <button
                className="btn btn-success"
                onClick={() => {
                    navigate({
                        to: '/workspace',
                        search: { file: 'new' },
                    });
                }}
            >
                New
            </button>
        </div>
    );
}
