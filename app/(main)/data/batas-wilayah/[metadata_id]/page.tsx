import BatasWilayahDetailPage from '@/containers/data/BatasWilayahPage/detail';
import React from 'react';

export default function Page({ params }: { params: { metadata_id: string } }) {
    return <BatasWilayahDetailPage metadata_id={params.metadata_id} />;
}
