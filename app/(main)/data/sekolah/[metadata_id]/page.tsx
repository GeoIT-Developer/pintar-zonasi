import SekolahDetailPage from '@/containers/data/SekolahPage/detail';
import React from 'react';

export default function Page({ params }: { params: { metadata_id: string } }) {
    return <SekolahDetailPage metadata_id={params.metadata_id} />;
}
