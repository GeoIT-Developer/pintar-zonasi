import { ObjectLiteral } from '@/types/object-literal.interface';

export async function fetchAI(rawData: ObjectLiteral) {
    const response = await fetch('/api/ai', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(rawData),
    });

    if (response.status === 200) {
        const resData = await response.json();
        return {
            ok: true,
            message: 'success',
            data: resData?.data as string,
        };
    } else {
        return { ok: false, message: JSON.stringify(response.json()) };
    }
}
