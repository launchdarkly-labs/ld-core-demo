import { useEffect } from 'react'

export default function InfinityLoader() {
    useEffect(() => {
        async function getLoader() {
            const { infinity } = await import('ldrs')
            infinity.register('l-infinity')
        }
        getLoader()
    }, [])
    return <l-infinity
        size="55"
        stroke="4"
        stroke-length="0.15"
        bg-opacity="0.1"
        speed="1.3"
        color="black"
    />
}