import React from 'react';

const EmptyPage = ({ params }: { params: { id: string } }) => {
    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Project {params.id}</h5>
                    <p>Use this page to start from scratch and place your custom content.</p>
                </div>
            </div>
        </div>
    );
};

export default EmptyPage;
