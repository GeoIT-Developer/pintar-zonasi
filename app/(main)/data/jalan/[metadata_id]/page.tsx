import JalanDetailPage from '@/containers/data/JalanPage/detail';
import React from 'react';

export default function Page({ params }: { params: { metadata_id: string } }) {
    return <JalanDetailPage metadata_id={params.metadata_id} />;
}
