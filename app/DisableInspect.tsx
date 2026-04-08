'use client'
import { useEffect } from 'react'

export default function DisableInspect() {
    useEffect(() => {
        // Disable right click
        document.addEventListener('contextmenu', e => e.preventDefault())

        // Disable keys
        document.addEventListener('keydown', function (e) {
            if (
                e.key === 'F12' ||
                (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                (e.ctrlKey && e.shiftKey && e.key === 'J') ||
                (e.ctrlKey && e.shiftKey && e.key === 'C') ||
                (e.ctrlKey && e.key === 'U')
            ) {
                e.preventDefault()
            }
        })
    }, [])

    return null
}