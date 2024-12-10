import ProjectDetailPage from '@/containers/ZonasiPage/project/detail';
import React from 'react';

export default function Page({ params }: { params: { metadata_id: string } }) {
    return <ProjectDetailPage metadata_id={params.metadata_id} />;
}
