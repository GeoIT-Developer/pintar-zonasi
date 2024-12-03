import PesertaDidikDetailPage from '@/containers/data/PesertaDidikPage/detail';
import React from 'react';

export default function Page({ params }: { params: { metadata_id: string } }) {
    return <PesertaDidikDetailPage metadata_id={params.metadata_id} />;
}
